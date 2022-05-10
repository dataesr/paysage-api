import { db } from '../../../services/mongo.service';
import { Resource } from '../../../libs/monster';
import { eventStore, objectCatalog as catalog } from '../../commons/monster';
import queries from './root.queries';

const persons = new Resource(
  { db, collection: 'persons', queries },
  { eventStore, catalog },
);

export default persons;
