import structuresRepository from '../structures.repo';
import { NotFoundError } from '../../commons/errors';

// emitter.on('structures:identifierCreated', ({ structureId }) => {
//   structuresRepository.incrementFieldById(structureId, 'identifiersCount', 1);
// });

export default {
  list: async (filters, options) => structuresRepository.find(filters, options),

  delete: async (id) => {
    const { ok } = await structuresRepository.deleteById(id);
    if (ok) {
      return { id };
    }
    throw new NotFoundError();
  },

  read: async (id, options) => {
    const structure = await structuresRepository.findById(id, options);
    if (!structure) throw new NotFoundError();
    return structure;
  },

  update: async (id, data) => {
    const { ok } = await structuresRepository.updateById(id, data);
    if (ok) {
      const structure = structuresRepository.findById(id);
      return structure;
    }
    throw new NotFoundError();
  },

  create: async (data) => {
    const insertedId = await structuresRepository.insert(data);
    const structure = await structuresRepository.findById(insertedId);
    return structure;
  },
};
