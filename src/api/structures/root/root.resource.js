import { Resource } from '../../../libs/monster';
import db from '../../../services/mongo.service';
import { eventStore, objectCatalogue as catalogue } from '../../commons/monster';
import queries from './root.queries';

const root = new Resource(
  { db, collection: 'structures', queries },
  { eventStore, catalogue },
);

export default root;
