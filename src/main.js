let AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = new AudioContext();
let panner = audioCtx.createPanner();
let analyser = audioCtx.createAnalyser();

let soundUrls = {
  footstep: [],
  shots: [],
  other: []
};

let sounds = {};

const Vector = require("./Vector.js");
const Buffer = require("./Buffer.js");

function playAudio(vector, audio, level) {}

function setArrow(vector) {
  let audioVector = document.querySelector("#audioVector");
  audioVector.style.transform = `rotateX(${vector.angle.theta}deg) rotateZ(${
    vector.angle.phi
  }deg)`;
  audioVector.style.height = `${vector.magnitude * 10}px`;
}

sounds.footstep = new Buffer(audioCtx, soundUrls.footstep);
sounds.shots = new Buffer(audioCtx, soundUrls.shots);
sounds.other = new Buffer(audioCtx, soundUrls.other);

sounds.footstep.loadAll();
sounds.shots.loadAll();
sounds.other.loadAll();

function randomInt(max) {
  return Math.floor(Math.random() * max);
}

let vector = new Vector(
  randomInt(20) - 10,
  randomInt(20) - 10,
  randomInt(20) - 10
);
setArrow(vector);
