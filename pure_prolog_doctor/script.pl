/**
 * Core logic of patient with a sympathetic doctor
 * chatbot program
 * @author soh jun jie
 * @version 1.0
 * @since 2018-3-4
 */

:- ['gesture.pl', 'illness.pl', 'lib.pl'].

is_yes(yes).

%% 0. main entry point to chatbot diagnosis
start_diagnosis(Illness):-
  build_illness_list_counter(ListCounter),                          % initialise the illness list counter
  (
    ask_pain_level(Pain_level), ask_patient_mood(Mood) ->           % find appropriate gesturing only after patient pain and mood identified
      appropriate_gesture(Pain_level, Mood, G)
  ),                                                                % perform the diagnosis with appropriate gesturing
  ask_patient_where_wrong('Do you feel anywhere wrong?', Illness, G, ListCounter),
  write_list(['Here is your diagnosis: ', Illness, '.']).


%% 1. identify patient pain level
ask_pain_level(Pain_level):-
  pain_library(Pain_list), member(Pain_level, Pain_list),
    write_list(['Is your pain ', Pain_level, '? (yes/no)']),
    read(R), is_yes(R),                                             % ask pain level recursively if reply is not yes
    assert(pain(Pain_level));
  ask_pain_level(Pain_level).

%% 2. identify patient mood
ask_patient_mood(Mood):-
  mood_library(Mood_list), member(Mood, Mood_list),
    write_list(['How is your mood? Are you ', Mood, '? (yes/no)']),
    read(R), is_yes(R),                                             % ask mood recursively if reply is not yes
    assert(mood(Mood));
  ask_patient_mood(Mood).

%% 3. gesture rule base on pain level and mood
%% gesture.pl

%% 4. Find out the patient Illness through appropriate gesturing
ask_patient_where_wrong(Q, Illness, Gestures, ListCounter):-
  ask_patient_question(Q),
    ask_illness_symptom(I, Gestures),                               % ask about a random symptom with appropriate gesturing, returning I=illness if have random symptom
    increment_illness_counter(ListCounter, I, UpdatedListCounter),  % IllnessListCounter for I=Illness incremented
    ask_patient_where_wrong('Do you still feel anywhere wrong?', Illness, Gestures, UpdatedListCounter);
  give_illness_diagnosis(ListCounter, Illness).                     % give the final illness diagnosis, returning the Illness highest in ListCounter


% ask patient a question, fails if reply is not yes
ask_patient_question(Q):-
  write_list([Q, ' (yes/no)']),
  read(R), is_yes(R).


%% Ask patient if have a random symptom with appropriate gesturing
ask_illness_symptom(Illness, Gestures):-
  random_member(G, Gestures),
  get_random_illness_symptom(Illness, Symptom),
  write_list(['Do you have a ', Symptom, '? *', G, '*' , ' (yes/no)']),
  read(R), is_yes(R),
  write_list(['Looks like it is a ', Illness, '.']);
  ask_illness_symptom(Illness, Gestures).
