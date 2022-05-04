import db from '../../services/mongo.service';
import { Resource } from '../../libs/monster';
import { eventStore, objectCatalog as catalog } from '../commons/monster';
import queries from './legalcategories.queries';

const legalCategories = new Resource(
  { db, collection: 'legal-categories', queries },
  { eventStore, catalog },
);

export default legalCategories;
