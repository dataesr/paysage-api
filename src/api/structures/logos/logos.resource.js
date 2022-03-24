import db from '../../../services/mongo.service';
import { Resource } from '../../../libs/monster';
import { eventStore, internalCatalogue as catalogue } from '../../commons/monster';
import queries from './logos.queries';

const documents = new Resource(
  { db, collection: 'structures', field: 'logos', queries },
  { eventStore, catalogue },
);

export default documents;
