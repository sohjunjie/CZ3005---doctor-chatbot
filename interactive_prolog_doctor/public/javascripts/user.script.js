function shuffleArray(o) {
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
};

function randomArrayItem(arr) {
  return arr[Math.floor(Math.random()*arr.length)];
}

function play_notification_sound(soundpath){
  let audio = new Audio(soundpath);
  audio.play();
}
