export default [
  {
    id: 'fr-esr-operateurs-indicateurs-financiers',
    name: 'finance',
    field: 'resultat_net_comptable',
    fieldName: 'netAccountingResult',
    paysageIdFields: ['etablissement_id_paysage'],
    sortField: '-exercice',
    sortFieldName: 'exercice',
    extraField: 'source',
  },
  {
    id: 'fr-esr-statistiques-sur-les-effectifs-d-etudiants-inscrits-par-etablissement-pay',
    name: 'population',
    field: 'effectif',
    fieldName: 'population',
    paysageIdFields: ['etablissement_id_paysage'],
    sortField: '-annee_universitaire',
    sortFieldName: 'year',
  },
  {
    id: 'fr-esr-insertion_professionnelle_widget',
    name: 'inserpro',
    paysageIdFields: ['id_paysage'],
  },
  // {
  //   url: 'fr-esr-insertion-professionnelle-des-diplomes-doctorat-par-etablissement',
  //   name: 'inserpro-phd',
  // },
  {
    id: 'fr-esr-piaweb',
    name: 'piaweb',
    paysageIdFields: ['etablissement_id_paysage', 'etablissement_coordinateur'],
  },
  {
    id: 'piaweb_paysage',
    name: 'piaweb-paysage',
    paysageIdFields: ['etablissement_id_paysage'],
  },

  // {
  // // Download might fail with "Unexpected end of JSON input" error if not enough RAM
  //   id: 'fr-esr-sise-effectifs-d-etudiants-inscrits-esr-public',
  //   name: 'population-sise',
  //   paysageIdFields: ['etablissement_id_paysage'],
  // },
  {
    id: 'fr-esr-statistiques-sur-les-effectifs-d-etudiants-inscrits-par-etablissement',
    name: 'population-statistics',
    paysageIdFields: ['etablissement_id_paysage'],

  },
  // {
  //   // Download might fail with "Unexpected end of JSON input" error if not enough RAM
  //   id: 'fr-esr-principaux-diplomes-et-formations-prepares-etablissements-publics',
  //   name: 'qualifications',
  //   paysageIdFields: ['etablissement_id_paysage'],
  // },
  {
    id: 'fr-esr-patrimoine-immobilier-des-operateurs-de-l-enseignement-superieur',
    name: 'real-estate',
    paysageIdFields: ['paysage_id'],
  },
  {
    id: 'fr-esr-tmm-donnees-du-portail-dinformation-trouver-mon-master-mentions-de-master',
    name: 'tmm-mentions',
    paysageIdFields: ['etablissement_id_paysage'],
  },
  {
    id: 'fr-esr-tmm-donnees-du-portail-dinformation-trouver-mon-master-parcours-de-format',
    name: 'tmm-trainings',
    paysageIdFields: ['etablissement_id_paysage'],
  },
  {
    id: 'fr-esr-cartographie_formations_parcoursup',
    name: 'tranings',
    paysageIdFields: ['etablissement_id_paysage', 'composante_id_paysage'],
  },
  {
    id: 'fr-esr-personnels-biatss-etablissements-publics',
    name: 'biatss',
    paysageIdFields: ['etablissement_id_paysage', 'etablissement_id_paysage_actuel'],
  }];
