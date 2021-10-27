import userService from '../services/users';

export default {
  signup: async (req, res) => {
    const data = req.body;
    const tokens = await userService.createUser(data, req.userAgent);
    res.status(201).json(tokens);
  },
};
