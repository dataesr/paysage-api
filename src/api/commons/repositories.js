import { db } from '../../services/mongo.service';
import BaseMongoRepository from './libs/base.mongo.repository';
import TokensMongoRepository from './libs/base.mongo.tokens';
import NestedMongoRepository from './libs/nested.mongo.repository';
import UsersMongoRepository from './libs/users.mongo.repository';

export const apiKeysRepository = new BaseMongoRepository({
  db,
  collection: 'apikeys',
});
export const catalogRepository = new BaseMongoRepository({
  db,
  collection: '_catalog',
});
export const categoriesRepository = new BaseMongoRepository({
  db,
  collection: 'categories',
});
export const contactRepository = new BaseMongoRepository({
  db,
  collection: 'contact',
});
export const documentsRepository = new BaseMongoRepository({
  db,
  collection: 'documents',
});
export const documentTypesRepository = new BaseMongoRepository({
  db,
  collection: 'documenttypes',
});
export const emailsRepository = new BaseMongoRepository({
  db,
  collection: 'emails',
});
export const emailTypesRepository = new BaseMongoRepository({
  db,
  collection: 'emailtypes',
});
export const eventsRepository = new BaseMongoRepository({
  db,
  collection: '_events',
});
export const followUpsRepository = new BaseMongoRepository({
  db,
  collection: 'followups',
});
export const geographicalCategoriesRepository = new BaseMongoRepository({
  db,
  collection: 'geographicalcategories',
});
export const geographicalCategoriesExceptionsRepository = new BaseMongoRepository({ db, collection: 'geographicalexceptions' });
export const groupsRepository = new BaseMongoRepository({
  db,
  collection: 'groups',
});
export const groupMembersRepository = new BaseMongoRepository({
  db,
  collection: 'groupmembers',
});
export const identifiersRepository = new BaseMongoRepository({
  db,
  collection: 'identifiers',
});
export const jobsRepository = new BaseMongoRepository({
  db,
  collection: '_jobs',
});
export const legalcategoriesRepository = new BaseMongoRepository({
  db,
  collection: 'legalcategories',
});
export const officialtextsRepository = new BaseMongoRepository({
  db,
  collection: 'officialtexts',
});
export const personsRepository = new BaseMongoRepository({
  db,
  collection: 'persons',
});
export const pressRepository = new BaseMongoRepository({
  db,
  collection: 'press',
});
export const prizesRepository = new BaseMongoRepository({
  db,
  collection: 'prizes',
});
export const projectLocalisationsRepository = new NestedMongoRepository({
  db,
  collection: 'projects',
  field: 'localisations',
});
export const projectsRepository = new BaseMongoRepository({
  db,
  collection: 'projects',
});
export const relationshipsRepository = new BaseMongoRepository({
  db,
  collection: 'relationships',
});
export const relationsGroupsRepository = new BaseMongoRepository({
  db,
  collection: 'relationsgroups',
});
export const relationTypesRepository = new BaseMongoRepository({
  db,
  collection: 'relationtypes',
});
export const sireneUpdatesRepository = new BaseMongoRepository({
  db,
  collection: 'sirene_updates',
});
export const socialmediasRepository = new BaseMongoRepository({
  db,
  collection: 'socialmedias',
});
export const structureLocalisationsRepository = new NestedMongoRepository({
  db,
  collection: 'structures',
  field: 'localisations',
});
export const structureLogosRepository = new NestedMongoRepository({
  db,
  collection: 'structures',
  field: 'logos',
});
export const structureNamesRepository = new NestedMongoRepository({
  db,
  collection: 'structures',
  field: 'names',
});
export const structuresRepository = new BaseMongoRepository({
  db,
  collection: 'structures',
});
export const supervisingMinistersRepository = new BaseMongoRepository({
  db,
  collection: 'supervisingministers',
});
export const termsRepository = new BaseMongoRepository({
  db,
  collection: 'terms',
});
export const tokensRepository = new TokensMongoRepository({
  db,
  collection: 'tokens',
});
export const usersRepository = new UsersMongoRepository({
  db,
  collection: 'users',
});
export const weblinksRepository = new BaseMongoRepository({
  db,
  collection: 'weblinks',
});
