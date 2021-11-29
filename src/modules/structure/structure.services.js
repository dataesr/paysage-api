import Structure from './structure.models';

export default {

  find: () => Structure.find({}),

  delete: () => Structure.deleteMany({}),

  findOne: (id, params) => Structure.findById(id, params),

  update: (id, query) => Structure.findByIdAndUpdate(id, query),

  save: async (structureData) => {
    const structure = new Structure({ ...structureData });
    await structure.save();
    return structure;
  },
};
