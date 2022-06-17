import { db } from '../../services/mongo.service';
import BaseMongoRepository from './libs/base.mongo.repository';
import NestedMongoRepository from './libs/nested.mongo.repository';

const catalogRepository = new BaseMongoRepository({ db, collection: '_catalog' });
const categoriesRepository = new BaseMongoRepository({ db, collection: 'categories' });
const documentsRepository = new BaseMongoRepository({ db, collection: 'documents' });
const emailsRepository = new BaseMongoRepository({ db, collection: 'emails' });
const eventsRepository = new BaseMongoRepository({ db, collection: '_events' });
const identifiersRepository = new BaseMongoRepository({ db, collection: 'identifiers' });
const legalcategoriesRepository = new BaseMongoRepository({ db, collection: 'legalcategories' });
const officialtextsRepository = new BaseMongoRepository({ db, collection: 'officialtexts' });
const personsRepository = new BaseMongoRepository({ db, collection: 'persons' });
const pricesRepository = new BaseMongoRepository({ db, collection: 'prices' });
const projectLocalisationsRepository = new NestedMongoRepository({ db, collection: 'projects', field: 'localisations' });
const projectsRepository = new BaseMongoRepository({ db, collection: 'projects' });
const relationshipsRepository = new BaseMongoRepository({ db, collection: 'relationships' });
const socialmediasRepository = new BaseMongoRepository({ db, collection: 'socialmedias' });
const structureNamesRepository = new NestedMongoRepository({ db, collection: 'structures', field: 'names' });
const structureLocalisationsRepository = new NestedMongoRepository({ db, collection: 'structures', field: 'localisations' });
const structureLogosRepository = new NestedMongoRepository({ db, collection: 'structures', field: 'logos' });
const structuresRepository = new BaseMongoRepository({ db, collection: 'structures' });
const termsRepository = new BaseMongoRepository({ db, collection: 'terms' });
const weblinksRepository = new BaseMongoRepository({ db, collection: 'weblinks' });

export {
  catalogRepository,
  categoriesRepository,
  documentsRepository,
  emailsRepository,
  eventsRepository,
  identifiersRepository,
  legalcategoriesRepository,
  officialtextsRepository,
  personsRepository,
  pricesRepository,
  projectLocalisationsRepository,
  projectsRepository,
  relationshipsRepository,
  socialmediasRepository,
  structuresRepository,
  structureNamesRepository,
  structureLocalisationsRepository,
  structureLogosRepository,
  termsRepository,
  weblinksRepository,
};
