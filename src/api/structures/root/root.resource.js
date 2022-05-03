import { Resource } from '../../../libs/monster';
import db from '../../../services/mongo.service';
import { eventStore, objectCatalog as catalog } from '../../commons/monster';
import queries from './root.queries';

const root = new Resource(
  { db, collection: 'structures', queries },
  { eventStore, catalog },
);

export default root;
