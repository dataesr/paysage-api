import authService from '../services/auth';

export default {
  signup: async (req, res) => {
    const data = req.body;
    const tokens = await authService.signup(data, req.userAgent);
    res.status(201).json(tokens);
  },
};
