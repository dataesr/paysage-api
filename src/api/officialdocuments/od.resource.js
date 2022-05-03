import db from '../../services/mongo.service';
import { Resource } from '../../libs/monster';
import { eventStore, objectCatalog as catalog } from '../commons/monster';
import queries from './od.queries';

const officialDocuments = new Resource(
  { db, collection: 'official-documents', queries },
  { eventStore, catalog },
);

export default officialDocuments;
