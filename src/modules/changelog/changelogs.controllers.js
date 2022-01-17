import eventsRepo from '../commons/repositories/events.repo';

export default {
  list: async (req, res) => {
    const { filters, ...options } = req.query;
    const { data, totalCount } = await eventsRepo.find(filters, options);
    res.status(200).json({ data, totalCount });
  },
};
