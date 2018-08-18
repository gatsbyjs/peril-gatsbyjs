import { danger, schedule } from 'danger';

// Make schedule testable with Jest. Inspiration: https://git.io/fNh6i
const testableSchedule = (reason: string, action: any) =>
  typeof jest !== 'undefined' ? action : schedule(action);

let count = 0;

export const emptybody = testableSchedule(
  'Request more information if issue body is empty',
  async () => {
    const gh = danger.github as any;
    const issue = gh.issue;
    const repo = gh.repository;
    const body = issue.body.trim();
    const username = issue.user.login;

    console.log(`Empty body ran ${count++} times.`);
    if (count > 1) {
      // Only post once!
      return;
    }

    const comment = `
@${username} We noticed that the body of this issue is blank.

Please fill in this field with more information to help the maintainers resolve your issue.
    `;

    if (body.length == 0) {
      await danger.github.api.issues.createComment({
        owner: repo.owner.login,
        repo: repo.name,
        number: issue.number,
        body: comment
      });
    }
  }
);
