import logger from '../services/logger.service';
import { db } from '../services/mongo.service';

const getODSUrl = (dataset) => `https://data.enseignementsup-recherche.gouv.fr/explore/dataset/${dataset}/download/?format=json`;

const backupData = async (job, done) => {
  logger.info('Backup data');
  const datasets = [{
    id: 'fr-esr-operateurs-indicateurs-financiers',
    name: 'finance',
    field: 'resultat_net_comptable',
    fieldName: 'netAccountingResult',
    paysageIdFields: ['etablissement_id_paysage'],
    sortField: 'exercice',
    sortFieldName: 'exercice',
  }, {
    id: 'fr-esr-statistiques-sur-les-effectifs-d-etudiants-inscrits-par-etablissement-pay',
    name: 'population',
    field: 'effectif',
    fieldName: 'population',
    paysageIdFields: ['etablissement_id_paysage'],
    sortField: '-annee_universitaire',
    sortFieldName: 'year',
  }, {
    id: 'fr-esr-insertion_professionnelle_widget',
    name: 'inserpro',
    paysageIdFields: ['id_paysage'],
    // }, {
    //   url: 'fr-esr-insertion-professionnelle-des-diplomes-doctorat-par-etablissement',
    //   name: 'inserpro-phd',
  }, {
    id: 'fr-esr-piaweb',
    name: 'piaweb',
    paysageIdFields: ['etablissement_id_paysage', 'etablissement_coordinateur'],
  }, {
    id: 'piaweb_paysage',
    name: 'piaweb-paysage',
    paysageIdFields: ['etablissement_id_paysage'],
  /*
  }, {
    // Download might fail with "Unexpected end of JSON input" error if not enough RAM
    id: 'fr-esr-sise-effectifs-d-etudiants-inscrits-esr-public',
    name: 'population-sise',
    paysageIdFields: ['etablissement_id_paysage'],
  */
  }, {
    id: 'fr-esr-statistiques-sur-les-effectifs-d-etudiants-inscrits-par-etablissement',
    name: 'population-statistics',
    paysageIdFields: ['etablissement_id_paysage'],
  /*
  }, {
    // Download might fail with "Unexpected end of JSON input" error if not enough RAM
    id: 'fr-esr-principaux-diplomes-et-formations-prepares-etablissements-publics',
    name: 'qualifications',
    paysageIdFields: ['etablissement_id_paysage'],
  */
  }, {
    id: 'fr-esr-patrimoine-immobilier-des-operateurs-de-l-enseignement-superieur',
    name: 'real-estate',
    paysageIdFields: ['paysage_id'],
  }, {
    id: 'fr-esr-tmm-donnees-du-portail-dinformation-trouver-mon-master-mentions-de-master',
    name: 'tmm-mentions',
    paysageIdFields: ['etablissement_id_paysage'],
  }, {
    id: 'fr-esr-tmm-donnees-du-portail-dinformation-trouver-mon-master-parcours-de-format',
    name: 'tmm-trainings',
    paysageIdFields: ['etablissement_id_paysage'],
  }, {
    id: 'fr-esr-cartographie_formations_parcoursup',
    name: 'tranings',
    paysageIdFields: ['etablissement_id_paysage', 'composante_id_paysage'],
  }, {
    id: 'fr-esr-personnels-biatss-etablissements-publics',
    name: 'biatss',
    paysageIdFields: ['etablissement_id_paysage', 'etablissement_id_paysage_actuel'],
  }];

  datasets.forEach(async (dataset) => {
    const url = getODSUrl(dataset.id);
    let data = [];
    try {
      const response = await fetch(url, { headers: { Authorization: `Apikey ${process.env.ODS_API_KEY}` } });
      data = await response.json();
    } catch (e) {
      logger.error(`Error while loading data from ${url}`);
      logger.error(e);
    }
    const operationsKeyNumbers = data?.length && data
      .map((item) => {
        const paysageIds = dataset.paysageIdFields.map((field) => item.fields?.[field]).map((id) => id?.split(',')).flat();
        return paysageIds.map((paysageId) => ({
          updateOne: {
            filter: { id: { $eq: item.recordid } },
            update: { $set: { ...item.fields, id: item.recordid, dataset: dataset.name, resourceId: paysageId, updatedAt: new Date() } },
            upsert: true,
          },
        }));
      }).flat();
    let operationsStructures = [];
    if (dataset?.field) {
      const uniqueStructures = [];
      operationsStructures = data?.length && data
        .filter((item) => item?.fields?.[dataset?.sortField])
        .sort((a, b) => ((dataset?.sortField?.[0] === '-')
          ? (a.fields[dataset.sortField] - b.fields[dataset.sortField])
          : (b.fields[dataset.sortField] - a.fields[dataset.sortField])))
        .filter((item) => {
          if (!uniqueStructures.includes(item.fields[dataset.paysageIdFields])) {
            uniqueStructures.push(item.fields[dataset.paysageIdFields]);
            return item;
          }
          return false;
        })
        .map((item) => {
          const set = {};
          if (dataset && dataset?.field && item && item?.fields?.[dataset.field]) set[dataset.fieldName] = item.fields[dataset.field];
          if (dataset && dataset?.sortField && item && item?.fields?.[dataset.sortField]) set[dataset.sortFieldName] = item.fields[dataset.sortField];
          if (Object.keys(set).length > 0) {
            return {
              updateOne: {
                filter: { id: { $eq: item.fields[dataset.paysageIdFields] } },
                update: { $set: set },
              },
            };
          }
          return {};
        });
    }
    try {
      if (operationsKeyNumbers?.length) {
        await db.collection('keynumbers').deleteMany({ dataset: dataset.name });
        await db.collection('keynumbers').bulkWrite(operationsKeyNumbers, { ordered: false });
      }
      if (operationsStructures?.length) {
        logger.info('operationsStructure');
        logger.info(operationsStructures.length);
        logger.info(JSON.stringify(operationsStructures?.[0]));
        logger.info(JSON.stringify(operationsStructures?.[0]?.updateOne?.filter?.id?.$eq));
        logger.info(operationsStructures?.filter((item) => item?.updateOne?.filter?.id?.$eq === 'u79ZJ')?.[0]);
        logger.info(JSON.stringify(operationsStructures?.filter((item) => item?.updateOne?.filter?.id?.$eq === 'u79ZJ')?.[0]));
        await db.collection('structures').bulkWrite(operationsStructures, { ordered: false });
      }
      logger.info(`Data setup successful for dataset ${dataset.name}`);
      done();
    } catch (e) {
      logger.error({ message: 'Data setup failed' });
      logger.error(e);
      done();
    }
  });
};

export default backupData;
