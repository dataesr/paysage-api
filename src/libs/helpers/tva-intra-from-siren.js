/**
 * Convert a siren number to the cooresponding tva number
 * @param {number} siren - A 9-digit siren identifier.
 * @return {string} The cooresponding TVA number.
 * @throws {TypeError} A type error if siren is not a ç-digit number.
 */
export function getTvaIntraFromSiren(siren) {
  if (Number.isInteger(siren) && siren.toString().length === 9) {
    return `FR${(12 + 3 * (siren % 97)) % 97}${siren}`;
  }
  throw new TypeError('Parameter siren must be a 9-digit number');
}

/**
 * Verify that a siren number is valid
 * @param {number} siren - A 9-digit siren identifier.
 * @return {boolean} true if the siren identifier is valid.
 * @throws {TypeError} A type error if siren is not a 9-digit number.
 */
export function isSirenValid(siren) {
  const strParam = siren.toString();
  if (!strParam.match(/^[0-9]{9}$/)) {
    throw new Error('Parameter siret must be 9-digits');
  }
  const nums = [];
  for (let i = 0; i < strParam.length; i += 1) {
    const num = strParam.charAt(i);
    if (i % 2 === 0) {
      nums.push(num);
    } else {
      (num * 2).toString().split('').forEach(
        (number) => nums.push(number),
      );
    }
  }
  return nums.reduce((a, b) => a + b, 0) % 10 === 0;
}

/**
 * Verify that a siret number is valid
 * @param {number/string} siret - A 14-digit siret identifier.
 * @return {boolean} true if the siren identifier is valid.
 * @throws {Error} Errors if siret is not 14-digit.
 */
export function isSiretValid(siret) {
  const strParam = siret.toString();
  if (!strParam.match(/^[0-9]{14}$/)) {
    throw new Error('Parameter siret must be 14-digits');
  }
  const nums = [];
  for (let i = 0; i < strParam.length; i += 1) {
    const num = strParam.charAt(i);
    if (i % 2 === 0) {
      (num * 2).toString().split('').forEach(
        (number) => nums.push(number),
      );
    } else {
      nums.push(num);
    }
  }
  return nums.reduce((a, b) => a + b, 0) % 10 === 0;
}
