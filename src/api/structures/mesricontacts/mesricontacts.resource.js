import { Resource } from '../../../libs/monster';
import db from '../../../services/mongo.service';
import { eventStore, internalCatalog as catalog } from '../../commons/monster';
import queries from './mesricontacts.queries';

const mesricontacts = new Resource(
  { db, collection: 'structures', field: 'mesricontacts', queries },
  { eventStore, catalog },
);

export default mesricontacts;
