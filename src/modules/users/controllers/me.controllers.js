import usersService from '../services/users.service';

export default {
  getMe: async (req, res) => {
    const { id } = req.currentUser;
    const user = await usersService.readById(id);
    res.status(200).json(user);
  },

  deleteMe: async (req, res) => {
    const { id } = req.currentUser;
    await usersService.deleteById(id);
    res.status(204).end();
  },

  updateMe: async (req, res) => {
    const { id } = req.currentUser;
    const data = req.body;
    const updatedUser = await usersService.updateById(id, data);
    res.status(200).json(updatedUser);
  },

  setPassword: async (req, res) => {
    const { newPassword } = req.body;
    const { id } = req.currentUser;
    const user = usersService.changeUserPasswordById(id, newPassword);
    res.status(200).json(user);
  },

  // setAvatar: async (req, res) => {
  //   const file = req.files.length && req.files[0];
  //   const { username } = req.currentUser;
  //   file.originalname = `avatars/${username}.png`;
  //   await req.storage.put('public', file);
  //   await req.db.Users.updateOne({ username }, { avatar: `/${file.originalname}` }, username);
  //   const user = await req.db.Users.findOne({ username });
  //   res.status(200).json(user);
  // },

  // unsetAvatar: async (req, res) => {
  //   const { username } = req.currentUser;
  //   const filename = `avatars/${username}.png`;
  //   await req.storage.remove(filename);
  //   await req.db.Users.updateOne({ username }, { avatar: null }, username);
  //   const user = await req.db.Users.findOne({ username });
  //   res.status(200).json(user);
  // },
};
