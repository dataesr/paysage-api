import axios from 'axios';

const getAxios = async (url) => {
  const ret = await axios.get(url);

  ret.forEach((element) => {
    console.log(element.attribute_5);
  });

  return ret;
};

// ================ Script d'initialisation des bases paysage V2 ========
// => Suppression des objets si existants
// Mongo
// db.collection('catalogue')
// db.collection('structures')

// ES

// Object storage

// => Récupération de l'objet globalpaysage V1
const allObjects = getAxios('https://paysage.mesri.fr/json/Objets.json');

// Filtre sur les structures

// Parcours de tous les ids pour récupérer chaque structure
// => Récupération de la structure
// => Insertion via Paysage-api
// Mongo, ES, Object storage
