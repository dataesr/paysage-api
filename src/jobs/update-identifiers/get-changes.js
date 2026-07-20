/* eslint-disable no-restricted-syntax */
import {
  fetchAllIdsFromWikidataForStock,
  fetchAllIdsFromIdRef,
  fetchAllIdsFromRor,
} from './api-structures';

const IDREF_ROR_CONCURRENCY = 5;

const pooledMap = async (arr, fn, concurrency) => {
  const results = [];
  for (let i = 0; i < arr.length; i += concurrency) {
    const batch = arr.slice(i, i + concurrency);
    // eslint-disable-next-line no-await-in-loop
    const batchResults = await Promise.all(batch.map(fn));
    results.push(...batchResults);
  }
  return results;
};

export const getAllMissingIdentifiers = async (stock) => {
  if (!Array.isArray(stock) || stock.length === 0) {
    console.warn('getAllMissingIdentifiers: stock is empty or not an array', stock);
    return [];
  }
  const allWikidataIds = stock
    ?.flatMap((e) => e.identifiers)
    .filter((id) => id.type === 'wikidata')
    .map((id) => id.value);

  console.log(`Fetching Wikidata batch for ${allWikidataIds.length} QIDs...`);
  const wikidataMap = await fetchAllIdsFromWikidataForStock(allWikidataIds);

  const allIdrefIds = stock
    ?.flatMap((e) => e.identifiers)
    .filter((id) => id.type === 'idref')
    .map((id) => id.value);

  const allRorIds = stock
    ?.flatMap((e) => e.identifiers)
    .filter((id) => id.type === 'ror')
    .map((id) => id.value);

  console.log(`Fetching IdRef for ${allIdrefIds.length} ids...`);
  const idrefResults = await pooledMap(allIdrefIds, fetchAllIdsFromIdRef, IDREF_ROR_CONCURRENCY);
  const idrefMap = new Map(allIdrefIds.map((id, i) => [id, idrefResults[i]]));

  console.log(`Fetching ROR for ${allRorIds.length} ids...`);
  const rorResults = await pooledMap(allRorIds, fetchAllIdsFromRor, IDREF_ROR_CONCURRENCY);
  const rorMap = new Map(allRorIds.map((id, i) => [id, rorResults[i]]));

  const suggestions = [];

  for (const element of stock) {
    const { paysage, identifiers = [] } = element;
    const known = new Set(identifiers.map(({ type, value }) => `${type}:${value}`));

    const suggest = (type, value, sourceType, sourceValue) => {
      const key = `${type}:${value}`;
      if (!known.has(key)) {
        known.add(key);
        suggestions.push({ paysage, type, value, sourceType, sourceValue });
      }
    };

    for (const { type: idType, value: idValue } of identifiers) {
      let externalIds = [];

      if (idType === 'wikidata') externalIds = wikidataMap.get(idValue) ?? [];
      if (idType === 'idref') externalIds = idrefMap.get(idValue) ?? [];
      if (idType === 'ror') externalIds = rorMap.get(idValue) ?? [];

      // eslint-disable-next-line no-restricted-syntax
      for (const { type, value } of externalIds) {
        suggest(type, value, idType, idValue);
      }
    }
  }

  return suggestions;
};
