import { Resource } from '../../../libs/monster';
import { db } from '../../../services/mongo.service';
import { eventStore, objectCatalog as catalog } from '../../commons/monster';
import queries from './status.queries';

const status = new Resource(
  { db, collection: 'structures', queries },
  { eventStore, catalog },
);

export default status;
