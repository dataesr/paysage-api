import mailer from '../../services/mailer.service';

export const sendAuthenticationEmail = (job) => mailer.sendEmail({
  to: [{ email: job.attrs?.data?.user?.email }],
  templateId: 167,
  params: {
    PRENOM: job.attrs?.data?.user?.firstName,
    NOM: job.attrs?.data?.user?.lastName,
    EMAIL: job.attrs?.data?.user?.email,
    CODE: job.attrs?.data?.otp,
    IPVALIDATION: job.attrs?.data?.ip,
  },
});

export const sendWelcomeEmail = (job) => mailer.sendEmail({
  to: [{ email: job.attrs?.data?.user?.email }],
  templateId: 199,
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
