import { danger, schedule, markdown } from 'danger';

// Make schedule testable with Jest. Inspiration: https://git.io/fNh6i
const testableSchedule = (reason: string, action: any) =>
  typeof jest !== 'undefined' ? action : schedule(action);

console.log('emptybody.ts was loaded');

export const emptybody = testableSchedule(
  'Request more information if issue body is empty',
  async () => {
    console.log('emptybody.ts was executed');
    const gh = danger.github as any;
    const issue = gh.issue;
    const repo = gh.repository;
    const body = issue.body.trim();
    const username = issue.user.login;

    if (body.length == 0) {
      const comment = `
  @${username} We noticed that the body of this issue is blank.

  Please fill in this field with more information to help the maintainers resolve your issue.
`;
      markdown(comment);
    }
  }
);
