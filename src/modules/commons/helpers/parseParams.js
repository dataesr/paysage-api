export const parseSortParams = (sort) => {
  try {
    return sort.split(',').reduce((doc, field) => {
      if (field.startsWith('-')) { return ({ ...doc, [field.split('-')[1]]: -1 }); }
      return ({ ...doc, [field]: 1 });
    }, {});
  } catch (e) {
    throw new Error('sort must be a comma separated list of string');
  }
};
export const parseReturnFieldsParams = (returnFields) => {
  if (!Array.isArray(returnFields)) { throw new Error("Parameter 'fields' must be an array of strings"); }
  returnFields.forEach((returnField) => {
    if (!(typeof returnField === 'string' && Object.prototype.toString.call(returnField) === '[object String]')) {
      throw new Error('returnFields must be an array of strings');
    }
  });
  return returnFields.reduce((doc, field) => ({ ...doc, [field]: 1 }), { _id: 0 });
};
