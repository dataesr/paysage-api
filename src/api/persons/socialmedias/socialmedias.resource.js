import { Resource } from '../../../libs/monster';
import db from '../../../services/mongo.service';
import { eventStore, internalCatalogue as catalogue } from '../../commons/monster';
import queries from './socialmedias.queries';

const socialmedias = new Resource(
  { db, collection: 'persons', field: 'socialmedias', queries },
  { eventStore, catalogue },
);

export default socialmedias;
