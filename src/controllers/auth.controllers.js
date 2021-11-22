import authService from '../services/auth';
import tokenService from '../services/tokens';
import { UnauthorizedError } from '../utils/errors';

export default {
  signup: async (req, res) => {
    const payload = req.body;
    const user = await authService.signup(payload);
    const tokens = await tokenService.generateAuthTokens(user, req.userAgent);
    res.status(201).json(tokens);
  },

  signin: async (req, res) => {
    const { password, account } = req.body;
    const user = await authService.signin(account, password);
    const tokens = await tokenService.generateAuthTokens(user, req.userAgent);
    res.status(200).json(tokens);
  },

  signout: async (req, res) => {
    const { id: userId } = req.currentUser;
    if (!userId) throw new UnauthorizedError();
    await tokenService.destroyAuthToken(userId, req.userAgent);
    res.status(200).json({ message: 'Déconnecté' });
  },

  activateAccount: async (req, res) => {
    const { activationCode } = req.body;
    const { id: userId } = req.currentUser;
    if (!userId) throw new UnauthorizedError();
    await authService.activateAccount(userId, activationCode);
    res.status(200).json({ message: 'Compte activé' });
  },

  refreshAccessToken: async (req, res) => {
    const { refreshToken } = req.body;
    const tokens = await tokenService.refreshAccessToken(refreshToken, req.userAgent);
    res.status(200).json(tokens);
  },

  renewActivationCode: async (req, res) => {
    const { email, id: userId } = req.currentUser;
    if (!userId) throw new UnauthorizedError();
    await authService.renewActivationCode(userId);
    res.status(200).json({ message: `Un nouveau code d'activation va être envoyé à ${email}` });
  },

  sendPasswordRenewalCode: async (req, res) => {
    const { account } = req.body;
    await authService.generatePasswordRenewalCode(account);
    res.status(200).json({ message: 'Un code de changement de mot de passe va vous être envoyé' });
  },

  resetPassword: async (req, res) => {
    const { password, account, code } = req.body;
    await authService.resetPassword(account, password, code);
    res.status(200).json({ message: 'Mot de passe changé' });
  },
};
