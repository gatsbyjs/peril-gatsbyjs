import { danger, schedule } from 'danger';
import * as Octokit from '@octokit/rest';

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
    const api = danger.github.api;

    // Details about the repo.
    const owner = gh.thisPR.owner;
    const repo = gh.thisPR.repo;
    const number = gh.thisPR.number;

    // Details about the pull request.
    const username = gh.pr.user.login;
    const isMerged = gh.pr.merged;

    // Check whether or not the PR author is a collaborator.
    const collabCheck = await api.repos.checkCollaborator({
      owner,
      repo,
      username
    });
    const isCollaborator = collabCheck.meta.status === '204 No Content';

    console.log('isCollaborator', isCollaborator);

    // If this PR was sent by an existing collaborator or was NOT merged, do nothing.
    // if (!isMerged || isCollaborator) {
    //   return;
    // }

    console.log('We’re doing stuff!');

    const comment = `
  Holy buckets, @${username} — we just merged your first PR to Gatsby! 💪💜
  
  Gatsby is built by awesome people like you, and we’d love to say “thanks” in two ways:
  
  1.  **We just invited you to join our team of maintainers on GitHub.** You’ll receive an email shortly asking you to confirm. By joining the team, you’ll be able to label issues, review pull requests, and merge approved pull requests.
  2.  **We’d like to send you some Gatsby swag.** As a token of our appreciation, you can go to the [Gatsby Swag Store][store] and log in with your GitHub account to get a coupon code good for one free piece of swag. (Currently we’ve got a couple t-shirts available, plus some socks that are really razzing our berries right now.)
  
  If there’s anything we can do to help, please don’t hesitate to reach out to us: just mention @gatsbyjs/inkteam on GitHub or tweet at [@gatsbyjs][twitter] and we’ll come a-runnin’.

  Thanks again!

  [store]: https://store.gatsbyjs.com
  [twitter]: https://twitter.com/gatsbyjs
`;

    try {
      const github = new Octokit();

      console.log('We’ve created a new instance of Octokit.');

      github.authenticate({
        type: 'token',
        token: process.env.GITHUB_TOKEN
      });

      console.log('Authentication worked');

      const invite = await github.orgs.addTeamMembership({
        // ID of the @gatsbyjs/maintainers team on GitHub
        team_id: 1942254,
        username
      });

      console.log('The invite worked!', invite);
    } catch (err) {
      console.log('Something went wrong.');
      console.log(err);
    }

    console.log(`invite`, invite);

    // For new contributors, roll out the welcome wagon!
    await api.issues.createComment({
      owner,
      repo,
      number,
      body: comment
    });
  }
);
