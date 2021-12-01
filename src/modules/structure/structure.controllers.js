import structureServices from './structure.services';

export default {
  getAll: async (req, res) => {
    const structures = await structureServices.find();
    res.status(200).send({ structures });
  },

  deleteAll: async (req, res) => {
    const structures = await structureServices.delete();
    res.status(200).send({ structures });
  },

  addOne: async (req, res) => {
    const structure = await structureServices.save(req.body);
    res.status(201).send({ structure });
  },

  getById: async (req, res) => {
    const structure = await structureServices.findOne(req.params.id);
    res.status(200).send({ structure });
  },

  update: async (req, res) => {
    const structure = await structureServices.update(req.params.id, req.body);
    res.status(200).send({ structure });
  },

  updateIdentifiers: async (req, res) => {
    const structure = await structureServices.findOne(req.params.id);
    const newStructure = await structureServices.update(req.params.id,
      { identifiers: [...structure.identifiers, ...req.body.identifiers] });
    res.status(200).send({ structure: newStructure });
  },

  getIdentifiers: async (req, res) => {
    const identifiers = await structureServices.findOne(req.params.id, { identifiers: 1 });
    res.status(200).send({ identifiers });
  },

};
