import { db } from '../../../services/mongo.service';
import { Resource } from '../../../libs/monster';
import { eventStore, internalCatalog as catalog } from '../../commons/monster';
import queries from './logos.queries';

const documents = new Resource(
  { db, collection: 'structures', field: 'logos', queries },
  { eventStore, catalog },
);

export default documents;
