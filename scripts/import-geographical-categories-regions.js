// Example : NODE_ENV=development MONGO_URI="mongodb://localhost:27017" MONGO_DBNAME="paysage" node --experimental-specifier-resolution=node scripts/import-geographical-categories.js
// https://www.data.gouv.fr/fr/datasets/contours-des-communes-de-france-simplifie-avec-regions-et-departement-doutre-mer-rapproches/
import 'dotenv/config';

import fetch from 'node-fetch';
import { client, db } from './src/services/mongo.service';
import BaseMongoCatalog from './src/api/commons/libs/base.mongo.catalog';

const MONGO_SOURCE_COLLECTION_NAME = 'geocodes';
const MONGO_TARGET_COLLECTION_NAME = 'geographicalcategories';
const catalog = new BaseMongoCatalog({ db, collection: '_catalog' });

console.log('--- START ---');

const configs = [
  {
    prefix: 'R',
    level: 'region',
    sourceIdField: 'reg_id',
    sourceNameField: 'reg_nom',
    url: 'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/regions-avec-outre-mer.geojson',
  },
  // {
  //   prefix: 'D',
  //   level: 'department',
  //   sourceIdField: 'dep_id',
  //   sourceNameField: 'dep_nom',
  //   url: 'https://www.data.gouv.fr/fr/datasets/r/00c0c560-3ad1-4a62-9a29-c34c98c3701e',
  // },
];

await Promise.all(configs.map(async (config) => {
  // Load all geojson
  const response = await fetch(config.url);
  const data = await response.json();
  const geojsons = data?.features || [];
  // Load uniq from Mongo geocodes
  const uniqueGeoIds = await db.collection(MONGO_SOURCE_COLLECTION_NAME).distinct(config.sourceIdField);
  const uniqueGeos = await Promise.all(
    uniqueGeoIds.map((uniqueRegionId) => db.collection(MONGO_SOURCE_COLLECTION_NAME).findOne({ [config.sourceIdField]: uniqueRegionId })),
  );
  // Generate as many ids as needed
  const allIds = await Promise.all(
    uniqueGeos.map(() => catalog.getUniqueId(MONGO_TARGET_COLLECTION_NAME, 5)),
  );
  console.log(data);

  const promises = uniqueGeos.map((geo, index) => ({
    geometry: geojsons.find((geojson) => `${config.prefix}${geojson.properties.code}` === geo[config.sourceIdField])?.geometry || null,
    id: allIds[index],
    level: config.level,
    nameFr: geo[config.sourceNameField],
    originalId: geo[config.sourceIdField],
  })).map((geo) => db.collection(MONGO_TARGET_COLLECTION_NAME).updateOne({ originalId: geo.originalId }, { $set: geo }, { upsert: true }));
  await Promise.all(promises);
}));

client.close();
console.log('--- END ---');

// TODO
// Ajouter les pays
// Ajouter les geojson
// Ajouter le parent direct
// Modifier l'API pour autoriser l'urban unitf
// Pays : https://data.enseignementsup-recherche.gouv.fr/explore/dataset/curiexplore-pays/table/?disjunctive.iso3&sort=iso3
// + ajouter lien vers la fichecurie
// pour une fiche pays ajouter ls groupes d'appartenance (Bologne, UE27, EURO blabla)

// description
// indexer les caté geo
