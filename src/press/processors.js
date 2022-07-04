export const lowerFirstChar = (name) => `${name.charAt(0).toLowerCase()}${name.slice(1)}`;

export const parseCrawlDate = (value, name) => {
  if (name === 'crawlDate') {
    const date = value.match(/\d{2}\/\d{2}\/\d{4}/);
    return date?.[0].replaceAll('/', '-');
  }
  return value
}

export const parseAefDate = (value, name) => {
  if (name === 'date') {
    const date = value.match(/\d{2}\/\d{2}\/\d{4}/);
    return date?.[0].replaceAll('/', '-');
  }
  return value
}