import Structure from './structure.models';
// import db from '../../database';

export default {

  find: () => Structure.find(),

  findOne: (id) => Structure.findById(id),

  updateOne: (id, query) => Structure.updateOne({ _id: id }, { $set: { ...query } }),

  save: async (structureData) => {
    const structure = new Structure({ ...structureData });
    await structure.save();
    return structure;
  },
};
