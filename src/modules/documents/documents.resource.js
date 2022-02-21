import db from '../../services/mongo.service';
import { Resource } from '../../libs/monster';
import { eventStore, objectCatalogue as catalogue } from '../commons/monster';
import queries from './documents.queries';

const documents = new Resource(
  { db, collection: 'documents', queries },
  { eventStore, catalogue },
);

export default documents;
