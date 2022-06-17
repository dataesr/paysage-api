import BaseMongoCatalog from './libs/base.mongo.catalog';
import { db } from '../../services/mongo.service';

const catalog = new BaseMongoCatalog({ db, collection: '_catalog' });

export default catalog;
