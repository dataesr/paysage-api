/* eslint-disable max-len */
/* eslint-disable no-console */

/*
1. Récupérer toutes les catégories de level "country" dans la collection geographicalcategories
2. Récupérer tous les pays dans le fichier countries.geo.json
3. Pour chaque pays du fichier countries.geo.json, s'il existe dans la collection geographicalcategories, mettre à jour sinon ajouter
*/

// Lancement : NODE_ENV=development MONGO_URI="mongodb://localhost:27017" MONGO_DBNAME="paysage" node --experimental-specifier-resolution=node scripts/import-geographical-categories-countries.js

import 'dotenv/config';
import fs from 'fs';

import geojsons from './data/countries.geo.json' assert { type: "json" };
import { client, db } from '../src/services/mongo.service';
import BaseMongoCatalog from '../src/api/commons/libs/base.mongo.catalog';

const CSV_SEPARATOR = ';';
const MONGO_TARGET_COLLECTION_NAME = 'geographicalcategories';

const createPaysageIds = (countries, x) => {
  const catalog = new BaseMongoCatalog({ db, collection: '_catalog' });
  return Promise.all(countries.slice(0, x).map(() => catalog.getUniqueId(MONGO_TARGET_COLLECTION_NAME, 5)));
}

const parseAllFloats = (coordinates) => {
  if (!Array.isArray(coordinates)) return null;
  if (Array.isArray(coordinates[0])) {
    return coordinates.map((coord) => parseAllFloats(coord));
  }
  return coordinates.map((coord) => {
    const float = (parseFloat(coord) > 180) ? (-360 + parseFloat(coord)) : parseFloat(coord);
    if (Number.isNaN(float)) console.log('coord', coord);
    return float;
  });
}

const getExistingCountries = () => db.collection(MONGO_TARGET_COLLECTION_NAME).find({ level: 'country' }).toArray();

const getAllCountries = async () => {
  const url = 'https://data.enseignementsup-recherche.gouv.fr/api/explore/v2.1/catalog/datasets/curiexplore-pays/records';
  const response = await fetch(`${url}?limit=0`);
  const json = await response.json();
  const totalCount = json?.total_count ?? 0;
  let countries = []
  while (countries.length < totalCount) {
    const response = await fetch(`${url}?limit=100&offset=${countries.length}`);
    const json = await response.json();
    countries = countries.concat(json?.results ?? []);
  }
  return countries;
}

async function treatment() {
  const countries = await getAllCountries();
  const existingCountries = await getExistingCountries();

  // Get Paysage ids
  const ids = await createPaysageIds(countries, countries.length - existingCountries.length);

  // Overload with geojson and Paysage Id
  const augmentedCountries = countries.map((country, index) => {
    const geojson = geojsons.features.find((geojson) => geojson.properties.iso_a3 === country.iso3);
    let geometry = undefined;
    if (geojson) {
      geometry = {
        type: geojson.geometry.type,
        coordinates: parseAllFloats(geojson.geometry.coordinates),
      }
    }
    return {
      ...country,
      geometry,
      idpaysage: existingCountries.find((existingCountry) => existingCountry.originalId === country.iso3)?.id || ids[index],
    }
  });

  const promises = augmentedCountries.filter((country) => country.iso3 !== 'CA-QC').map((country) => {
    return {
      geometry: country.geometry,
      id: country.idpaysage,
      level: 'country',
      nameFr: country.name_fr,
      originalId: country.iso3,
      wikidata: country.wikidata,
      groups: [
        country.ue27 === 'True' ? 'ue27' : undefined,
        country.g7 === 'True' ? 'g7' : undefined,
        country.g20 === 'True' ? 'g20' : undefined,
        country.bologne === 'True' ? 'bologne' : undefined
      ].filter((item) => item !== undefined),
    }
  }).map((set) => (
    db.collection(MONGO_TARGET_COLLECTION_NAME).updateOne({ originalId: set.originalId }, { $set: set }, { upsert: true })
  ));

  let fileContent = Object.keys(augmentedCountries[0]).join(CSV_SEPARATOR) + '\n';
  fileContent += augmentedCountries.map((augmentedCountry) => {
    augmentedCountry.latlng = `${augmentedCountry.latlng.lat}, ${augmentedCountry.latlng.lon}`;
    augmentedCountry.geometry = JSON.stringify(augmentedCountry.geometry);
    return augmentedCountry;
  }).map((augmentedCountry) => Object.values(augmentedCountry).join(CSV_SEPARATOR)).join('\n');

  fs.writeFile('./scripts/countries.csv', fileContent, 'utf8', function (err) {
    if (err) {
      console.log('Some error occured - file either not saved or corrupted file saved.');
    }
  });

  return Promise.all(promises);
}

console.log('--- START ---');
await treatment();
await client.close();
console.log('--- END ---');
