const WELCOME_STATE = 0;
const AFTER_WELCOME_STATE = 1;
const PATIENT_MOOD_KNOWN_STATE = 2;
const PATIENT_PAIN_KNOWN_STATE = 3;
const GESTURE_IDENTIFIED_STATE = 4;
const ILLNESS_DIAGNOSIS_STATE = 5;
const IDENTIFY_ILLNESS_STATE = 6;
const DIAGNOSIS_COMPLETED_STATE = 7;

var doctor = {};
doctor.patient = {};
doctor.patient.mood = null;
doctor.patient.pain = null;
doctor.patient.illness = null;
doctor.patient.symptom = null;
doctor.patient.illnessCounter = {};
doctor.patient.finalDiagnosis = null;

doctor.state = WELCOME_STATE;
doctor.moodLibrary = null;
doctor.painLibrary = null;
doctor.gestureList = null;

doctor.displayDateSummary = function() {
  let systemMessage = {
    DateSummary: "Today"
  };
  $("#messageSystemTemplate").tmpl(systemMessage).appendTo("#ChatMessageContainer");
}

// create incoming doctor message
doctor.sendMessage = function(msg) {
  play_notification_sound('sound/sound4.mp3')
  let messageDetail = {
    AuthorFullName: "My favourite doctor",
    Message: msg,
    MessageTime: moment(new Date()).format('hh:mm A')
  };
  $("#messageInTemplate").tmpl(messageDetail).appendTo("#ChatMessageContainer");
};

// create outgoing patient message
doctor.replyMessage = function(msg) {
  play_notification_sound('sound/sound3.mp3')
  let messageDetail = {
    AuthorFullName: "Me",
    Message: msg,
    MessageTime: moment(new Date()).format('hh:mm A')
  };
  $("#messageOutTemplate").tmpl(messageDetail).appendTo("#ChatMessageContainer");
  document.getElementById("ChatMessageContainer").lastChild.scrollIntoView();
};

// doctor welcome message to patient and start off by asking patient mood
doctor.dislayWelcomeMessage = function() {
  doctor.displayDateSummary();
  doctor.sendMessage("Oh dear, u do not look so well <i class=\"em em-fearful\"></i> " +
                     "You srsly need an expert doctor diagnosis.");
  doctor.queryPatientMood();
};

// initialised mood library, pain library and determine patient mood
doctor.queryPatientMood = function() {

  if (doctor.state == WELCOME_STATE) {
    doctor.state = AFTER_WELCOME_STATE;
    $.ajax({
      async: false,
      type: "GET",
      dataType: 'json',
      url: "mood/list",
      success: function(data, status){
        doctor.moodLibrary = shuffleArray(data.moodList);
      },
      error: function(err) {
        doctor.state = WELCOME_STATE;
      }
    });
    $.ajax({
      async: false,
      type: "GET",
      dataType: 'json',
      url: "pain/list",
      success: function(data, status){
        doctor.painLibrary = shuffleArray(data.painList);
      },
      error: function(err) {
        doctor.state = WELCOME_STATE;
      }
    });
  }

  if (doctor.state == AFTER_WELCOME_STATE) {
    doctor.patient.mood = doctor.moodLibrary.pop();
    if (doctor.moodLibrary.length <= 0) {
      doctor.sendMessage("Looks like you must be feeling " + doctor.patient.mood.replace(/_/g, " ") + "... :/" );
      doctor.handlePatientResponse("yes");
    } else {
      doctor.sendMessage("How is your mood? Are you feeling " + doctor.patient.mood.replace(/_/g, " ") + "?" );
    }
  }

};

// determine patient pain level
doctor.queryPatientPain = function() {

  if (doctor.state == PATIENT_MOOD_KNOWN_STATE) {
    doctor.patient.pain = doctor.painLibrary.pop();
    if (doctor.painLibrary.length <= 0) {
      doctor.sendMessage("Looks like your pain is " + doctor.patient.pain.replace(/_/g, " ") + "... :/" );
      doctor.handlePatientResponse("yes");
    } else {
      doctor.sendMessage("Is your pain " + doctor.patient.pain.replace(/_/g, " ") + "?" );
    }
  }

};

// determine appropriate gesturing base on patient mood and pain level
doctor.selectProperGesture = function() {
  let api_url = "gesture/list?pain=" + doctor.patient.pain + "&mood=" + doctor.patient.mood;
  $.ajax({
    async: false,
    type: "GET",
    dataType: 'json',
    url: api_url,
    success: function(data, status){
      doctor.gestureList = shuffleArray(data.gestureList);
      doctor.state = GESTURE_IDENTIFIED_STATE;
      doctor.sendMessage("I understand now. I shall then start diagnose ur illness.");
    },
    error: function(err) {
      console.log(err);
    }
  });
}

// Ask patient whether having a certain random illness symptom
doctor.queryPatientIllnessSymptom = function(){

  $.ajax({
    async: false,
    type: "GET",
    dataType: 'json',
    url: "random/illness/symptom",
    success: function(data, status){
      let gesture = randomArrayItem(doctor.gestureList);
      doctor.patient.illness = data.illness;
      doctor.patient.symptom = data.symptom;
      doctor.sendMessage("Do you have a " + doctor.patient.symptom.replace(/_/g, " ") + "? *" + gesture.replace(/_/g, " ") + "* " +
                         "<i class=\"em " + doctor.gestureToEmojiMapping(gesture) + "\"></i>");
    },
    error: function(err) {
      console.log(err);
    }
  });

}

// doctor chatbot algorithm handles user yes no response base on the diagnosis
// progress state
doctor.handlePatientResponse = function(resp) {

  if (doctor.state == AFTER_WELCOME_STATE){
          if (resp == "yes") {
            doctor.state = PATIENT_MOOD_KNOWN_STATE;
            resp = "awaiting doctor prompt";
          } else {
            doctor.queryPatientMood();
          }
  }

  if (doctor.state == PATIENT_MOOD_KNOWN_STATE) {
          if (resp == "yes") {
            doctor.state = PATIENT_PAIN_KNOWN_STATE;
            resp = "awaiting doctor prompt";
          } else {
            doctor.queryPatientPain();
          }
  }

  if (doctor.state == PATIENT_PAIN_KNOWN_STATE) {
          resp = "awaiting doctor prompt";
          doctor.selectProperGesture();
  }

  if (doctor.state == GESTURE_IDENTIFIED_STATE) {
          if (resp == "yes") {
            doctor.sendMessage('Looks like it is a ' + doctor.patient.illness.replace(/_/g, " ") + '.');
            if (!(doctor.patient.illness in doctor.patient.illnessCounter)) {
              doctor.patient.illnessCounter[doctor.patient.illness] = 1;
            } else {
              doctor.patient.illnessCounter[doctor.patient.illness] += 1;
            }

            doctor.sendMessage('Do u still feel anywhere wrong?');
            doctor.state = ILLNESS_DIAGNOSIS_STATE;
            resp = "awaiting patient response";
          } else {
            doctor.queryPatientIllnessSymptom();
          }
  }

  if (doctor.state == ILLNESS_DIAGNOSIS_STATE) {
          if (resp == "yes") {
            doctor.state = GESTURE_IDENTIFIED_STATE;
            doctor.queryPatientIllnessSymptom();
          }
          if (resp == "no") {
            doctor.state = IDENTIFY_ILLNESS_STATE;
          }
  }

  if (doctor.state == IDENTIFY_ILLNESS_STATE) {
          let max = -1;
          let illness = null;
          let diagnosisSummary = "SUMMARY<br/>";
          Object.entries(doctor.patient.illnessCounter).forEach(([key, value]) => {
            if (value > max) {
              max = value;
              illness = key;
            }
            diagnosisSummary = diagnosisSummary +
                               key + ": " + value + "<br/>"
          });

          if (illness != null){
            doctor.patient.finalDiagnosis = illness;
            doctor.sendMessage(diagnosisSummary + 'Here is your diagnosis: ' + illness.replace(/_/g, " ") + '. Alright end of diagnosis :)');
          } else {
            doctor.sendMessage('Here is your diagnosis: You are perfectly healthy! <i class="em em-muscle"></i>');
          }
          doctor.state = DIAGNOSIS_COMPLETED_STATE;
          resp = "no response expected";
  }

  if (doctor.state >= DIAGNOSIS_COMPLETED_STATE) {
          let badCustomerServiceMessage = ['Hey, no use spamming me. Our diagnosis session is over! <i class="em em-anger"></i>',
                                           'Go away! <i class="em em-angry"></i>',
                                           'Don\'t bother me <i class="em em-serious_face_with_symbols_covering_mouth"></i>',
                                           'The restart button is there for something, u know...'];
          if (resp == "yes" || resp == "no"){
            doctor.sendMessage(randomArrayItem(badCustomerServiceMessage));
          }
  }

};

// patient reply yes
doctor.replyMsgYes = function() {
  doctor.replyMessage("yes");
  doctor.handlePatientResponse("yes");
};

// patient reply no
doctor.replyMsgNo = function() {
  doctor.replyMessage("no");
  doctor.handlePatientResponse("no");
};

// patient restart doctor chatbot
doctor.restartDiagnosis = function() {
  $("#ChatMessageContainer").empty();
  doctor.state = WELCOME_STATE;
  doctor.patient.illnessCounter = {};
  doctor.dislayWelcomeMessage();
};

// convert gesture to emoji code use by emoji css library
// refer to https://afeld.github.io/emoji-css/ for full list of emoji
doctor.gestureToEmojiMapping = function(gesture) {

  emojiCode = "";

  switch(gesture) {
      case "look_concerned":
          emojiCode = "em-eyes";
          break;
      case "mellow_voice":
          emojiCode = "em-sound";
          break;
      case "light_touch":
          emojiCode = "em-raised_back_of_hand";
          break;
      case "faint_smile":
          emojiCode = "em-slightly_smiling_face";
          break;
      case "greet":
          emojiCode = "em-sunglasses";
          break;
      case "look_composed":
          emojiCode = "em-face_with_monocle";
          break;
      case "look_attentive":
          emojiCode = "em-male-doctor";
          break;
      case "broad_smile":
          emojiCode = "em-grin";
          break;
      case "joke":
          emojiCode = "em-clown_face";
          break;
      case "beaming_voice":
          emojiCode = "em-grinning_face_with_star_eyes";
          break;
  }

  return emojiCode;
}
