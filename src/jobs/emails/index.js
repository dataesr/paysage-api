import mailer from '../../services/mailer.service';
import logger from '../../services/logger.service';

export const sendAuthenticationEmail = async (job) => {
  logger.info(job.attrs?.data);
  return mailer.sendEmail({
    to: [{ email: job.attrs?.data?.user?.email }],
    templateId: 203,
    params: {
      PRENOM: job.attrs?.data?.user?.firstName,
      NOM: job.attrs?.data?.user?.lastName,
      EMAIL: job.attrs?.data?.user?.email,
      CODE: job.attrs?.data?.otp,
      IPVALIDATION: job.attrs?.data?.ip,
    },
  });
};

export const sendWelcomeEmail = (job) => mailer.sendEmail({
  to: [{ email: job.attrs?.data?.user?.email }],
  templateId: 199,
  params: {
    PRENOM: job.attrs?.data?.user?.firstName,
    NOM: job.attrs?.data?.user?.lastName,
  },
});

export const sendAccountConfirmedEmail = (job) => mailer.sendEmail({
  to: [{ email: job.attrs?.data?.user?.email }],
  templateId: 202,
  params: {
    PRENOM: job.attrs?.data?.user?.firstName,
    NOM: job.attrs?.data?.user?.lastName,
  },
});

export const sendPasswordRecoveryEmail = (job) => mailer.sendEmail({
  to: [{ email: job.attrs?.data?.user?.email }],
  templateId: 200,
  params: {
    PRENOM: job.attrs?.data?.user?.firstName,
    NOM: job.attrs?.data?.user?.lastName,
    EMAIL: job.attrs?.data?.user?.email,
    CODE: job.attrs?.data?.otp,
    IPVALIDATION: job.attrs?.data?.ip,
  },
});

export const sendContactEmail = (job) => mailer.sendEmail({
  to: [{
    email: process.env.SEND_IN_BLUE_CONTACT,
    name: 'Paysage',
  }],
  replyTo: {
    email: job?.attrs?.data?.email,
    name: job?.attrs?.data?.name,
  },
  templateId: 205,
  params: {
    EMAIL: job?.attrs?.data?.email,
    FONCTION: job?.attrs?.data?.fonction,
    MESSAGE: job?.attrs?.data?.message,
    NOM: job?.attrs?.data?.name,
    ORGANISATION: job?.attrs?.data?.organization,
  },
});
