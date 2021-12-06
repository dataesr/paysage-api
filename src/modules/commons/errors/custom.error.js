class CustomError extends Error {
  constructor(message, errors = []) {
    super(message);
    this.statusCode = 500;
    this.errors = errors;
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  extract() {
    return {
      statusCode: this.statusCode,
      error: this.message,
      details: this.errors,
    };
  }
}

export default CustomError;
