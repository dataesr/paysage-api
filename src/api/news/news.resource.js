import db from '../../services/mongo.service';
import { Resource } from '../../libs/monster';
import { eventStore, objectCatalogue as catalogue } from '../commons/monster';
import queries from './news.queries';

const news = new Resource(
  { db, collection: 'news', queries },
  { eventStore, catalogue },
);

export default news;
