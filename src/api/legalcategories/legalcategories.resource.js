import db from '../../services/mongo.service';
import { Resource } from '../../libs/monster';
import { eventStore, objectCatalogue as catalogue } from '../commons/monster';
import queries from './legalcategories.queries';

const legalCategories = new Resource(
  { db, collection: 'legal-categories', queries },
  { eventStore, catalogue },
);

export default legalCategories;
