import { Resource } from '../../../libs/monster';
import db from '../../../services/mongo.service';
import { eventStore, internalCatalog as catalog } from '../../commons/monster';
import queries from './names.queries';

const names = new Resource(
  { db, collection: 'structures', field: 'names', queries },
  { eventStore, catalog },
);

export default names;
