function map( value,  istart,  istop,  ostart,  ostop) {
      return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
}

var min_freq = 30, max_freq = 4000;
var min_vol = 0, max_vol = 1;


var freq=440;
var volume=0.5;

var audioContext, osc, gain;
var osc_types = ['sine', 'square', 'sawtooth', 'triangle'];
var current_note;

function init() {
  audioContext = new(window.AudioContext || window.webkitAudioContext)();
  gain = audioContext.createGain();
  gain.gain.value = 1;
  osc = audioContext.createOscillator();
  osc.type = osc_types[0];
  osc.frequency.value = 0;
  osc.detune.value = 0;
  osc.connect(gain);
  osc.start(0);
  gain.connect(audioContext.destination);

}
init();



function hand_elevation(hand) {
  var sum = 0, counter = 0, avrg = 0;
  hand.fingers.forEach(function(finger){
    if(finger.tipPosition[1] != 0){
      sum += finger.tipPosition[1];
      counter++
    }
  });
  if(sum/counter < min_hand_height){
    avrg = min_hand_height;
  }else if (sum/counter > max_hand_height) {
    avrg = max_hand_height;
  }else{
    avrg = sum/counter;
  }
  return avrg;
}





// Store frame for motion functions
var previousFrame = null;
var paused = false;
var pauseOnGesture = true;

var min_hand_height = 50, max_hand_height = 320;


// Setup Leap loop with frame callback function
var controllerOptions = {enableGestures: true};

// to use HMD mode:
// controllerOptions.optimizeHMD = true;
Leap.loop(controllerOptions, function(frame) {
  if (paused) {
    gain.gain.value = min_vol;
    return; // Skip this update
  }

  if (frame.hands.length > 0) {
    for (var i = 0; i < frame.hands.length; i++) {
      var hand = frame.hands[i];
      if (hand.type == 'right') {
        osc.frequency.value = map(hand_elevation(hand), min_hand_height, max_hand_height, min_freq, max_freq);
      }
      if (hand.type == 'left') {
        gain.gain.value = map(hand_elevation(hand), min_hand_height, max_hand_height, min_vol, max_vol);
      }
    }
  }

  // Store frame for motion functions
  previousFrame = frame;
})

function vectorToString(vector, digits) {
  if (typeof digits === "undefined") {
    digits = 1;
  }
  return "(" + vector[0].toFixed(digits) + ", "
             + vector[1].toFixed(digits) + ", "
             + vector[2].toFixed(digits) + ")";
}

function togglePause() {
  paused = !paused;

  if (paused) {
    document.getElementById("pause").innerText = "Resume";
  } else {
    document.getElementById("pause").innerText = "Pause";
  }
}

document.body.onkeyup = function(e){
    if(e.keyCode == 32){
        togglePause();
    }
}
