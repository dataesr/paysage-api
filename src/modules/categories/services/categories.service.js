import emitter from '../../commons/services/emitter.service';
import categoriesRepository from '../repositories/categories.repo';
import { NotFoundError } from '../../commons/errors';

export default {
  list: async (filters, options) => categoriesRepository.find(filters, options),

  delete: async (id) => {
    const { ok } = await categoriesRepository.deleteById(id);
    if (ok) {
      emitter.emit('categories:categoryDeleted', { categoryId: id });
      return { id };
    }
    throw new NotFoundError();
  },

  read: async (id, options) => {
    const category = await categoriesRepository.findById(id, options);
    if (!category) throw new NotFoundError();
    return category;
  },

  update: async (id, data) => {
    const { ok } = await categoriesRepository.updateById(id, data);
    if (ok) {
      const category = categoriesRepository.findById(id);
      emitter.emit('categories:categoryUpdated', { category });
      return category;
    }
    throw new NotFoundError();
  },

  create: async (data) => {
    const insertedId = await categoriesRepository.insert(data);
    const category = await categoriesRepository.findById(insertedId);
    emitter.emit('categories:categoryCreated', { category });
    return category;
  },
};
