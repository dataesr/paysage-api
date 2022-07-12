import { usersRepository, tokenRepository, codeRepository } from '../commons/repositories';
import userQuery from '../commons/queries/users.token.query';

const agenda = null;

export default {
  signup: async (req, res) => {
    const { body, context, userAgent } = req.body;
    const id = await usersRepository.register({ ...body, ...context });
    const user = await usersRepository.get(id, { useQuery: userQuery });
    const tokens = await tokenRepository.create({ ...user, userAgent });
    agenda.now('send activation code email', { user });
    res.status(201).json(tokens);
  },

  signin: async (req, res) => {
    const { body, userAgent } = req;
    const user = await usersRepository.getByEmail(body.email, { useQuery: userQuery });
    const tokens = await tokenRepository.create(user, userAgent);
    agenda.now('send welcome email', { user });
    res.status(200).json(tokens);
  },

  signout: async (req, res) => {
    await tokens.remove({});
    res.status(200).json({ message: 'Déconnecté' });
  },

  activateAccount: async (req, res) => {
    const { id } = req.currentUser;
    await usersRepository.patch(id, { active: true });
    res.status(200).json({ message: 'Compte activé' });
  },

  refreshAccessToken: async (req, res) => {
    const tokens = await tokensService.generateAuthTokens(req.currentUser, req.userAgent);
    res.status(200).json(tokens);
  },

  renewActivationCode: async (req, res) => {
    const { currentUser: user } = req;
    agenda.now('send activation code email', { user });
    res.status(200).json({
      message: `Un nouveau code d'activation va être envoyé à ${user.email}`,
    });
  },

  sendPasswordRenewalCode: async (req, res) => {
    const { currentUser: user } = req.currentUser;
    agenda.now('send password renewal code email', { user });
    res.status(200).json({ message: `Un code de changement de mot de passe va être envoyé à ${user.email}` });
  },

  resetPassword: async (req, res) => {
    const { password } = req.body;
    await usersRepository.changeUserPasswordById(req.currentUser.id, password);
    res.status(200).json({ message: 'Mot de passe modifié' });
  },

  verifyUserCredential: async (req, res, next) => {
    const { account, password } = req.body;
    if (!await usersService.validateUserCredentials(account, password)) {
      throw new BadRequestError('Mauvaise combinaison utilisateur/mot de passe');
    }
    next();
  },
  verifyActivationCode: async (req, res, next) => {
    const { activationCode } = req.body;
    const userId = req.currentUser.id;
    if (!await codesService.verifyUserActivationCode(userId, activationCode)) {
      throw new BadRequestError('Code invalide');
    }
    next();
  },

  verifyPasswordRenewalCode: async (req, res, next) => {
    const { code } = req.body;
    const userId = req.currentUser.id;
    if (!await codesService.verifyUserPasswordRenewalCode(userId, code)) {
      throw new BadRequestError('Code invalide');
    }
    next();
  },

  verifyRefreshToken: async (req, res, next) => {
    req.currentUser = await tokensService.decodeUserRefreshToken(req.body.refreshToken, req.UserAgent);
    if (!req.currentUser.id) {
      throw new BadRequestError('Token invalide');
    }
    next();
  },

  verifyUserExists: async (req, res, next) => {
    const { account } = req.body;
    const user = await usersRepository.getUserByEmail(account);
    if (!user) throw new NotFoundError('Le compte n\'existe pas');
    req.currentUser = user;
    next();
  },
};
