const electron = require("electron");
const path = require("path");
const fs = require("fs");
const Vector = require("./Vector.js");
const utils = require("./utils.js");

const audioCtx = new OfflineAudioContext();

const SoundsPath = path.join(__dirname, "/Sounds");

let sounds = loadAudio();

function playAudio(vectorFrom, vectorTo, fileName) {
  const source = audioCtx.createMediaElementSource(new Audio(fileName));
  const sourcePanner = audioCtx.createsourcePanner();
  const sourceFilter = audioCtx.createBiquadFilter();
  const sourceShaper = audioCtx.createWaveShaper();

  const ambient = mergeAudio(getAmbientNoises());
  const ambientGain = audioCtx.createGain();
  const ambientFilter = audioCtx.createBiquadFilter();
  const ambientShaper = audioCtx.createWaveShaper();

  ambientGain.gain.value = randomNumber(4) + 0.05;

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

  source.connect(sourcePanner);
  sourcePanner.connect(merger);

  ambientSource.connect(ambientGain);

  randomizeFilters(source, sourcePanner, sourceFilter, sourceShaper);
  randomizeFilter(ambient, ambientGain, ambientFilter, ambientShaper);

  ambientGain.connect(merger);
}

let vector = new Vector(
  randomNumber(20) - 10,
  randomNumber(20) - 10,
  randomNumber(20) - 10
);
