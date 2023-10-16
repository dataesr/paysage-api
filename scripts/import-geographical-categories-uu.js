import 'dotenv/config';
import refUU from './data/referentiel-geographique-francais-communes-unites-urbaines-aires-urbaines-depart.json' assert { type: "json" };

import { client, db } from '../src/services/mongo.service';
import BaseMongoCatalog from '../src/api/commons/libs/base.mongo.catalog';

const MONGO_TARGET_COLLECTION_NAME = 'geographicalcategories';

async function getUUToUpgrade() {
    return db.collection(MONGO_TARGET_COLLECTION_NAME).find({ level: 'urbanUnity' }).toArray();
}

async function getPaysageIds(existingIdsCount, listUU) {
    const catalog = new BaseMongoCatalog({ db, collection: '_catalog' });
    return Promise.all(
        Object.keys(listUU).slice(0, Object.keys(listUU).length - existingIdsCount).map(() => catalog.getUniqueId(MONGO_TARGET_COLLECTION_NAME, 5)),
    );
}

async function treatment() {
    const allUu = {};
    refUU.forEach((el) => {
        if (el.uu_code) {
            if (!allUu[el.uu_code]) {
                allUu[el.uu_code] = {
                    list: [{
                        code_com: el.com_code,
                        geometry: el.geom.geometry || null,
                    }],
                    uucr_nom: el.uucr_nom
                }
            } else {
                allUu[el.uu_code].list.push({
                    code_com: el.com_code,
                    geometry: el.geom.geometry || null,
                });
            }
        }
    });

    const uUToUpgrade = await getUUToUpgrade();

    // Get paysage ids
    const ids = await getPaysageIds(uUToUpgrade.length, allUu);
    const promises = Object.keys(allUu).map((urbanUnity, index) => ({
        geometry: { coordinates: allUu[urbanUnity].list.map((commune) => commune.geometry.coordinates[0]), type: "MultiPolygon" },
        id: uUToUpgrade.find((item) => item.originalId === urbanUnity)?.id || ids[index],
        level: 'urbanUnity',
        nameFr: allUu[urbanUnity].uucr_nom,
        originalId: urbanUnity,
    })).map((geo) => (
        db.collection(MONGO_TARGET_COLLECTION_NAME).updateOne({ originalId: geo.originalId }, { $set: geo }, { upsert: true })
    ));

    await Promise.all(promises);
}

console.log('--- START ---');
await treatment();
await client.close();
console.log('--- END ---');