import db from '../../services/mongo.service';
import { Resource } from '../../libs/monster';
import { eventStore, objectCatalog as catalog } from '../commons/monster';
import queries from './documents.queries';

const documents = new Resource(
  { db, collection: 'documents', queries },
  { eventStore, catalog },
);

export default documents;
