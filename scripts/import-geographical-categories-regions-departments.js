// Example : NODE_ENV=development MONGO_URI="mongodb://localhost:27017" MONGO_DBNAME="paysage" node --experimental-specifier-resolution=node scripts/import-geographical-categories-regions-departments.js
// source regions: https://data.opendatasoft.com/explore/dataset/georef-france-region%40public/export/?disjunctive.reg_name
// Source departments: https://data.opendatasoft.com/explore/dataset/georef-france-departement%40public/table/?disjunctive.reg_name&disjunctive.dep_name&sort=year
import 'dotenv/config';

import { client, db } from '../src/services/mongo.service';
import BaseMongoCatalog from '../src/api/commons/libs/base.mongo.catalog';

const MONGO_SOURCE_COLLECTION_NAME = 'geocodes';
const MONGO_TARGET_COLLECTION_NAME = 'geographicalcategories';

import regions from './regions.geo.json' assert { type: "json" };
import departments from './departments.geo.json' assert { type: "json" };

const configs = [
  {
    data: regions,
    geoCodeField: 'reg_code',
    level: 'region',
    prefix: 'R',
    sourceIdField: 'reg_id',
    sourceIdLength: 2,
    sourceNameField: 'reg_nom',
  },
  {
    data: departments,
    geoCodeField: 'dep_code',
    level: 'department',
    parentIdField: 'reg_id',
    prefix: 'D',
    sourceIdField: 'dep_id',
    sourceIdLength: 3,
    sourceNameField: 'dep_nom',
  },
];

async function treatment() {
  const promises = configs.map(async (config) => {
    const data = config.data;
    // Load uniq from Mongo geocodes
    const uniqueGeoIds = await db.collection(MONGO_SOURCE_COLLECTION_NAME).distinct(config.sourceIdField);
    const uniqueGeos = await Promise.all(
      uniqueGeoIds.map((uniqueRegionId) => db.collection(MONGO_SOURCE_COLLECTION_NAME).findOne({ [config.sourceIdField]: uniqueRegionId })),
    );
    // Generate as many ids as needed
    const catalog = new BaseMongoCatalog({ db, collection: '_catalog' });
    const allIds = await Promise.all(
      uniqueGeos.map(() => catalog.getUniqueId(MONGO_TARGET_COLLECTION_NAME, 5)),
    );
    const p = uniqueGeos.map((geo, index) => ({
      geometry: data.features.find((geojson) => `${config.prefix}${geojson.properties[config.geoCodeField][0].length < config.sourceIdLength ? '0' : ''}${geojson.properties[config.geoCodeField][0]}` === geo[config.sourceIdField])?.geometry || null,
      id: allIds[index],
      level: config.level,
      nameFr: geo[config.sourceNameField],
      originalId: geo[config.sourceIdField],
      parentOriginalId: config.level === 'region' ? 'FRA' : geo[config.parentIdField],
    })).map((geo) => db.collection(MONGO_TARGET_COLLECTION_NAME).updateOne({ originalId: geo.originalId }, { $set: geo }, { upsert: true }));
    await Promise.all(p);
  });
  await Promise.all(promises);
}

console.log('--- START ---');
await treatment();
await client.close();
console.log('--- END ---');

// TODO
// Ajouter les geojson
// Ajouter le parent direct
// Modifier l'API pour autoriser l'urban unitf
// Pays : https://data.enseignementsup-recherche.gouv.fr/explore/dataset/curiexplore-pays/table/?disjunctive.iso3&sort=iso3
// + ajouter lien vers la fichecurie
// pour une fiche pays ajouter ls groupes d'appartenance (Bologne, UE27, EURO blabla)

// description
