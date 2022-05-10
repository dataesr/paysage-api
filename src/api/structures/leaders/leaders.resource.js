import { Resource } from '../../../libs/monster';
import { db } from '../../../services/mongo.service';
import { eventStore, internalCatalog as catalog } from '../../commons/monster';
import queries from './leaders.queries';

const leaders = new Resource(
  { db, collection: 'structures', field: 'leaders', queries },
  { eventStore, catalog },
);

export default leaders;
