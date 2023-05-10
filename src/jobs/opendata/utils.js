export function formatDateToString(date) { return date.toJSON().replace('T', ' ').split('.')?.[0]; }
