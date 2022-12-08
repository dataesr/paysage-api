export default function parseSortParams(sort) {
  if (!sort) return { _id: -1 };
  try {
    return sort.split(',').reduce((doc, field) => {
      if (field.startsWith('-')) { return ({ ...doc, [field.split('-')[1]]: -1 }); }
      return ({ ...doc, [field]: 1 });
    }, {});
  } catch (e) {
    throw new Error('sort must be a comma separated list of string');
  }
}
