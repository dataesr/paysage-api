import { Resource } from '../../../libs/monster';
import db from '../../../services/mongo.service';
import { eventStore, internalCatalogue as catalogue } from '../../commons/monster';
import queries from './names.queries';

const names = new Resource(
  { db, collection: 'structures', field: 'names', queries },
  { eventStore, catalogue },
);

export default names;
