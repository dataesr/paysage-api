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
    paysageIdField: ['etablissement_id_paysage'],
    sortField: 'exercice',
    sortFieldName: 'exercice',
  }, {
    id: 'fr-esr-statistiques-sur-les-effectifs-d-etudiants-inscrits-par-etablissement-pay',
    name: 'population',
    field: 'effectif',
    fieldName: 'population',
    paysageIdField: ['etablissement_id_paysage'],
    sortField: 'annee',
    sortFieldName: 'year',
  }, {
    id: 'fr-esr-insertion_professionnelle_widget',
    name: 'inserpro',
    paysageIdField: ['id_paysage'],
    // }, {
    //   url: 'fr-esr-insertion-professionnelle-des-diplomes-doctorat-par-etablissement',
    //   name: 'inserpro-phd',
  }, {
    id: 'fr-esr-piaweb',
    name: 'piaweb',
    paysageIdField: ['etablissement_id_paysage', 'etablissement_coordinateur'],
  }, {
    id: 'piaweb_paysage',
    name: 'piaweb-paysage',
    paysageIdField: ['etablissement_id_paysage'],
  }, {
    // Download might fail with "Unexpected end of JSON input" error if not enough RAM
    id: 'fr-esr-sise-effectifs-d-etudiants-inscrits-esr-public',
    name: 'population-sise',
    paysageIdField: ['etablissement_id_paysage'],
  }, {
    id: 'fr-esr-statistiques-sur-les-effectifs-d-etudiants-inscrits-par-etablissement',
    name: 'population-statistics',
    paysageIdField: ['etablissement_id_paysage'],
  }, {
    // Download might fail with "Unexpected end of JSON input" error if not enough RAM
    id: 'fr-esr-principaux-diplomes-et-formations-prepares-etablissements-publics',
    name: 'qualifications',
    paysageIdField: ['etablissement_id_paysage'],
  }, {
    id: 'fr-esr-patrimoine-immobilier-des-operateurs-de-l-enseignement-superieur',
    name: 'real-estate',
    paysageIdField: ['paysage_id'],
  }, {
    id: 'fr-esr-tmm-donnees-du-portail-dinformation-trouver-mon-master-mentions-de-master',
    name: 'tmm-mentions',
    paysageIdField: ['etablissement_id_paysage'],
  }, {
    id: 'fr-esr-tmm-donnees-du-portail-dinformation-trouver-mon-master-parcours-de-format',
    name: 'tmm-trainings',
    paysageIdField: ['etablissement_id_paysage'],
  }, {
    id: 'fr-esr-cartographie_formations_parcoursup',
    name: 'tranings',
    paysageIdField: ['etablissement_id_paysage', 'composante_id_paysage'],
  }];
  datasets.forEach(async (dataset) => {
    const url = getODSUrl(dataset.id);
    let data = [];
    try {
      const response = await fetch(url, { headers: { Authorization: `Apikey ${process.env.ODS_API_KEY}` } });
      data = await response.json();
    } catch (e) {
      console.log(`Error while loading data from ${url}`);
      console.log(e);
    }
    const operationsKeyNumbers = data
      .filter((item) => item?.fields?.[dataset?.paysageIdField])
      .map((item) => {
        const paysageIds = dataset.paysageIdField.map((field) => item.fields?.[field]).map((id) => id.split(',')).flat();
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
      operationsStructures = data
        .filter((item) => item?.fields?.[dataset?.sortField])
        .sort((a, b) => (b.fields[dataset.sortField] - a.fields[dataset.sortField]))
        .filter((item) => {
          if (!uniqueStructures.includes(item.fields[dataset.paysageIdField])) {
            uniqueStructures.push(item.fields[dataset.paysageIdField]);
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
                filter: { id: { $eq: item.fields[dataset.paysageIdField] } },
                update: { $set: set },
              },
            };
          }
          return {};
        });
    }
    try {
      if (operationsKeyNumbers?.length) {
        await db.collection('keynumbers').bulkWrite(operationsKeyNumbers, { ordered: false });
      }
      if (operationsStructures?.length) {
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
