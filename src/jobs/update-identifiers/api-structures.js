/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const RATE_LIMIT_DELAY = 1000;
const WIKIDATA_BATCH_SIZE = 50;
const sleep = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });

const WIKIDATA_ENDPOINT = 'https://query.wikidata.org/sparql';

const WIKIDATA_PROP_TO_TYPE = {
  P269: 'idref',
  P6782: 'ror',
  P496: 'orcid',
  P213: 'isni',
  P268: 'bnf',
  P10832: 'openalex',
  P2038: 'researchgate',
  P2427: 'grid',
};

const WIKIDATA_HEADERS = {
  Accept: 'application/sparql-results+json',
  'User-Agent': 'debache.mihoub@gmail.com',
};

// eslint-disable-next-line consistent-return
const fetchWithRetry = async (url, options = {}, retries = 3) => {
  // eslint-disable-next-line no-plusplus
  for (let attempt = 1; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);
    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeout);
      return res;
    } catch (err) {
      clearTimeout(timeout);
      if (attempt === retries) throw err;
      console.warn(`Attempt ${attempt}/${retries} failed for ${url}: ${err.message}`);
      await sleep(1000 * attempt); // 1s, 2s, 3s
    }
  }
};

// ─── Wikidata ───/

const fetchWikidataBatch = async (wikidataIds) => {
  const pidList = Object.keys(WIKIDATA_PROP_TO_TYPE)
    .map((p) => `wdt:${p}`)
    .join(' ');

  const itemList = wikidataIds.map((id) => `wd:${id}`).join(' ');

  const query = `
    SELECT ?item ?prop ?value WHERE {
      ?item ?prop ?value .
      VALUES ?item { ${itemList} }
      VALUES ?prop { ${pidList} }
    }
  `;

  const url = `${WIKIDATA_ENDPOINT}?query=${encodeURIComponent(query)}&format=json`;
  const response = await fetch(url, { headers: WIKIDATA_HEADERS });
  await sleep(RATE_LIMIT_DELAY);

  if (!response.ok) {
    console.error(`Wikidata batch error (${wikidataIds.length} ids): ${response.status}`);
    return new Map();
  }

  const json = await response.json();

  const propUrlToType = Object.fromEntries(
    Object.entries(WIKIDATA_PROP_TO_TYPE).map(([pid, type]) => [
      `http://www.wikidata.org/prop/direct/${pid}`,
      type,
    ]),
  );

  const resultMap = new Map();
  for (const binding of json.results?.bindings ?? []) {
    // l'item est retourné sous forme d'URL : "http://www.wikidata.org/entity/Q273600"
    const wikidataId = binding.item?.value?.split('/').pop();
    const type = propUrlToType[binding.prop?.value];
    const value = binding.value?.value;

    // eslint-disable-next-line no-continue
    if (!wikidataId || !type || !value) continue;

    if (!resultMap.has(wikidataId)) resultMap.set(wikidataId, []);
    resultMap.get(wikidataId).push({ type, value });
  }

  return resultMap;
};

const chunk = (arr, size) => Array.from(
  { length: Math.ceil(arr.length / size) },
  (_, i) => arr.slice(i * size, i * size + size),
);

export const fetchAllIdsFromWikidataForStock = async (allWikidataIds) => {
  const batches = chunk(allWikidataIds, WIKIDATA_BATCH_SIZE);
  const globalMap = new Map();

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < batches.length; i++) {
    console.log(`Wikidata batch ${i + 1}/${batches.length}`);
    // eslint-disable-next-line no-await-in-loop
    const batchMap = await fetchWikidataBatch(batches[i]);
    for (const [id, results] of batchMap) {
      globalMap.set(id, results);
    }
  }

  return globalMap;
};

// IDREF --

const IDREF_BASE_URL = 'https://www.idref.fr';

const IDREF_URL_PATTERNS = [
  { pattern: /https?:\/\/www\.wikidata\.org\/entity\/(Q\d+)/g, type: 'wikidata' },
  { pattern: /https?:\/\/ror\.org\/([0-9a-hjkmnp-z]{9})/g, type: 'ror' },
  { pattern: /https?:\/\/isni\.org\/isni\/([0-9X ]+)/g, type: 'isni' },
  { pattern: /https?:\/\/data\.bnf\.fr\/ark:\/12148\/(cb\d+[a-z]?)/g, type: 'bnf' },
  { pattern: /https?:\/\/openalex\.org\/([AIRCWFS]\d+)/g, type: 'openalex' },
  { pattern: /https?:\/\/grid\.ac\/institutes\/([a-z0-9.]+)/gi, type: 'grid' },
  { pattern: /https?:\/\/(?:www\.)?hal\.science\/([A-Za-z0-9_-]+)/g, type: 'hal' },
  { pattern: /https?:\/\/doi\.org\/10\.13039\/(\d+)/g, type: 'fundref' },
];

export const fetchAllIdsFromIdRef = async (idrefId) => {
  const url = `${IDREF_BASE_URL}/${idrefId}.rdf`;
  let response;
  try {
    response = await fetchWithRetry(url, { headers: { Accept: 'application/rdf+xml' } });
  } catch (err) {
    console.error(`IdRef network error for ${idrefId}: ${err.message}`);
    return [];
  }
  await sleep(RATE_LIMIT_DELAY);

  if (!response.ok) {
    console.error(`IdRef error for ${idrefId}: ${response.status}`);
    return [];
  }

  const text = await response.text();
  const results = [];
  const seen = new Set();

  for (const { pattern, type } of IDREF_URL_PATTERNS) {
    for (const match of text.matchAll(new RegExp(pattern, 'g'))) {
      const value = match[1];
      const key = `${type}:${value}`;
      if (!seen.has(key)) {
        seen.add(key);
        results.push({ type, value });
      }
    }
  }

  return results;
};

// ROR ---

const ROR_API_URL = 'https://api.ror.org/v2/organizations';

const ROR_TYPE_MAP = {
  Wikidata: 'wikidata',
  ISNI: 'isni',
  FundRef: 'fundref',
  GRID: 'grid',
  OrgRef: 'orgref',
  Crossref: 'crossref',
  Ringgold: 'ringgold',
  Scopus: 'scopus',
  ResearchGate: 'researchgate',
  BNF: 'bnf',
  OpenAlex: 'openalex',
};

export const fetchAllIdsFromRor = async (rorId) => {
  const normalizedId = rorId.startsWith('https://ror.org/') ? rorId : `https://ror.org/${rorId}`;
  const url = `${ROR_API_URL}/${encodeURIComponent(normalizedId)}`;
  let response;
  try {
    response = await fetchWithRetry(url);
  } catch (err) {
    console.error(`ROR network error for ${rorId}: ${err.message}`);
    return [];
  }
  await sleep(RATE_LIMIT_DELAY);

  if (!response.ok) {
    console.error(`ROR error for ${rorId}: ${response.status}`);
    return [];
  }

  const json = await response.json();
  const results = [];
  const seen = new Set();

  for (const extId of json.external_ids ?? []) {
    const type = ROR_TYPE_MAP[extId.type];
    // eslint-disable-next-line no-continue
    if (!type) continue;

    const values = [extId.preferred, ...(extId.all ?? [])].filter(Boolean);
    for (const value of values) {
      const key = `${type}:${value}`;
      if (!seen.has(key)) {
        seen.add(key);
        results.push({ type, value });
      }
    }
  }

  return results;
};
