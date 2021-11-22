import userService from '../services/users';
import { NotFoundError } from '../utils/errors';

export default {
  getUser: async (req, res) => {
    const { id } = req.params;
    const user = await userService.getUser(id);
    if (!user) throw new NotFoundError();
    res.status(200).json({ email: user.email, username: user.username });
  },
};
