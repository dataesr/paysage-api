// Example : NODE_ENV=development MONGO_URI="mongodb://localhost:27017" MONGO_DBNAME="paysage" node --experimental-specifier-resolution=node scripts/reset-localisation-status.js

import 'dotenv/config';

import { client, db } from '../src/services/mongo.service';

const MONGO_SOURCE_COLLECTION_NAME = 'structures';

async function getAndUpdateLocalisationStatus() {
  const currentDate = new Date();
  currentDate.setUTCHours(0, 0, 0, 0);

  const result = await db.collection(MONGO_SOURCE_COLLECTION_NAME).updateMany(
    { 'localisations.endDate': { $lt: currentDate.toISOString().split('T')[0] } },
    { $set: { 'localisations.$.active': false } },
  );
  console.log(`Nombre de documents mis à jour : ${result.modifiedCount}`);
}
console.log('Début du script');

getAndUpdateLocalisationStatus();
// client moved to close script
await client.close();
