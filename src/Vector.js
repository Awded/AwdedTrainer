module.exports = class Vector {
  constructor({ x, y, z }) {
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

  set angle({ x, y }) {
    // Convert deg to radians
    angle.x = angle.x * Math.PI / 180;
    angle.y = angle.y * Math.PI / 180;

    let sinYaw = Math.sin(angle.y);
    let cosYaw = Math.cos(angle.y);

    let sinPitch = Math.sin(angle.x);
    let cosPitch = Math.cos(angle.x);

    this.x = cosPitch * cosYaw;
    this.y = cosPitch * sinYaw;
    this.z = -sinPitch;

    return this.vector;
  }

  get angle() {
    return {
      x: Math.atan2(this.z, this.x) * 180 / Math.PI,
      y: Math.asin(this.y / this.magnitude) * 180 / Math.PI
    };
  }

  set magnitude(x) {
    let vector = this.normalize;
    vector.x *= x;
    vector.y *= x;
    vector.z *= x;
    this.vector = vector;
    return this.vector;
  }

  get magnitude() {
    return Math.sqrt(
      Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2)
    );
  }

  get normalize() {
    let magnitude = this.magnitude;
    let vector = this.vector;

    if (magnitude == 0) {
      return { x: 0, y: 0, z: 0 };
    }

    vector = {
      x: vector.x / magnitude,
      y: vector.y / magnitude,
      z: vector.z / magnitude
    };
    return vector;
  }
};
