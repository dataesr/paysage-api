import structuresRepo from '../structures.repo';
import eventsRepo from '../../commons/repositories/events.repo';

export default {
  create: async (req, res) => {
    const { structureId } = req.params;
    const name = await namesService.create(structureId, req.body);
    res.status(201).json(name);
  },

  read: async (req, res) => {
    const { structureId, nameId } = req.params;
    const name = await namesService.read(structureId, parseInt(nameId, 10));
    res.status(200).json(name);
  },

  update: async (req, res) => {
    const { structureId, nameId } = req.params;
    const name = await namesService.update(structureId, parseInt(nameId, 10), req.body);
    res.status(200).json(name);
  },

  delete: async (req, res) => {
    const { structureId, nameId } = req.params;
    await namesService.delete(structureId, parseInt(nameId, 10));
    res.status(204).end();
  },

  list: async (req, res) => {
    const { structureId } = req.params;
    const { filters, ...options } = req.query;
    const { data, totalCount } = await namesService.list(structureId, filters, options);
    res.status(200).json({ data, totalCount });
  },

};
