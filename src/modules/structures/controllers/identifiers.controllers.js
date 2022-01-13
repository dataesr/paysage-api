import structuresRepository from '../structures.repo';

export default {
  create: async (req, res) => {
    const { structureId } = req.params;
    const identifier = await structuresRepository.identifiers.create(structureId, req.body);
    res.status(201).json(identifier);
  },

  read: async (req, res) => {
    const { structureId, identifierId } = req.params;
    const identifier = await structuresRepository.identifiers.read(structureId, parseInt(identifierId, 10));
    res.status(200).json(identifier);
  },

  update: async (req, res) => {
    const { structureId, identifierId } = req.params;
    const identifier = await structuresRepository.identifiers.update(structureId, parseInt(identifierId, 10), req.body);
    res.status(200).json(identifier);
  },

  delete: async (req, res) => {
    const { structureId, identifierId } = req.params;
    await structuresRepository.identifiers.delete(structureId, parseInt(identifierId, 10));
    res.status(204).end();
  },

  list: async (req, res) => {
    const { structureId } = req.params;
    const { filters, ...options } = req.query;
    const { data, totalCount } = await structuresRepository.identifiers.list(structureId, filters, options);
    res.status(200).json({ data, totalCount });
  },

};
