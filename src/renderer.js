const electron = require("electron");
const path = require("path");
const fs = require("fs");
const Vector = require("./Vector.js");
const utils = require("./utils.js");

const SoundsPath = path.join(__dirname, "../Sounds");

const endTime = 5;
const fftFPS = 60;
const ambientGainMultiplier = 0.2;
const AmbientFolders = ["Ambient", "Noise"];
const TrainFolders = ["Footsteps", "Shots", "Other"];
const audioCtx = utils.createOfflineAudioContext(2, 5, 44100);

let sounds = utils.loadAudio();

document.querySelector("#test").addEventListener("click", () => {
  playAudio(
    randomVector(),
    randomVector(),
    randomAudio(TrainFolders[utils.randomNumber(TrainFolders.length - 1)])
  );
});

async function playAudio(vectorFrom, vectorTo, filePath) {
  const sourceBuffer = await utils.buffersFromFiles([filePath]);
  const source = audioCtx.createBufferSource();
  const sourcePanner = audioCtx.createPanner();
  const sourceFilter = audioCtx.createBiquadFilter();
  const sourceSplitter = audioCtx.createChannelSplitter(2);

  const ambientPaths = getAmbientNoises();
  const ambientBuffers = await utils.buffersFromFiles(ambientPaths);
  const ambient = audioCtx.createBufferSource();
  const ambientGain = audioCtx.createGain();
  const ambientFilter = audioCtx.createBiquadFilter();
  const ambientSplitter = audioCtx.createChannelSplitter(2);

  const analyser = audioCtx.createAnalyser();
  const merger = audioCtx.createChannelMerger(4);

  source.loop = true;
  source.buffer = sourceBuffer[0];
  ambient.loop = true;
  ambient.buffer = utils.mergeAudio(ambientBuffers);

  //When downsampled:
  //Left: 0, 2
  //Right: 1, 3

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

  utils.randomizeFilter(sourceFilter);
  utils.randomizeFilter(ambientFilter);

  ambientGain.gain.value = Math.random() * ambientGainMultiplier;

  source.connect(sourcePanner);
  sourcePanner.connect(sourceFilter);
  sourceFilter.connect(sourceSplitter);
  sourceSplitter.connect(merger, 0, 0);
  sourceSplitter.connect(merger, 1, 1);

  ambient.connect(ambientGain);
  ambientGain.connect(ambientFilter);
  if (ambientFilter.channelCount < 2) {
    ambientFilter.connect(merger, 0, 2);
    ambientFilter.connect(merger, 0, 3);
  } else {
    ambientFilter.connect(ambientSplitter);
    ambientSplitter.connect(merger, 0, 2);
    ambientSplitter.connect(merger, 1, 3);
  }

  merger.connect(analyser);
  analyser.connect(audioCtx.destination);

  analyser.fftSize = 128;

  utils.suspendAudioContextEvery(audioCtx, 1 / fftFPS, time => {
    let fftData = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(fftData);
  });

  ambient.start();
  source.start();

  await audioCtx.startRendering();
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
  return new Vector({
    x: (utils.randomNumber(49) + 1) * (Math.random() > 0.5 ? -1 : 1) / 5,
    y: (utils.randomNumber(49) + 1) * (Math.random() > 0.5 ? -1 : 1) / 5,
    z: (utils.randomNumber(49) + 1) * (Math.random() > 0.5 ? -1 : 1) / 5
  });
}
