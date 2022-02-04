import axios from 'axios';
import mongodb from 'mongodb';
const MONGO_URI = 'mongodb://apps:g256ebr0wAUzn3CkhJRq@node1-32c5d10cc5b28490.database.cloud.ovh.net/admin?replicaSet=replicaset&tls=true';
const MONGO_DBNAME = 'paysage-devj'


async function getAllStructuresIds() {
    // => Récupération de l'objet globalpaysage V1
    console.log('Récupération de l\'objet global ...');

    // Récupération via fichier json
    const allObjects = await axios.get('https://paysage.mesri.fr/json/Objets.json');
    return Object.values(allObjects?.data).filter((obj) => obj?.attribute_5 === 'Structure')
        .map((structure) => (structure.token));

    // Récupération via ODS (miseà jour toutes les heures)
    // https://data.enseignementsup-recherche.gouv.fr/api/records/1.0/search/?dataset=fr-esr-objets-paysage&q=&facet=attribute_5&facet=etat&facet=attribute_26&facet=token&facet=attribute_33&facet=attribute_52&facet=attribute_41&facet=attribute_53&facet=attribute_46&facet=attribute_43&facet=attribute_6&facet=attribute_42&facet=attribute_40&facet=attribute_4&facet=attribute_13&facet=attribute_54&facet=attribute_17&facet=attribute_18&facet=attribute_19&facet=attribute_20&facet=attribute_21&facet=attribute_10&facet=attribute_11&facet=attribute_3&facet=attribute_31&facet=attribute_78
}

async function getOneStructure(id) {
    // => Récupération de l'objet globalpaysage V1
    console.log('Récupération de la structure =>', id);
    const structure = await axios.get(`https://paysage.mesri.fr/json/Objets/${id}.json`);
    return structure.data;
}

async function deleteCollections() {
    // => Suppression des collections Mongodb
    const exists = await db.collection('catalogue').findOne();
    return exists

}

async function postOneStructure(db, structure) {
    // TODO => Insertion via Paysage-api
    // Mongo, ES, Object storage
    console.log('post de la structure');

    db.collection("structures").insertOne(structure, function (err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        // db.close();
    });
}

async function connect() {
    const client = new mongodb.MongoClient(
        MONGO_URI,
        { useNewUrlParser: true, useUnifiedTopology: true },
    );
    console.log(`=> Try to connect to mongo... ${MONGO_URI}`);

    client.connect().catch((e) => {
        logger.info(`Connexion to mongo instance failed... Terminating... ${e.message}`);
        process.kill(process.pid, 'SIGTERM');
    });

    const db = client.db(MONGO_DBNAME);

    return { client, db };
}

async function listCollections(db) {
    const list = await db.listCollections().toArray();
    return list;
}

async function deleteCollection(db, collection) {
    const allCollections = await listCollections(db);
    if (allCollections.find((item) => item.name === collection)) {
        db.collection(collection).drop(function (err, delOK) {
            if (err) throw err;
            if (delOK) console.log(`Collection ${collection} deleted`);
        });
    }
}

const getDate = (d) => {
    let aDate = new Date();
    if (typeof d !== 'undefined') {
        aDate = new Date(d);
    }
    // const aDate = new Date((typeof d !== ' undefined') ? d : '');
    return {
        id: 1, // TODO
        day: aDate.getDate(),
        month: aDate.getMonth() + 1,
        year: aDate.getFullYear(),
    };
};

const getIds = (ids) => (
    Object.keys(ids).map((ident) => (
        {
            id: ids[ident][0].Id,
            type: ident,
            active: ids[ident][0].etat === 'A',
            startDate: getDate(ids[ident][0].startdate),
            createdBy: 'init',
            createdAt: getDate(),
        }
    ))
);

const getNaming = (denominations) => (
    {
        id: 1, // TODO
        officialName: denominations[0].Libelle,
        usualName: denominations[0].Libelle2,
        shortName: denominations[0]['494486X85X1267'],
        nameEn: denominations[0]['494486X85X1267'],
        acronymFr: denominations[0]['494486X85X2681'],
        acronymEn: '',
        main: true,
        startDate: getDate(denominations[0].startdate),
        createdBy: 'init',
        createdAt: getDate(),
    }
);

const getLegalPersonalities = () => {
    return [];
}

const getCategories = (categories) => {
    if (!categories) return [];
    return categories.map((cat) => (
        {
            id: 1, // TODO
            longNameFr: cat.Parent,
            createdBy: 'init',
            createdAt: getDate(),
        }
    ))
};

const getWebsitePages = (variables) => {
    if (!variables) return {};
    return {
        id: 1, // TODO
        organisationPageUrl: variables.SitePrincipal,
        createdBy: 'init',
        createdAt: getDate(),
    };
};

const getSocialMedia = (socials) => {
    if (!socials) return [];
    const socialMediaList = [];
    if (socials?.Wikipedia) {
        Object.keys(socials.Wikipedia).forEach((langKey) => {
            socialMediaList.push(
                {
                    id: 'Wikipedia',
                    type: socials.Wikipedia[langKey].Langue,
                    lang: langKey,
                    account: socials.Wikipedia[langKey].wikipedia,
                    createdBy: 'init',
                    createdAt: getDate(),
                }
            );
        })
    }
    if (socials?.SitesExternes?.Hal) {
        socialMediaList.push(
            {
                id: 'Hal',
                type: 'Hal',
                account: socials.SitesExternes.Hal,
                createdBy: 'init',
                createdAt: getDate(),
            }
        );
    }
    if (socials?.SitesExternes?.ServicePublic) {
        socialMediaList.push(
            {
                id: 'ServicePublic',
                type: 'ServicePublic',
                account: socials.SitesExternes.ServicePublic,
                createdBy: 'init',
                createdAt: getDate(),
            }
        );
    }
    const addSocial = (s) => {
        if (socials?.ComptesSociaux?.Twitter) {
            socialMediaList.push(
                {
                    id: s,
                    type: s,
                    account: socials.ComptesSociaux[s],
                    createdBy: 'init',
                    createdAt: getDate(),
                }
            )
        }
    };
    const socialsList = ['Twitter', 'Facebook', 'Linkedin', 'franceculture'];
    socialsList.forEach((s) => { addSocial(s) });

    return socialMediaList;
}

const getLocalisation = (localisation) => {
    if (!localisation) return {};
    return {
        id: 1,
        address: localisation.adresse,
        city: localisation.com_nom,
        country: localisation['353588X52X595PAYS'],
        lat: localisation?.gps?.split(',')[0],
        ln: localisation?.gps?.split(',')[1],
        startDate: getDate(localisation.startdate),
        createdBy: 'init',
        createdAt: getDate(),
    };
}

const getStructureV2 = (structureV1) => ({
    comment: 'test initialisation',
    id: structureV1.id,
    active: structureV1.Variables.Etat,
    identifierIds: getIds(structureV1.Identifiant),
    naming: getNaming(structureV1.Denominations),
    descriptionFr: '',
    descriptionEn: '',
    legalPersonalities: getLegalPersonalities(),
    categories: getCategories((structureV1.Categorie) ? structureV1.Categorie : null),
    websitePages: getWebsitePages(structureV1.Variables),
    socialMedia: getSocialMedia(structureV1.Internet || null),
    localisation: getLocalisation((typeof (structureV1.Localisation[0]) !== 'undefined') ? structureV1.Localisation[0] : null),
    createdBy: 'init',
    createdAt: getDate(),
});


// ================ Script d'initialisation des bases paysage V2 ========
// => Suppression des objets si existants
// Mongo
const { db } = await connect();

// Suppression de la collection "structures"
deleteCollection(db, 'structures');

// Suppression de la collection "catalogue"
// deleteCollection(db, 'catalogue');

// ES
// ...

// Object storage
// ...


getAllStructuresIds().then(async (ids) => {
    ids.forEach((id, index) => {
        setTimeout(async () => {
            // if (id === '7Y9B0') { // Université du mont Kenya
            // if (id === '8k883') { // Université Sorbonne Nouvelle - Paris 3
            if (id === 'AzRIk' || id === 'pap5O') {
                // if (index < 1000) {
                const structureV1 = await getOneStructure(id);
                const structureV2 = getStructureV2(structureV1);
                postOneStructure(db, structureV2);
            }
        }, index * 1000)
    })
});