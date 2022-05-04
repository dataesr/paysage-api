import db from '../../../services/mongo.service';
import { Resource } from '../../../libs/monster';
import { eventStore, objectCatalog as catalog } from '../../commons/monster';
import queries from './root.queries';

const categories = new Resource(
  { db, collection: 'categories', queries },
  { eventStore, catalog },
);

export default categories;
