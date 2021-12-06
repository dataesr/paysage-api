import structureServices from '../services/structures.service';

export default {
  create: async (req, res) => {
    const structure = await structureServices.create(req.body);
    res.status(201).json(structure);
  },

  read: async (req, res) => {
    const structure = await structureServices.read(req.params.structureId);
    res.status(200).json(structure);
  },

  update: async (req, res) => {
    const structure = await structureServices.update(req.params.structureId, req.body);
    res.status(200).json(structure);
  },

  delete: async (req, res) => {
    const { structureId } = req.params;
    await structureServices.delete(structureId);
    res.status(204).end();
  },

  list: async (req, res) => {
    const { filters, ...options } = req.query;
    const { data, totalCount } = await structureServices.list(filters, options);
    res.status(200).json({ data, totalCount });
  },

};
