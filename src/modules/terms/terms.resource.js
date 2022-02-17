import db from '../../services/mongo.service';
import { Resource } from '../../libs/monster';
import { eventStore, objectCatalogue as catalogue } from '../commons/monster';
import queries from './terms.queries';

const terms = new Resource(
  { db, collection: 'terms', queries },
  { eventStore, catalogue },
);

export default terms;
