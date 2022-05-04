import { Resource } from '../../../libs/monster';
import db from '../../../services/mongo.service';
import { eventStore, internalCatalog as catalog } from '../../commons/monster';
import queries from './socialmedias.queries';

const socialmedias = new Resource(
  { db, collection: 'persons', field: 'socialmedias', queries },
  { eventStore, catalog },
);

export default socialmedias;
