import emitter from '../../commons/services/emitter.service';
import identifiersRepository from '../repositories/identifiers.repo';
import { NotFoundError } from '../../commons/errors';

export default {
  list: async (rid, filters, options) => identifiersRepository.find(rid, filters, options),

  delete: async (rid, id) => {
    const { ok } = await identifiersRepository.deleteById(rid, id);
    if (ok) {
      emitter.emit('structures:identifierDeleted', { structureId: rid, identifierId: id });
      return { id };
    }
    throw new NotFoundError();
  },

  read: async (rid, id, options) => {
    const structure = await identifiersRepository.findById(rid, id, options);
    if (!structure) throw new NotFoundError();
    return structure;
  },

  update: async (rid, id, data) => {
    const { ok } = await identifiersRepository.updateById(rid, id, data);
    if (ok) {
      const identifier = identifiersRepository.findById(rid, id);
      emitter.emit('structures:identifierUpdated', { identifier });
      return identifier;
    }
    throw new NotFoundError();
  },

  create: async (rid, data) => {
    const insertedId = await identifiersRepository.insert(rid, data);
    const doc = await identifiersRepository.findById(rid, insertedId);
    emitter.emit('structures:identifierCreated', { identifier: doc });
    return doc;
  },
};
