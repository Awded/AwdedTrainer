const utils = require("./utils.js");

class SourceStereoAudio {
  constructor(audioFile, vectorTo, vectorFrom) {
    return init();
  }
  async init() {
    const audioCtx = utils.createOfflineAudioContext(2, 5, 44100);
    const sourceBuffer = await utils.buffersFromFiles([filePath]);
    const source = audioCtx.createBufferSource();
    const sourcePanner = audioCtx.createPanner();
    const sourceFilter = audioCtx.createBiquadFilter();
    const sourceSplitter = audioCtx.createChannelSplitter(2);
  }
}
