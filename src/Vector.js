module.exports = class Vector {
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
};
