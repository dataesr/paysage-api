import db from '../../services/mongo.service';
import { Resource } from '../../libs/monster';
import { eventStore, objectCatalog as catalog } from '../commons/monster';
import queries from './prices.queries';

const prices = new Resource(
  { db, collection: 'prices', queries },
  { eventStore, catalog },
);

export default prices;
