import { Resource } from '../../../libs/monster';
import db from '../../../services/mongo.service';
import { eventStore, internalCatalogue as catalogue } from '../../commons/monster';
import queries from './weblinks.queries';

const weblinks = new Resource(
  { db, collection: 'categories', field: 'weblinks', queries },
  { eventStore, catalogue },
);

export default weblinks;
