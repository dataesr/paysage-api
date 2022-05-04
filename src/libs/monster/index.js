import NestedControllers from './controllers/nested.controller';
import BaseController from './controllers/base.controller';
import NestedMongoRepository from './repositories/nested.mongo.repository';
import BaseMongoRepository from './repositories/base.mongo.repository';
import Catalog from './repositories/catalog.repository';

class Resource {
  constructor(
    { db, collection, field = null, queries = {} },
    { catalog = null, eventStore = null, storeContext = true } = {},
  ) {
    this.catalog = catalog;
    this.eventStore = eventStore;
    this.repository = (field)
      ? new NestedMongoRepository({ db, collection, field, queries })
      : new BaseMongoRepository({ db, collection, queries });
    this.controllers = (field)
      ? new NestedControllers(this.repository, { storeContext, eventStore, catalog })
      : new BaseController(this.repository, { storeContext, eventStore, catalog });
  }
}

export {
  BaseMongoRepository,
  NestedMongoRepository,
  Catalog,
  Resource,
};
