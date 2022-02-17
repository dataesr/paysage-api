import db from '../../services/mongo.service';
import { Resource } from '../../libs/monster';
import { eventStore, objectCatalogue as catalogue } from '../commons/monster';
import queries from './od.queries';

const officialDocuments = new Resource(
  { db, collection: 'official-documents', queries },
  { eventStore, catalogue },
);

export default officialDocuments;
