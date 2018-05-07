import { danger, schedule, markdown } from "danger";

// The inspiration for this is https://github.com/artsy/artsy-danger/blob/f019ee1a3abffabad65014afabe07cb9a12274e7/org/all-prs.ts
const isJest = typeof jest !== "undefined";
// Returns the promise itself, for testing.
const _test = (reason: string, promise: Promise<any>) => promise;
// Schedules the promise for execution via Danger.
const _run = (reason: string, promise: Promise<any>) => schedule(promise);
const wrap: any = isJest ? _test : _run;

export const emptybody = wrap(
  "Request more information if issue body is empty",
  async () => {
    const gh = danger.github as any;
    const issue = gh.issue;
    const repo = gh.repository;
    const body = issue.body.trim();
    const username = issue.user.login;

    const comment = `
    ${username} We noticed that the body of this issue is blank.
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
