const electron = require("electron");
const path = require("path");
const fs = require("fs");

const audioCtx = new OfflineAudioContext();

const SoundsPath = path.join(__dirname, "/Sounds");

const Vector = require("./Vector.js");
const Buffer = require("./Buffer.js");

let sounds = {};

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

function randomizeFilters(input, output, filter, shaper) {
  switch (Math.ceil(randomNumber(2))) {
    case 0: //filter
      input.connect(filter);
      filter.connect(output);
      break;
    case 1: //shaper
      input.connect(shaper);
      shaper.connect(output);
      break;
    case 2: //filter && shaper
      input.connect(filter);
      filter.connect(shaper);
      shaper.connect(output);
      break;
  }
}

function mergeAudio(buffers) {
  let output = audioCtx.createBuffer(1, 44100 * maxDuration(buffers), 44100);

  buffers.map(buffer => {
    for (let i = buffer.getChannelData(0).length - 1; i >= 0; i--) {
      output.getChannelData(0)[i] += buffer.getChannelData(0)[i];
    }
  });

  return output;
}

function maxDuration(buffers) {
  return Math.max.apply(Math, buffers.map(buffer => buffer.duration));
}

function setArrow(vector) {
  let audioVector = document.querySelector("#audioVector");
  audioVector.style.transform = `rotateX(${vector.angle.x}deg) rotateZ(${
    vector.angle.y
  }deg)`;
  audioVector.style.height = `${vector.magnitude * 10}px`;
}

function loadAudio() {
  let audioFolders = {};
  fs
    .readdirSync(themesPath)
    .filter(fileName => {
      return fileName.indexOf(".") == -1;
    })
    .forEach(folderName => {
      let files = fs
        .readdirSync(path.join(__dirname, folderName))
        .filter(folderName => {
          return folderName.indexOf(".") != -1;
        });
      files.forEach(fileName => {
        audioFolders[folderName] = audioFolders[folderName] || [];
        audioFolders[folderName].push(fileName);
      });
    });

  return audioFolders;
}

function randomNumber(max) {
  return Math.floor(Math.random() * (max + 1));
}

let vector = new Vector(
  randomNumber(20) - 10,
  randomNumber(20) - 10,
  randomNumber(20) - 10
);
