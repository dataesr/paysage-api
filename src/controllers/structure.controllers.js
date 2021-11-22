import identifiers from '../models/structure/identifier.models';
import structure from '../models/structure/structure.models';

export default {
  getAllStructures: async (req, res) => {
    const s = await structure.findAll();
    return res.status(200).send({ message: 'Hello Structures' });
  },

  addStructure: async (req, res) => {
    const s = await structure.insertOne(req);
    return res.status(200).send({ message: 'Structure Added', s });
  },

  getAllIdentifiers: async (req, res) => {
    const i = await identifiers.findAll();
    return res.status(200).send({ message: 'Hello Structure Identifiers', i });
  },
};
