import emitter from '../../commons/services/emitter.service';
import officialDocumentsRepository from '../repositories/official-documents.repo';
import { NotFoundError } from '../../commons/errors';

export default {
  list: async (filters, options) => officialDocumentsRepository.find(filters, options),

  delete: async (id) => {
    const { ok } = await officialDocumentsRepository.deleteById(id);
    if (ok) {
      emitter.emit('categories:categoryDeleted', { categoryId: id });
      return { id };
    }
    throw new NotFoundError();
  },

  read: async (id, options) => {
    const category = await officialDocumentsRepository.findById(id, options);
    if (!category) throw new NotFoundError();
    return category;
  },

  update: async (id, data) => {
    const { ok } = await officialDocumentsRepository.updateById(id, data);
    if (ok) {
      const category = officialDocumentsRepository.findById(id);
      emitter.emit('categories:categoryUpdated', { category });
      return category;
    }
    throw new NotFoundError();
  },

  create: async (data) => {
    const insertedId = await officialDocumentsRepository.insert(data);
    const category = await officialDocumentsRepository.findById(insertedId);
    emitter.emit('categories:categoryCreated', { category });
    return category;
  },
};
