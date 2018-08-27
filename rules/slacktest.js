/* global peril:false */
import { IncomingWebhook } from '@slack/client';

console.log('slacktest was loaded');

export default async () => {
  console.log('slacktest is running');
  if (!peril.env.SLACK_WEBHOOK_URL) {
    throw new Error('No Slack webhook URL is set!');
  }

  const webhook = new IncomingWebhook(peril.env.SLACK_WEBHOOK_URL);
  await webhook.send({
    unfurl_links: false,
    text:
      'Peril _appears_ to be working properly. This should fire every minute.',
    attachments: [
      {
        color: 'good',
        title: 'Peril => Slack Testing',
        title_link:
          'https://github.com/gatsbyjs/peril-gatsbyjs/blob/master/rules/slacktest.ts',
        author_name: 'gatsbot',
        author_link: 'https://github.com/gatsbyjs/peril-gatsbyjs',
        fallback: 'Peril => Slack Testing'
      }
    ]
  });
};
