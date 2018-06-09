import { danger, schedule, warn } from 'danger';

// The inspiration for this is https://github.com/artsy/artsy-danger/blob/f019ee1a3abffabad65014afabe07cb9a12274e7/org/all-prs.ts
const isJest = typeof jest !== 'undefined';
// Returns the promise itself, for testing.
const _test = (reason: string, promise: Promise<any>) => promise;
// Schedules the promise for execution via Danger.
const _run = (reason: string, promise: Promise<any>) => schedule(promise);
const wrap: any = isJest ? _test : _run;

export const inviteCollaborator = wrap(
  'Invite the PR author to join as a collaborator',
  async () => {
    const gh = danger.github as any;

    // Details about the repo.
    const owner = gh.thisPR.owner;
    const repo = gh.thisPR.repo;
    const number = gh.thisPR.number;

    // Details about the pull request.
    const username = gh.pr.user.login;
    const isMerged = gh.pr.merged;

    // Check whether or not the PR author is a collaborator.
    const collabCheck = await danger.github.api.repos.checkCollaborator({
      owner,
      repo,
      username
    });
    const isCollaborator = collabCheck.meta.status === '204 No Content';
    console.log('isCollaborator');
    console.log(isCollaborator);

    // If this PR was sent by an existing collaborator or was NOT merged, do nothing.
    if (!isMerged || isCollaborator) {
      return;
    }

    const comment = [
      `Holy buckets, @${username} — we just merged your first PR to Gatsby! 💪💜`,
      ``,
      `Gatsby is built by awesome people like you, and we’d love to say “thanks” in two ways:`,
      ``,
      `1. **We want to invite you to be a collaborator on GitHub.** [TKTK build GitHub app to send invite and link to auth flow.]`,
      `2. **We’d like to send you some Gatsby swag.** [TKTK add instructions on claiming this.]`
    ];

    // For new contributors, roll out the welcome wagon!
    await danger.github.api.issues.createComment({
      owner,
      repo,
      number,
      body: comment.join('\n')
    });
  }
);
