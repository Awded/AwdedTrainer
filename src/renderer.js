const electron = require("electron");
const path = require("path");
const fs = require("fs");
const Vector = require("./Vector.js");
const utils = require("./utils.js");
const AmbientFolders = ["Ambient"];
const TrainFolders = ["Footsteps", "Noise", "Shots", "Other"];

const audioCtx = new AudioContext(); //utils.createOfflineAudioContext(2, 5, 44100);

const SoundsPath = path.join(__dirname, "../Sounds");

let sounds = utils.loadAudio();

document.querySelector("#test").addEventListener("click", () => {
  playAudio(
    randomVector,
    randomVector,
    randomAudio(TrainFolders[utils.randomNumber(TrainFolders.length - 1)])
  );
});

async function playAudio(vectorFrom, vectorTo, filePath) {
  const source = audioCtx.createMediaElementSource(new Audio(filePath));
  const sourcePanner = audioCtx.createPanner();
  const sourceFilter = audioCtx.createBiquadFilter();

  const ambientBuffers = await utils.buffersFromFile(getAmbientNoises());

  const ambient = utils.mergeAudio(ambientBuffers);
  const ambientGain = audioCtx.createGain();
  const ambientFilter = audioCtx.createBiquadFilter();

  ambientGain.gain.value = utils.randomNumber(4) - 2;

  //When downsampled:
  //Left: 0, 2
  //Right: 1, 3
  const merger = audioCtx.createChannelMerger(4);

  sourcePanner.panningModel = "HRTF";

  sourcePanner.positionX.setValueAtTime(vectorFrom.x, 0);
  sourcePanner.positionY.setValueAtTime(vectorFrom.y, 0);
  sourcePanner.positionZ.setValueAtTime(vectorFrom.z, 0);

  if (Math.random() <= 0.5) {
    sourcePanner.positionX.linearRampToValueAtTime(vectorTo.x, endTime);
    sourcePanner.positionY.linearRampToValueAtTime(vectorTo.y, endTime);
    sourcePanner.positionZ.linearRampToValueAtTime(vectorTo.z, endTime);
  } else {
    sourcePanner.positionX.exponentialRampToValueAtTime(vectorTo.x, endTime);
    sourcePanner.positionY.exponentialRampToValueAtTime(vectorTo.y, endTime);
    sourcePanner.positionZ.exponentialRampToValueAtTime(vectorTo.z, endTime);
  }

  //TODO: every time we output FFT make sure we sample and store the current vector from sourcePanner!

  utils.randomizeFilter(sourceFilter);
  utils.randomizeFilter(ambientFilter);

  source.connect(sourcePanner);
  sourcePanner.connect(sourceFilter);
  sourceFilter.connect(merger);

  ambientSource.connect(ambientGain);
  ambientGain.connect(ambientFilter);
  ambientGain.connect(merger);
}

function setArrow(vector) {
  let audioVector = document.querySelector("#audioVector");
  audioVector.style.transform = `rotateX(${vector.angle.x}deg) rotateZ(${
    vector.angle.y
  }deg)`;
  audioVector.style.height = `${vector.magnitude * 10}px`;
}

function randomAudio(folderName) {
  let soundFolder = sounds[folderName] || {};
  let fileName = soundFolder[utils.randomNumber(soundFolder.length - 1)];
  return fileName ? path.join(SoundsPath, folderName + "/" + fileName) : null;
}

function getAmbientNoises() {
  let maxAmbient = 4;
  let ambientNoises = [];
  while (ambientNoises.length < maxAmbient) {
    let ambientNoise = randomAudio(
      AmbientFolders[utils.randomNumber(AmbientFolders.length - 1)]
    );
    if (ambientNoise && ambientNoises.indexOf(ambientNoise) == -1) {
      ambientNoises.push(ambientNoise);
    }
  }
  return ambientNoises;
}

function randomVector() {
  return new Vector(
    utils.randomNumber(20) - 10,
    utils.randomNumber(20) - 10,
    utils.randomNumber(20) - 10
  );
}
