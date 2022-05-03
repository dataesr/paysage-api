import db from '../../services/mongo.service';
import { Resource } from '../../libs/monster';
import { eventStore, objectCatalog as catalog } from '../commons/monster';
import queries from './terms.queries';

const terms = new Resource(
  { db, collection: 'terms', queries },
  { eventStore, catalog },
);

export default terms;
