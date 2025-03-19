export const sendMattermostNotification = async (job) => {
  const { message } = job.attrs.data;
  const MATTERMOST_WEBHOOK_URL = process.env.MM_WEBHOOK_URL;
  const MATTERMOST_CHANNEL = process.env.MM_CHANNEL;
  const { BOT_ICON_URL } = process.env;

  if (!MATTERMOST_WEBHOOK_URL || !MATTERMOST_CHANNEL) return;

  try {
    await fetch(MATTERMOST_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        channel: MATTERMOST_CHANNEL,
        text: message,
        username: 'Bot-Anic le robot paysagiste',
        icon_url: BOT_ICON_URL,
      }),
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error sending Mattermost notification', error);
  }
};
