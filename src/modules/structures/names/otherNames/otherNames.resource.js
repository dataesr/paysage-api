import { Resource } from '../../../../libs/monster/index';
import db from '../../../../services/mongo.service';
import { eventStore, internalCatalogue as catalogue } from '../../../commons/monster/index';
import queries from './otherNames.queries';

const otherNames = new Resource(
  { db, collection: 'structures', field: 'names', queries },
  { eventStore, catalogue },
);

export default otherNames;
