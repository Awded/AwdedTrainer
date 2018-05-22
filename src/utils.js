const utils = {};

const path = require("path");
const SoundsPath = path.join(__dirname, "../Sounds");
const audioCtx = new AudioContext();
const fs = require("fs");

utils.createOfflineAudioContext = (channels, seconds, sampleRate) => {
  return new OfflineAudioContext(channels, sampleRate * seconds, sampleRate);
};

utils.randomizeFilter = filter => {
  const frequencyMultiplier = 7000;
  const qualityMultiplier = 30;
  const randomFreq = Math.random() * 0.3333 + 0.3333;
  const randomQual = Math.random() * 0.3333;

  var minValue = 40;
  var maxValue = 44100 / 2;
  // Logarithm (base 2) to compute how many octaves fall in the range.
  var numberOfOctaves = Math.log(maxValue / minValue) / Math.LN2;
  // Compute a multiplier from 0 to 1 based on an exponential scale.
  var multiplier = Math.pow(2, numberOfOctaves * (randomFreq - 1.0));
  // Get back to the frequency value between min and max.

  filter.frequency.value = maxValue * multiplier;
  filter.Q.value = randomQual * qualityMultiplier;
};

utils.readFilePromise = async file => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, function(err, data) {
      if (err !== null) {
        reject(err);
      }
      //console.log(data);
      resolve(data);
    });
  });
};

utils.arrayBufferFromBuffer = buffer => {
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  );
};

utils.buffersFromFile = async files => {
  let buffers = [];
  await Promise.all(
    files.map(async file => {
      let fileBuffer = await utils.readFilePromise(file);
      console.log(fileBuffer);
      buffers.push(
        await audioCtx.decodeAudioData(utils.arrayBufferFromBuffer(fileBuffer))
      );
    })
  );
  return buffers;
};

utils.mergeAudio = buffers => {
  console.log(utils.maxDuration(buffers));
  //TODO: do 10 seconds
  let output = audioCtx.createBuffer(
    1,
    44100 * utils.maxDuration(buffers),
    44100
  );

  buffers.map(buffer => {
    for (let i = output.getChannelData(0).length - 1; i >= 0; i--) {
      output.getChannelData(0)[i] += buffer.getChannelData(0)[
        i % (buffer.getChannelData(0).length - 1)
      ];
    }
  });

  return output;
};

utils.maxDuration = buffers => {
  return Math.max.apply(Math, buffers.map(buffer => buffer.duration));
};

utils.loadAudio = () => {
  let audioFolders = {};
  fs
    .readdirSync(SoundsPath)
    .filter(fileName => {
      return fileName.indexOf(".") == -1;
    })
    .forEach(folderName => {
      let files = fs
        .readdirSync(path.join(SoundsPath, folderName))
        .filter(folderName => {
          return folderName.indexOf(".") != -1;
        });
      files.forEach(fileName => {
        audioFolders[folderName] = audioFolders[folderName] || [];
        audioFolders[folderName].push(fileName);
      });
    });

  return audioFolders;
};

utils.randomNumber = max => {
  return Math.floor(Math.random() * (max + 1));
};

module.exports = utils;
