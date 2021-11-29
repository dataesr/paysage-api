import Structure from '../models/structure/structure.models';

export default {

  find: () => Structure.find(),

  findOne: (id) => Structure.findOne({ id }),

  updateOne: (id, query) => Structure.updateOne({ _id: id }, { $set: { ...query } }),

  save: async (structureData) => {
    const structure = new Structure({ ...structureData });
    await structure.save();
    return structure;
  },
};
