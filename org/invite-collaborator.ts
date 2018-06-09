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
    const pr = gh.pr;
    // const isMerged = pr.merged;
    const repo = gh.repository;
    // const username = pr.user.login;
    const username = 'jlengstorf'; // XXX temp hack for debugging

    // const isCollaborator = await danger.github.api.repos.checkCollaborator({
    //   owner: repo.owner.login,
    //   repo: repo.name,
    //   username
    // });

    // If this PR was sent by an existing collaborator or was NOT merged, do nothing.
    // if (!isMerged) {
    //   return;
    // }

    // Invite the PR’s author to become a collaborator on the repo.
    // await danger.github.api.repos.addCollaborator({
    //   owner: repo.owner.login,
    //   repo: repo.name,
    //   username,
    //   permission: 'pull' // We trust by default, but only within reason.
    // });

    const comment = [
      `Holy buckets, @${username} — we just merged your first PR to Gatsby! 💪💜`,
      ``,
      `Gatsby is built by awesome people like you, and we’d love to say “thanks” in two ways:`,
      ``,
      `1. **We want to invite you to be a collaborator on GitHub.** This will give you the ability to label issues and to review, approve, and merge pull requests. We’ve just sent the invite, so if you’re interested in being a core part of the Gatsby OSS community, check your email to accept the invite.`,
      `2. **We’d like to send you some Gatsby swag.** [TKTK add instructions on claiming this.]`,
      ``,
      `DEBUG INFO:`,
      JSON.stringify(danger.github, null, 2)
    ];

    // Send our invite comment to the pull request.
    await danger.github.api.issues.createComment({
      owner: repo.owner.login,
      repo: repo.name,
      number: pr.number,
      body: comment.join('\n')
    });
  }
);
