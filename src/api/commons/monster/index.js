import BaseMongoRepository from '../repositories/base.mongo.repository';
import Catalog from '../repositories/catalog.repository';
import mongo from '../../../services/mongo.service';

const { db } = mongo;
const eventStore = new BaseMongoRepository({ db, collection: '_events' });
const internalCatalog = new Catalog({ db, collection: '_catalog' }, 8);
const objectCatalog = new Catalog({ db, collection: '_catalog' }, 5);

export { eventStore, internalCatalog, objectCatalog };
