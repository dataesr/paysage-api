import config from '../../../config';
import codesRepository from '../repositories/codes.repository';

const { codesExpiresIn } = config;

function generateCode() {
  const code = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
  const expireAt = new Date(new Date().setSeconds(new Date().getSeconds() + codesExpiresIn));
  return { code, expireAt };
}

export default {
  createUserActivationCode: async (userId) => {
    const { code, expireAt } = generateCode();
    await codesRepository.setCode({ userId, type: 'activation', expireAt, code });
    return { code, expireAt };
  },

  createUserPasswordRenewalCode: async (userId) => {
    const { code, expireAt } = generateCode();
    await codesRepository.setCode({ userId, type: 'password-renewal', expireAt, code });
    return { code, expireAt };
  },

  verifyUserPasswordRenewalCode: async (userId, code) => {
    if (await codesRepository.findCode({ userId, type: 'password-renewal', code })) {
      return true;
    }
    return false;
  },

  verifyUserActivationCode: async (userId, code) => {
    if (await codesRepository.findCode({ userId, type: 'activation', code })) {
      return true;
    }
    return false;
  },

  deleteUserPasswordRenewalCode: async (userId, type, code) => {
    await codesRepository.deleteCode({ userId, type, code });
    return null;
  },
};
