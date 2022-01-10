class Redirected extends Error {
  constructor(message, location, statusCode = 308) {
    super(message);
    this.statusCode = statusCode;
    this.location = location;
    Object.setPrototypeOf(this, Redirected.prototype);
  }
}

export default Redirected;
