import { Resource } from '../../../libs/monster';
import db from '../../../services/mongo.service';
import { eventStore, internalCatalogue as catalogue } from '../../commons/monster';
import queries from './identifiers.queries';

const identifiers = new Resource(
  { db, collection: 'structures', field: 'identifiers', queries },
  { eventStore, catalogue },
);

export default identifiers;
