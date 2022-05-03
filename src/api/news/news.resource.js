import db from '../../services/mongo.service';
import { Resource } from '../../libs/monster';
import { eventStore, objectCatalog as catalog } from '../commons/monster';
import queries from './news.queries';

const news = new Resource(
  { db, collection: 'news', queries },
  { eventStore, catalog },
);

export default news;
