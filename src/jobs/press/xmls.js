import { Parser } from 'xml2js';

/**
 * Fetch an url and return the text response
 * @param {string} url - An url to fetch.
 * @return {string} The string response of the url fetched.
 * @throws {Error} An error if the url cannot be fetched.
 */
export const fetchXML = async (url) => {
  const response = await fetch(url)
    .catch((e) => { throw new Error(`Cannot fetch ${url}: ${e.message}`); });
  if (!response.ok) throw new Error(`Fetching ${url} failed with status ${response.status}: ${response.statusText}`);
  const xml = await response.text();
  return xml;
};

/**
 * Convert xml to an array of Alert objects.
 * @param {string} xml - A xml string to be parsed.
 * @return {array} An array of Alert objects.
 * @throws {Error} An error if the xml cannot be parsed.
 */
export const parseXML = async (xml) => {
  const options = {
    explicitRoot: false,
    normalise: true,
    explicitArray: false,
    ignoreAttrs: true,
    trim: true,
    tagNameProcessors: [
      (name) => `${name.charAt(0).toLowerCase()}${name.slice(1)}`,
    ],
  };
  const parser = new Parser({ ...options });
  return parser.parseStringPromise(xml);
};
