import NestedControllers from './controllers/nested.controllers';
import Controllers from './controllers/base.controllers';
import NestedRepository from './repositories/nested.repository';
import Repository from './repositories/base.repository';
import Catalogue from './repositories/catalogue.repository';

class Resource {
  constructor(
    { db, collection, field = null, queries = {} },
    { storeContext = true, eventStore = null, catalogue = null } = {},
  ) {
    this.calalogue = catalogue;
    this.eventStore = eventStore;
    this.repository = (field)
      ? new NestedRepository({ db, collection, field, queries })
      : new Repository({ db, collection, queries });
    this.controllers = (field)
      ? new NestedControllers(this.repository, { storeContext, eventStore, catalogue })
      : new Controllers(this.repository, { storeContext, eventStore, catalogue });
  }
}

export {
  Resource,
  Repository,
  NestedRepository,
  Catalogue,
};
