import SibApiV3Sdk from 'sib-api-v3-sdk';
import logger from './logger.service';

const defaultClient = SibApiV3Sdk.ApiClient.instance;

const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.SEND_IN_BLUE_APIKEY;
const sendInBlue = new SibApiV3Sdk.TransactionalEmailsApi();
let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

export default {
  sendEmail: (datas) => new Promise((resolve) => {
    sendSmtpEmail = datas;
    sendInBlue.sendTransacEmail(sendSmtpEmail).then((data) => {
      resolve(data.messageId);
    }, (error) => {
      logger.error(error);
      resolve('failure');
    });
  }),
};
