import usersService from '../users/services/users.service';
import tokensService from '../users/services/tokens.service';
import codesService from '../users/services/codes.service';

export default {
  signup: async (req, res) => {
    const payload = req.body;
    await usersService.create(payload);
    const user = await usersService.getUserByAccount(payload.username);
    const tokens = await tokensService.generateAuthTokens(user, req.userAgent);
    await codesService.createUserActivationCode(user.id);
    // add send email event.
    res.status(201).json(tokens);
  },

  signin: async (req, res) => {
    const user = await usersService.getUserByAccount(req.body.account);
    const tokens = await tokensService.generateAuthTokens(user, req.userAgent);
    res.status(200).json(tokens);
  },

  signout: async (req, res) => {
    await tokensService.deleteAuthToken(req.currentUser.id, req.userAgent);
    res.status(200).json({ message: 'Déconnecté' });
  },

  activateAccount: async (req, res) => {
    await usersService.activateAccount(req.currentUser.id);
    res.status(200).json({ message: 'Compte activé' });
  },

  refreshAccessToken: async (req, res) => {
    const tokens = await tokensService.generateAuthTokens(req.currentUser, req.userAgent);
    res.status(200).json(tokens);
  },

  renewActivationCode: async (req, res) => {
    await codesService.createUserActivationCode(req.currentUser.id);
    res.status(200).json({ message: `Un nouveau code d'activation va être envoyé à ${req.currentUser.email}` });
  },

  sendPasswordRenewalCode: async (req, res) => {
    const { email } = req.body;
    await codesService.createUserPasswordRenewalCode(req.currentUser.id);
    res.status(200).json({ message: `Un code de changement de mot de passe va être envoyé à ${email}` });
  },

  resetPassword: async (req, res) => {
    const { password } = req.body;
    await usersService.changeUserPasswordById(req.currentUser.id, password);
    res.status(200).json({ message: 'Mot de passe modifié' });
  },
};
