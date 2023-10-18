/* eslint-disable max-len */
/* eslint-disable no-console */

/*
1. Récupérer toutes les catégories de level "country" dans la collection geographicalcategories
2. Récupérer tous les pays dans le fichier countries.geo.json
3. Pour chaque pays du fichier countries.geo.json, s'il existe dans la collection geographicalcategories, mettre à jour sinon ajouter
*/

// Lancement : NODE_ENV=development MONGO_URI="mongodb://localhost:27017" MONGO_DBNAME="paysage" node --experimental-specifier-resolution=node scripts/import-geographical-categories-countries.js

import 'dotenv/config';
import worldGeoJSON from './data/countries.geo.json' assert { type: "json" };

import { client, db } from '../src/services/mongo.service';
import BaseMongoCatalog from '../src/api/commons/libs/base.mongo.catalog';

const MONGO_TARGET_COLLECTION_NAME = 'geographicalcategories';

async function getPaysageIds(existingIdsCount) {
  const catalog = new BaseMongoCatalog({ db, collection: '_catalog' });
  return Promise.all(
    worldGeoJSON.features.slice(0, worldGeoJSON.features.length - existingIdsCount).map(() => catalog.getUniqueId(MONGO_TARGET_COLLECTION_NAME, 5)),
  );
}

async function getCountriesToUpgrade() {
  return db.collection(MONGO_TARGET_COLLECTION_NAME).find({ level: 'country' }).toArray();
}

function parseAllFloats(coordinates) {
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

async function treatment() {
  const countriesToUpgrade = await getCountriesToUpgrade();

  // Get paysage ids
  const ids = await getPaysageIds(countriesToUpgrade.length);

  const promises = worldGeoJSON.features.filter((country) => country.properties.iso_a3 !== '-99').map((country, index) => ({
    geometry: {
      type: country.geometry.type,
      coordinates: parseAllFloats(country.geometry.coordinates),
    },
    id: countriesToUpgrade.find((item) => item.originalId === country.properties.iso_a3)?.id || ids[index],
    level: 'country',
    nameFr: country.properties.name_fr,
    originalId: country.properties.iso_a3,
  })).map((geo) => (
    db.collection(MONGO_TARGET_COLLECTION_NAME).updateOne({ originalId: geo.originalId }, { $set: geo }, { upsert: true })
  ));

  await Promise.all(promises);
}

console.log('--- START ---');
await treatment();
await client.close();
console.log('--- END ---');
