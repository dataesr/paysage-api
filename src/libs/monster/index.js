import BaseController from './controllers/base.controller';
import NestedControllers from './controllers/nested.controller';
import BaseMongoRepository from './repositories/base.mongo.repository';
import Catalog from './repositories/catalog.repository';
import NestedMongoRepository from './repositories/nested.mongo.repository';

class Resource {
  constructor(
    { db, collection, field = null, queries = {} },
    { storeContext = true, eventStore = null, catalog = null } = {},
  ) {
    this.catalog = catalog;
    this.eventStore = eventStore;
    this.repository = (field)
      ? new NestedMongoRepository({ db, collection, field, queries })
      : new BaseMongoRepository({ db, collection, queries });
    this.controllers = (field)
      ? new NestedControllers(this.repository, { catalog, eventStore, storeContext })
      : new BaseController(this.repository, { catalog, eventStore, storeContext });
  }
}

export {
  BaseMongoRepository,
  Catalog,
  NestedMongoRepository,
  Resource,
};
