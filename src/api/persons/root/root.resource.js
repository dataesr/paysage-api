import db from '../../../services/mongo.service';
import { Resource } from '../../../libs/monster';
import { eventStore, objectCatalogue as catalogue } from '../../commons/monster';
import queries from './root.queries';

const persons = new Resource(
  { db, collection: 'persons', queries },
  { eventStore, catalogue },
);

export default persons;
