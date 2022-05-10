import { Resource } from '../../../libs/monster';
import { db } from '../../../services/mongo.service';
import { eventStore, internalCatalog as catalog } from '../../commons/monster';
import queries from './categories.queries';

const categories = new Resource(
  { db, collection: 'structures', field: 'categories', queries },
  { eventStore, catalog },
);

export default categories;
