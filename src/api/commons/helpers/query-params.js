import { BadRequestError } from '../http-errors';

// only checks the format. new Date(value then gives Nan if date is wrong.
const ISO_DATETIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/;

const ALLOWED_OPERATORS = ['$eq', '$ne', '$gt', '$gte', '$lt', '$lte', '$in', '$nin', '$exists'];
const PRIVATE_FIELDS = ['otpSecret', 'password'];

const isPlainObject = (value) => Object.prototype.toString.call(value) === '[object Object]';

const toDate = (value) => {
  if (!ISO_DATETIME.test(value)) return value;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date;
};

const toExists = (value) => (typeof value === 'string' ? value !== 'false' : Boolean(value));

const parseValue = (value) => {
  if (typeof value === 'string') return toDate(value);
  if (Array.isArray(value)) return value.map(parseValue);
  if (!isPlainObject(value)) return value;
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, key === '$exists' ? toExists(item) : parseValue(item)]));
};

const toSortEntry = (field) => (field.startsWith('-') ? [field.slice(1), -1] : [field, 1]);

export const parseFilters = (filters = {}) => parseValue(filters);
export const parseSortParams = (sort) => (sort ? Object.fromEntries(sort.split(',').map(toSortEntry)) : { _id: -1 });

const isValue = (value) => typeof value === 'string' || (Array.isArray(value) && value.every((item) => typeof item === 'string'));
const isAllowedField = (field) => !field.includes('$') && !PRIVATE_FIELDS.includes(field.split('.')[0]);
const isAllowedCondition = (condition) => isValue(condition)
  || Object.entries(condition).every(([operator, value]) => ALLOWED_OPERATORS.includes(operator) && isValue(value));

export function validateFilters(filters = {}) {
  const isValid = isPlainObject(filters)
    && Object.entries(filters).every(([field, condition]) => isAllowedField(field) && isAllowedCondition(condition));
  if (!isValid) throw new BadRequestError('Invalid filters');
}

export function validateSort(sort = '') {
  const isValid = typeof sort === 'string' && sort.split(',').every((field) => isAllowedField(field.replace(/^-/, '')));
  if (!isValid) throw new BadRequestError('Invalid sort');
}
