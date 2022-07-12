import usersService from '../users/services/users.service';
import storageService from '../commons/services/storage.service';

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

  setAvatar: async (req, res) => {
    const file = req.files.length && req.files[0];
    const { id } = req.currentUser;
    const data = req.body;
    file.originalname = `avatars/${id}.png`;
    await storageService.put('public', file);
    const user = await usersService.updateOne(id, { ...data, profileImage: `/${file.originalname}` });
    res.status(200).json(user);
  },

  unsetAvatar: async (req, res) => {
    const { id } = req.currentUser;
    const filename = `avatars/${id}.png`;
    await storageService.remove(filename);
    const user = await usersService.updateOne(id, { avatar: null });
    res.status(200).json(user);
  },
};
