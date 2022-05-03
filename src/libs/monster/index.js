import NestedControllers from './controllers/nested.controllers';
import Controllers from './controllers/base.controllers';
import NestedMongoRepository from './repositories/nested.mongo.repository';
import BaseMongoRepository from './repositories/base.mongo.repository';
import Catalog from './repositories/catalog.repository';

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
      ? new NestedControllers(this.repository, { storeContext, eventStore, catalog })
      : new Controllers(this.repository, { storeContext, eventStore, catalog });
  }
}

export {
  Resource,
  BaseMongoRepository,
  NestedMongoRepository,
  Catalog,
};
