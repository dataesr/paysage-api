import emitter from '../emitter';
import mailerService from '../services/mailer';
import codeService from '../services/codes';

emitter.addListener(
  'userSignedUp',
  async ({ user }) => codeService.generateActivationCode(user),
);

emitter.addListener(
  'activationCodeCreated',
  async ({ user, activationInfo }) => {
    const mailerResult = await mailerService.sendActivationCode(
      user.email, user.username, activationInfo.code, activationInfo.expireAt,
    );
    return mailerResult;
  },
);

emitter.addListener(
  'passwordRenewalCodeCreated',
  async ({ user, passwordRenewalInfo }) => mailerService.sendPasswordRenewalCode(
    user.email, user.username, passwordRenewalInfo.code, passwordRenewalInfo.expireAt,
  ),
);

export default emitter;
