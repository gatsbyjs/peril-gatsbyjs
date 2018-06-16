import { danger, schedule } from 'danger';

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

    // Details about the collaborator.
    const username = gh.pr.user.login;

    console.log(`Checking if @${username} is already invited to the org.`);

    // Check whether or not we’ve already invited this contributor.
    try {
      const inviteCheck = await api.orgs.getTeamMembership({
        id: '1942254',
        username
      });
      const isInvited = inviteCheck.meta.status !== '404';

      // If we’ve already invited them, don’t spam them with more messages.
      if (isInvited) {
        console.log(
          `@${username} has already been invited to this org. Doing nothing.`
        );
        return;
      }
    } catch (err) {
      console.log('Error checking on invites...');
      console.log(err);
    }

    console.log(
      `@${username} isn’t invited yet. That’s unacceptable. Let’s fix it!`
    );

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
      const invite = await api.orgs.addTeamMembership({
        // ID of the @gatsbyjs/maintainers team on GitHub
        id: '1942254',
        username
      });

      if (invite.data.state === 'active') {
        console.log(
          `@${username} is already a ${invite.data.role} for this team.`
        );
      } else {
        console.log(`We’ve invited @${username} to join this team.`);
      }
    } catch (err) {
      console.log('Something went wrong.');
      console.log(err);
    }

    // For new contributors, roll out the welcome wagon!
    await api.issues.createComment({
      owner,
      repo,
      number,
      body: comment
    });
  }
);
