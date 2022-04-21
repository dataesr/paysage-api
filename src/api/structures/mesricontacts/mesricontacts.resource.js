import { Resource } from '../../../libs/monster';
import db from '../../../services/mongo.service';
import { eventStore, internalCatalogue as catalogue } from '../../commons/monster';
import queries from './mesricontacts.queries';

const mesricontacts = new Resource(
  { db, collection: 'structures', field: 'mesricontacts', queries },
  { eventStore, catalogue },
);

export default mesricontacts;
