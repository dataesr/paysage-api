import NestedControllers from './controllers/nested.controllers';
import Controllers from './controllers/base.controllers';
import NestedMongoRepository from './repositories/nested.mongo.repository';
import BaseMongoRepository from './repositories/base.mongo.repository';
import Catalogue from './repositories/catalogue.repository';

class Resource {
  constructor(
    { db, collection, field = null, queries = {} },
    { storeContext = true, eventStore = null, catalogue = null } = {},
  ) {
    this.catalogue = catalogue;
    this.eventStore = eventStore;
    this.repository = (field)
      ? new NestedMongoRepository({ db, collection, field, queries })
      : new BaseMongoRepository({ db, collection, queries });
    this.controllers = (field)
      ? new NestedControllers(this.repository, { storeContext, eventStore, catalogue })
      : new Controllers(this.repository, { storeContext, eventStore, catalogue });
  }
}

export {
  Resource,
  BaseMongoRepository,
  NestedMongoRepository,
  Catalogue,
};
