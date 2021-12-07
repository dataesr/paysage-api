import emitter from '../../commons/services/emitter.service';
import namesRepository from '../repositories/names.repo';
import { NotFoundError } from '../../commons/errors';

export default {
  list: async (rid, filters, options) => namesRepository.find(rid, filters, options),

  delete: async (rid, id) => {
    const { ok } = await namesRepository.deleteById(rid, id);
    if (ok) {
      emitter.emit('structures:nameDeleted', { structureId: rid, nameId: id });
      return { id };
    }
    throw new NotFoundError();
  },

  read: async (rid, id, options) => {
    const structure = await namesRepository.findById(rid, id, options);
    if (!structure) throw new NotFoundError();
    return structure;
  },

  update: async (rid, id, data) => {
    const { ok } = await namesRepository.updateById(rid, id, data);
    if (ok) {
      const name = namesRepository.findById(rid, id);
      emitter.emit('structures:nameUpdated', { name });
      return name;
    }
    throw new NotFoundError();
  },

  create: async (rid, data) => {
    const insertedId = await namesRepository.insert(rid, data);
    const doc = await namesRepository.findById(rid, insertedId);
    emitter.emit('structures:nameCreated', { name: doc });
    return doc;
  },
};
