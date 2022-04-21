import { Resource } from '../../../libs/monster';
import db from '../../../services/mongo.service';
import { eventStore, internalCatalogue as catalogue } from '../../commons/monster';
import queries from './leaders.queries';

const leaders = new Resource(
  { db, collection: 'structures', field: 'leaders', queries },
  { eventStore, catalogue },
);

export default leaders;
