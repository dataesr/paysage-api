import db from '../../../services/mongo.service';
import { Resource } from '../../../libs/monster';
import { eventStore, objectCatalogue as catalogue } from '../../commons/monster';
import queries from './root.queries';

const categories = new Resource(
  { db, collection: 'categories', queries },
  { eventStore, catalogue },
);

export default categories;