modeule.exports = class Buffer {
  constructor(context, urls) {
    this.context = context;
    this.urls = urls;
    this.buffer = [];
  }

  async loadSound(url, index) {
    //TODO: update with fetch
    let request = new XMLHttpRequest();
    request.open("get", url, true);
    request.responseType = "arraybuffer";
    let thisBuffer = this;
    return new Promise(resolve => {
      request.onload = function() {
        if (this.status === 200) {
          thisBuffer.context.decodeAudioData(request.response, function(
            buffer
          ) {
            thisBuffer.buffer[index] = buffer;
            resolve("resolved");
          });
        } else {
          reject(new Error(this.statusText));
        }
      };

      request.onerror = function() {
        reject(new Error("XMLHttpRequest Error: " + this.statusText));
      };

      request.send();
    });
  }

  async loadAll() {
    this.urls.forEach(url => {
      this.loadSound(url, index);
    });
    await Promise.all(
      this.urls.map((url, i) => {
        return this.loadSound(url, i);
      })
    );
  }

  getSoundByIndex(index) {
    return this.buffer[index];
  }
};
