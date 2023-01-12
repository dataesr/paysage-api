/* eslint-disable no-await-in-loop */
// NODE_ENV=development node --experimental-specifier-resolution=node bulk-import-structures.js ~/Downloads/AjoutEnMasseStructureTest.csv
import axios from 'axios';
import { parse } from 'csv-parse/sync';
import 'dotenv/config';
import fs from 'fs';

import config from './src/config';

const CSV_DELIMITER = ';';
const INPUT_FILE_PATH = process.argv[2];
// eslint-disable-next-line max-len
const bearer = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoiYW5uZS5saG90ZUBlbnNlaWduZW1lbnRzdXAuZ291di5mciIsImlkIjoieVlRUWc1cHZsTEVtQ01oIiwicm9sZSI6ImFkbWluIn0sImlhdCI6MTY3MzUzNTU0NSwiZXhwIjoxNjc0Mzk5NTQ1fQ.4yX6iq7-s3kYvCkTlJr3B_DJ_9HyUkt1e4gz4M73LK0';

const statusMapping = {
  O: 'active',
  F: 'inactive',
  P: 'forthcoming',
};

const chunkArray = (array, chunkSize) => array.reduce((resultArray, item, index) => {
  const chunkIndex = Math.floor(index / chunkSize);
  if (!resultArray[chunkIndex]) {
    // eslint-disable-next-line no-param-reassign
    resultArray[chunkIndex] = [];
  }
  resultArray[chunkIndex].push(item);
  return resultArray;
}, []);

// eslint-disable-next-line no-promise-executor-return
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getIso3 = (item) => {
  const iso3 = item?.['Nom du pays en français {rechercher le libellé ou le code ISO}']?.toUpperCase();
  return iso3.length ? iso3 : null;
};

// 1. Extract data from file
const parseOptions = {
  delimiter: CSV_DELIMITER,
  trim: true,
  columns: true,
};
const file = fs.readFileSync(INPUT_FILE_PATH, 'utf8');
const data = parse(file, parseOptions);
let api;
try {
  api = axios.create({
    baseURL: config.hostname,
    headers: { Authorization: bearer },
  });
} catch (error) {
  console.error('Error while creating axios connection', error);
}

const structures = [];
for (let i = 0; i < data.length; i += 1) {
  const item = data[i];
  const structure = {
    acronymEn: item['Nom court  en anglais :'],
    acronymFr: item['Sigle en français'],
    acronymLocal: item['Nom court officiel dans la langue originale'],
    closureDate: item['Date de fermeture {2020-07-02}'],
    creationDate: item['Date de création {2020-07-02}'],
    nameEn: item['Nom long en anglais :'],
    officialName: item['Nom officiel dans la langue originale'],
    otherNames: item['Autres dénominations possibles séparées par des ;'].split(';'),
    shortName: item['Nom court en français'],
    structureStatus: statusMapping[item['Statut [O = Ouvert, F = Fermé, P = Potentiel]']],
    usualName: item['Nom usuel en français'],
  };
  structures.push(api.post(`${config.hostname}/structures`, structure));
}

let structureIds = [];
try {
  const chunkedData = chunkArray(structures, 100);
  for (let i = 0; i < chunkedData.length; i += 1) {
    await sleep(1000);
    const chunkedIds = await axios.all(chunkedData[i]).catch((err) => console.error('ERROR STRUCTURES', err?.response?.data));
    structureIds = structureIds.concat(chunkedIds.map((item) => item.data.id));
  }
  console.log(`${structureIds.length} structure(s) added.`);
} catch (err) {
  console.log('Try catch error', err?.response?.data);
}

await sleep(10000);

const identifiers = [];
const localisations = [];
const relations = [];
const socialmedias = [];
const weblinks = [];
for (let i = 0; i < data.length; i += 1) {
  const item = data[i];
  const structureId = structureIds[i];
  // IDENTIFIERS
  if (item['Identifiant IdRef [123456789]'] && item['Identifiant IdRef [123456789]'].length > 0) {
    const identifier = {
      active: true,
      type: 'idRef',
      value: item['Identifiant IdRef [123456789]'],
    };
    identifiers.push(api.post(`${config.hostname}/structures/${structureId}/identifiers`, identifier));
  }
  if (item['Identifiant Wikidata [Q1234]'] && item['Identifiant Wikidata [Q1234]'].length > 0) {
    const identifier = {
      active: true,
      type: 'Wikidata',
      value: item['Identifiant Wikidata [Q1234]'],
    };
    identifiers.push(api.post(`${config.hostname}/structures/${structureId}/identifiers`, identifier));
  }
  if (item['Identifiant ROR [12cd5fg89]'] && item['Identifiant ROR [12cd5fg89]'].length > 0) {
    const identifier = {
      active: true,
      type: 'ROR',
      value: item['Identifiant ROR [12cd5fg89]'],
    };
    identifiers.push(api.post(`${config.hostname}/structures/${structureId}/identifiers`, identifier));
  }
  if (item['Code UAI [1234567X]'] && item['Code UAI [1234567X]'].length > 0) {
    const identifier = {
      active: true,
      type: 'UAI',
      value: item['Code UAI [1234567X]'],
    };
    identifiers.push(api.post(`${config.hostname}/structures/${structureId}/identifiers`, identifier));
  }
  if (item['Numéro siret [12345678901234]'] && item['Numéro siret [12345678901234]'].length > 0) {
    const identifier = {
      active: true,
      type: 'Siret',
      value: item['Numéro siret [12345678901234]'],
    };
    identifiers.push(api.post(`${config.hostname}/structures/${structureId}/identifiers`, identifier));
  }
  if (item['Numéro RNSR [123456789X]'] && item['Numéro RNSR [123456789X]'].length > 0) {
    const identifier = {
      active: true,
      type: 'RNSR',
      value: item['Numéro RNSR [123456789X]'],
    };
    identifiers.push(api.post(`${config.hostname}/structures/${structureId}/identifiers`, identifier));
  }
  if (item["Numéro de l'ED [123]"] && item["Numéro de l'ED [123]"].length > 0) {
    const identifier = {
      active: true,
      type: "Numéro d'ED",
      value: item["Numéro de l'ED [123]"],
    };
    identifiers.push(api.post(`${config.hostname}/structures/${structureId}/identifiers`, identifier));
  }
  if (item['Identifiant bibliothèque ESGBU'] && item['Identifiant bibliothèque ESGBU'].length > 0) {
    const identifier = {
      active: true,
      type: 'ESGBU',
      value: item['Identifiant bibliothèque ESGBU'],
    };
    identifiers.push(api.post(`${config.hostname}/structures/${structureId}/identifiers`, identifier));
  }
  // LOCALISATIONS
  const country = (
    item["Localisation [A1 = France métropolitaine et les DOM, A2 = Collectivités d'outre-mer, A3 = Hors de France]"] !== 'A3'
  ) ? 'France' : item['Nom du pays en français {rechercher le libellé ou le code ISO}'];
  const localisation = {
    active: true,
    address: item['Adresse :'],
    cityId: item['Code commune {rechercher le code}'],
    country,
    distributionStatement: item['Mention de distribution :'],
    iso3: getIso3(item),
    locality: item["Localité d'acheminement :"],
    place: item['Lieu dit :'],
    postalCode: item['Code postal :'],
    postOfficeBoxNumber: item['Boite postale :'],
  };
  if (item['Coordonnées GPS [-12.34,5.6789]'] && item['Coordonnées GPS [-12.34,5.6789]']?.split(',').length === 2) {
    localisation.coordinates = {
      lat: parseFloat(item['Coordonnées GPS [-12.34,5.6789]']?.split(',')[0]),
      lng: parseFloat(item['Coordonnées GPS [-12.34,5.6789]']?.split(',')[1]),
    };
  } else {
    console.error(`Error for latlng for structure ${item['Nom usuel en français']}`);
  }
  localisations.push(api.post(`${config.hostname}/structures/${structureId}/localisations`, localisation));
  // RELATIONS
  const relationIds = item['Code de la/des catégories {rechercher le code, séparation ;}'].split(';');
  for (let j = 0; j < relationIds.lenth; j += 1) {
    const relation = {
      resourceId: structureId,
      relatedObjectId: relationIds[j],
      relationTag: 'structure-categorie',
    };
    relations.push(api.post(`${config.hostname}/relations`, relation));
  }
  if (item['Code du statut juridique {rechercher le code}'] && item['Code du statut juridique {rechercher le code}'].length > 0) {
    const relationSCJ = {
      resourceId: structureId,
      relatedObjectId: item['Code du statut juridique {rechercher le code}'],
      relationTag: 'structure-categorie-juridique',
    };
    relations.push(api.post(`${config.hostname}/relations`, relationSCJ));
  }
  if (item['Parent {rechercher le code}'] && item['Parent {rechercher le code}'].length > 0) {
    const relationSI = {
      resourceId: item['Parent {rechercher le code}'],
      relatedObjectId: structureId,
      relationTag: 'structure-interne',
    };
    relations.push(api.post(`${config.hostname}/relations`, relationSI));
  }
  // SOCIAL MEDIAS
  if (item['Compte twitter [https://twitter.com/XXX]'] && item['Compte twitter [https://twitter.com/XXX]'].length > 0) {
    const socialmedia = {
      account: item['Compte twitter [https://twitter.com/XXX]'],
      type: 'Twitter',
    };
    socialmedias.push(api.post(`${config.hostname}/structures/${structureId}/social-medias`, socialmedia));
  }
  if (item['Compte linkedIn [https://www.linkedin.com/in/XXX-XXX-123456/]'] && item['Compte linkedIn [https://www.linkedin.com/in/XXX-XXX-123456/]'].length > 0) {
    const socialmedia = {
      account: item['Compte linkedIn [https://www.linkedin.com/in/XXX-XXX-123456/]'],
      type: 'Linkedin',
    };
    socialmedias.push(api.post(`${config.hostname}/structures/${structureId}/social-medias`, socialmedia));
  }
  // WEBLINKS
  if (item['Site internet en français'] && item['Site internet en français'].length > 0) {
    const weblink = {
      type: 'website',
      url: item['Site internet en français'],
    };
    weblinks.push(api.post(`${config.hostname}/structures/${structureId}/weblinks`, weblink));
  }
  if (item['Site internet en anglais'] && item['Site internet en anglais'].length > 0) {
    const weblink = {
      type: 'website',
      url: item['Site internet en anglais'],
    };
    weblinks.push(api.post(`${config.hostname}/structures/${structureId}/weblinks`, weblink));
  }
}

try {
  let chunkedData = chunkArray(identifiers, 20);
  for (let i = 0; i < chunkedData.length; i += 1) {
    await sleep(2000);
    await axios.all(chunkedData[i]).catch((err) => console.error('ERROR IDENTIFIER', err?.response?.data));
  }
  console.log(`${identifiers.length} identifier(s) added.`);
  chunkedData = chunkArray(localisations, 20);
  for (let i = 0; i < chunkedData.length; i += 1) {
    await sleep(2000);
    await axios.all(chunkedData[i]).catch((err) => console.error('ERROR LOCALISATION', err?.response?.data));
  }
  console.log(`${localisations.length} localisation(s) added.`);
  chunkedData = chunkArray(relations, 20);
  for (let i = 0; i < chunkedData.length; i += 1) {
    await sleep(2000);
    await axios.all(chunkedData[i]).catch((err) => console.error('ERROR RELATIONS', err?.response?.data));
  }
  console.log(`${relations.length} relation(s) added.`);
  chunkedData = chunkArray(socialmedias, 20);
  for (let i = 0; i < chunkedData.length; i += 1) {
    await sleep(2000);
    await axios.all(chunkedData[i]).catch((err) => console.error('ERROR SOCIAL MEDIAS', err?.response?.data));
  }
  console.log(`${socialmedias.length} social media(s) added.`);
  chunkedData = chunkArray(weblinks, 20);
  for (let i = 0; i < chunkedData.length; i += 1) {
    await sleep(2000);
    await axios.all(chunkedData[i]).catch((err) => console.error('ERROR WEBLINKS', err?.response?.data));
  }
  console.log(`${weblinks.length} weblink(s) added.`);
} catch (err) {
  console.log('Try catch error', err?.response?.data);
}
