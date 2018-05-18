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

function playAudio(vector, audio, level) {}

function setArrow(vector) {
  let audioVector = document.querySelector("#audioVector");
  audioVector.style.transform = `rotateX(${vector.angle.theta}deg) rotateZ(${
    vector.angle.phi
  }deg)`;
  audioVector.style.height = `${vector.magnitude * 10}px`;
}

class Vector {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  set vector({ x, y, z }) {
    this.x = x;
    this.y = y;
    this.z = z;
    return { x, y, z };
  }

  get vector() {
    return { x: this.x, y: this.y, z: this.z };
  }

  get angle() {
    return {
      theta: Math.atan2(this.z, this.x) * 180 / Math.PI,
      phi: Math.asin(this.y / this.magnitude) * 180 / Math.PI
    };
  }

  get magnitude() {
    return Math.sqrt(
      Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2)
    );
  }
}

class Buffer {
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
