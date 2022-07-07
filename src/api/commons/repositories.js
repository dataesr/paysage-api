import { db } from '../../services/mongo.service';
import BaseMongoRepository from './libs/base.mongo.repository';
import NestedMongoRepository from './libs/nested.mongo.repository';

export const catalogRepository = new BaseMongoRepository({ db, collection: '_catalog' });
export const categoriesRepository = new BaseMongoRepository({ db, collection: 'categories' });
export const documentsRepository = new BaseMongoRepository({ db, collection: 'documents' });
export const documentTypesRepository = new BaseMongoRepository({ db, collection: 'documenttypes' });
export const emailsRepository = new BaseMongoRepository({ db, collection: 'emails' });
export const emailTypesRepository = new BaseMongoRepository({ db, collection: 'emailtypes' });
export const eventsRepository = new BaseMongoRepository({ db, collection: '_events' });
export const identifiersRepository = new BaseMongoRepository({ db, collection: 'identifiers' });
export const legalcategoriesRepository = new BaseMongoRepository({ db, collection: 'legalcategories' });
export const officialtextsRepository = new BaseMongoRepository({ db, collection: 'officialtexts' });
export const personsRepository = new BaseMongoRepository({ db, collection: 'persons' });
export const pricesRepository = new BaseMongoRepository({ db, collection: 'prices' });
export const projectLocalisationsRepository = new NestedMongoRepository({ db, collection: 'projects', field: 'localisations' });
export const projectsRepository = new BaseMongoRepository({ db, collection: 'projects' });
export const relationshipsRepository = new BaseMongoRepository({ db, collection: 'relationships' });
export const socialmediasRepository = new BaseMongoRepository({ db, collection: 'socialmedias' });
export const structureLocalisationsRepository = new NestedMongoRepository({ db, collection: 'structures', field: 'localisations' });
export const structureLogosRepository = new NestedMongoRepository({ db, collection: 'structures', field: 'logos' });
export const structureNamesRepository = new NestedMongoRepository({ db, collection: 'structures', field: 'names' });
export const structuresRepository = new BaseMongoRepository({ db, collection: 'structures' });
export const supervisingMinistersRepository = new BaseMongoRepository({ db, collection: 'supervisingministers' });
export const termsRepository = new BaseMongoRepository({ db, collection: 'terms' });
export const usersRepository = new BaseMongoRepository({ db, collection: 'users' });
export const weblinksRepository = new BaseMongoRepository({ db, collection: 'weblinks' });
