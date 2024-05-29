export function parseSortParams(sort) {
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
// eslint-disable-next-line max-len
const REGEXP = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/;

export function parseFilters(filters = {}) {
  if (Object.prototype.toString.call(filters) !== '[object Object]') return filters;
  const newObj = {};
  Object.keys(filters).forEach((k) => {
    const v = filters[k];
    if ((typeof v === 'string') && Object.prototype.toString.call(v) === '[object String]') {
      if (REGEXP.test(v)) {
        newObj[k] = new Date(v);
      } else {
        newObj[k] = v;
      }
    } else if (Object.prototype.toString.call(v) === '[object Object]') {
      newObj[k] = parseFilters(v);
    } else if (Object.prototype.toString.call(v) === '[object Array]') {
      newObj[k] = v.map((el) => parseFilters(el));
    } else {
      newObj[k] = v;
    }
  });
  return newObj;
}

export function mongoFilters(filters = {}) {
  if (filters !== Object(filters)) return filters;

  const newObj = Object.entries(filters).reduce((acc, [key, value]) => {
    if (Array.isArray(value) && value.every((v) => typeof v !== 'object')) {
      acc[key] = { $in: value };
    } else {
      acc[key] = value;
    }
    return acc;
  }, {});

  return newObj;
}
