import { Resource } from '../../../libs/monster';
import { db } from '../../../services/mongo.service';
import { eventStore, internalCatalog as catalog } from '../../commons/monster';
import queries from './identifiers.queries';

const identifiers = new Resource(
  { db, collection: 'persons', field: 'identifiers', queries },
  { eventStore, catalog },
);

export default identifiers;
