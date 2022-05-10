import { Resource } from '../../../libs/monster';
import { db } from '../../../services/mongo.service';
import { eventStore, internalCatalog as catalog } from '../../commons/monster';
import queries from './weblinks.queries';

const weblinks = new Resource(
  { db, collection: 'persons', field: 'weblinks', queries },
  { eventStore, catalog },
);

export default weblinks;
