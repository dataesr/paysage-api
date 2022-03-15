import db from '../../services/mongo.service';
import { Resource } from '../../libs/monster';
import { eventStore, objectCatalogue as catalogue } from '../commons/monster';
import queries from './prices.queries';

const prices = new Resource(
  { db, collection: 'prices', queries },
  { eventStore, catalogue },
);

export default prices;
