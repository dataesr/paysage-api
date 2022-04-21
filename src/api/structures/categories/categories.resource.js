import { Resource } from '../../../libs/monster';
import db from '../../../services/mongo.service';
import { eventStore, internalCatalogue as catalogue } from '../../commons/monster';
import queries from './categories.queries';

const categories = new Resource(
  { db, collection: 'structures', field: 'categories', queries },
  { eventStore, catalogue },
);

export default categories;
