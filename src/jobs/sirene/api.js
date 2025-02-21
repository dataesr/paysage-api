import config from "../../config";

const { apiUrl, apiKey } = config.sirene;
const RATE_LIMIT_DELAY = 2100;

const API_KEY_HEADER = { "X-INSEE-Api-Key-Integration": apiKey }
const SIZE_LIMIT = 1000;

const API_CONFIG = {
  siren: 'unitesLegales',
  siret: 'etablissements',
};

/**
 * Promisified delay
  * @param {number} ms - Delay in milliseconds
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));


/**
 * Fetches a single page from the Sirene API
 * @param {string} endpoint - 'siren' or 'siret'
 * @param {object} params - API query parameters
 * @param {string} cursor - Pagination cursor
 * @returns {Promise} Page data, next cursor and total count
 */
const fetchPage = async (endpoint, params, cursor) => {
  const urlParams = new URLSearchParams({
    ...params,
    curseur: cursor,
    nombre: SIZE_LIMIT
  });

  const url = `${apiUrl}/${endpoint}?${urlParams}`;
  const response = await fetch(url, { headers: API_KEY_HEADER });
  await sleep(RATE_LIMIT_DELAY);

  if (response.status === 404) return { data: [], nextCursor: null, total: 0 };

  if (response.status === 200) {
    const json = await response.json();
    const data = json?.[API_CONFIG[endpoint]] ?? [];
    return {
      data,
      nextCursor: json.header.curseurSuivant,
      total: json.header.total
    };
  }

  console.log(JSON.stringify(response, null, 2));
  const json = await response.json().catch(() => response.text());
  console.log('Response body:', json);

  throw new Error(`Invalid API response status ${response.status}`);

};


/**
 * Generator that yields pages from the Sirene API
 * @param {string} endpoint - 'siren' or 'siret'
 * @param {object} params - API query parameters
 * @param {string} cursor - Initial cursor
 * @param {number} total - Total results count
 * @yields {object} Page data and progress information
 */
async function* sirenePageGenerator(endpoint, params, cursor = '*', total = null) {
  const { data, nextCursor, total: pageTotal } = await fetchPage(endpoint, params, cursor);

  yield {
    data,
    progress: {
      total: total ?? pageTotal ?? 0,
      cursor,
    }
  };
  if (nextCursor && nextCursor !== cursor && pageTotal >= SIZE_LIMIT) {
    yield* sirenePageGenerator(endpoint, params, nextCursor, total ?? pageTotal);
  }
}


/**
 * Main API function that handles pagination and data collection
 * @param {string} endpoint - 'siren' or 'siret'
 * @param {object} params - API query parameters
 * @returns {Promise} Collection of all results
 */
const fetchSireneApi = async (endpoint, params) => {
  if (!API_CONFIG[endpoint]) {
    throw new Error('Invalid endpoint. Must be "siret" or "siren"');
  }
  const results = [];
  let processedCount = 0;

  for await (const { data, progress } of sirenePageGenerator(endpoint, params)) {
    results.push(...data);
    processedCount += data.length;
    console.log(
      `Processed ${processedCount?.toLocaleString()}/${progress.total?.toLocaleString()} records`
    );
  }

  return {
    totalCount: processedCount,
    data: results,
  };
};


/**
 * Fetches all SIRET updates between two dates
 * @param {string} startDate - Start date in ISO format
 * @param {string} endDate - End date in ISO format
 * @returns {Promise} SIRET updates
 */
export const fetchEstablishmentUpdates = async (startDate, endDate) => {
  const params = {
    q: `dateDernierTraitementEtablissement:[${startDate} TO ${endDate}] AND nombrePeriodesEtablissement:[2 TO *]`,
    champs: "siret,dateDernierTraitementEtablissement",
  };

  const data = await fetchSireneApi('siret', params)
  return new Map(
    data?.data?.map(update => [update.siret, update.dateDernierTraitementEtablissement])
  )
};


/**
 * Fetches all SIREN updates between two dates
 * @param {string} startDate - Start date in ISO format
 * @param {string} endDate - End date in ISO format
 * @returns {Promise} SIREN updates
 */
export const fetchLegalUnitUpdates = async (startDate, endDate) => {
  const params = {
    q: `dateDernierTraitementUniteLegale:[${startDate} TO ${endDate}] AND nombrePeriodesUniteLegale:[2 TO *]`,
    champs: "siren,dateDernierTraitementUniteLegale",
  };

  const data = await fetchSireneApi('siren', params);
  return new Map(
    data?.data?.map(update => [update.siren, update.dateDernierTraitementUniteLegale])
  )
};


/**
 * Fetches data for a specific SIRET
 * @param {string} siretId - SIRET identifier
 * @returns {Promise} Establishment data or null if not found
 */
export const fetchEstablishmentById = async (siretId) => {
  try {
    const response = await fetchSireneApi('siret', { q: `siret:${siretId}` });
    return response.data?.[0] || null;
  } catch (error) {
    console.error(`Failed to fetch SIRET ${siretId}: ${error.message}`);
    return null;
  }
};


/**
 * Fetches data for a specific SIREN
 * @param {string} sirenId - SIREN identifier
 * @returns {Promise} Legal Unit data or null if not found
 */
export const fetchLegalUnitById = async (sirenId) => {
  try {
    const response = await fetchSireneApi('siren', { q: `siren:${sirenId}` });
    return response.data?.[0] || null;
  } catch (error) {
    console.error(`Failed to fetch SIREN ${sirenId}: ${error.message}`);
    return null;
  }
};
