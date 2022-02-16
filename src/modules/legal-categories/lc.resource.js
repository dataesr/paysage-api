import db from '../../services/mongo.service';
import { Resource } from '../../libs/monster';
import { eventStore, objectCatalogue as catalogue } from '../commons/monster';
import queries from './lc.queries';

const lc = new Resource(
  { db, collection: 'legal-categories', queries },
  { eventStore, catalogue },
);

export default lc;
