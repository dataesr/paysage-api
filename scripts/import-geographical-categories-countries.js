/* eslint-disable max-len */
/* eslint-disable no-console */

/*
1. Récupérer toutes les catégories de level "pays" dans la collection geographicalcategories
2. Récupérer tous les pays dans le fichier countries.geo.json
3. Pour chaque pays du fichier countries.geo.json, s'il existe dans la collection geographicalcategories, mettre à jour sinon ajouter
*/

// Lancement : NODE_ENV=development MONGO_URI="mongodb://localhost:27017" MONGO_DBNAME="paysage" node --experimental-specifier-resolution=node scripts/import-geographical-categories-countries.js
import 'dotenv/config';
import worldGeoJSON from './countries.geo.json' assert { type: "json" };

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
  return db.collection(MONGO_TARGET_COLLECTION_NAME).find({ level: 'pays' }).toArray();
}

async function treatment() {
  const countriesToUpgrade = await getCountriesToUpgrade();

  // Get paysage ids
  const ids = await getPaysageIds(countriesToUpgrade.length);

  const promises = worldGeoJSON.features.map((country, index) => ({
    geometry: country.geometry,
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
