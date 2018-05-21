const utils = {};

const audioCtx = new OfflineAudioContext();

utils.randomizeFilters = (input, output, filter, shaper) => {
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
};

utils.mergeAudio = buffers => {
  let output = audioCtx.createBuffer(1, 44100 * maxDuration(buffers), 44100);

  buffers.map(buffer => {
    for (let i = buffer.getChannelData(0).length - 1; i >= 0; i--) {
      output.getChannelData(0)[i] += buffer.getChannelData(0)[i];
    }
  });

  return output;
};

utils.maxDuration = buffers => {
  return Math.max.apply(Math, buffers.map(buffer => buffer.duration));
};

utils.setArrow = vector => {
  let audioVector = document.querySelector("#audioVector");
  audioVector.style.transform = `rotateX(${vector.angle.x}deg) rotateZ(${
    vector.angle.y
  }deg)`;
  audioVector.style.height = `${vector.magnitude * 10}px`;
};

utils.loadAudio = () => {
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
};

utils.randomNumber = max => {
  return Math.floor(Math.random() * (max + 1));
};

module.exports = utils;
