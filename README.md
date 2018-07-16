# Gatsby's Peril Settings

This is the configuration repo for Peril on the GatsbyJS org. There’s a [settings file](peril.settings.json) and org-wide dangerfiles which are inside the [org folder](org).

## tl;dr for this repo

Peril is Danger running on a web-server and this repo is the configuration for that. Currently the dangerfiles in [org](org/) run on every issue and pull request for all GatsbyJS Repos.

## How it works

Here are links to the relevant tools, docs, and apps we’re using:

- [Peril](https://github.com/danger/peril)
- [Danger JS](http://danger.systems/js/)
- [Peril for Orgs](https://github.com/danger/peril/blob/master/docs/setup_for_org.md)
- [Peril on the GatsbyJS Heroku team](https://dashboard.heroku.com/apps/peril-gatsbyjs)

### What is this project?

- [EmptyBody](org/emptybody.ts): Automatically requests more information from a user who opens a new issue with a blank body.
- [InviteCollaborator](org/invite-collaborator.ts): Automatically invite all contributors who merge a PR into the GatsbyJS org to become members of the [@gatsbyjs/maintainers](https://github.com/orgs/gatsbyjs/teams/maintainers) team.

### To Develop

```sh
git clone https://github.com/gatsbyjs/peril-gatsbyjs.git
yarn install
code .
```

You will need node and yarn installed beforehand. You can get them both by running `brew install yarn`.

This will give you auto-completion and types for Danger mainly.

## Acknowledgments

Huge thanks to [@SD10](https://github.com/SD10) for the initial setup help and for additional guidance along the way.

And thanks to [@orta](https://github.com/orta) for creating [Peril](https://github.com/danger/peril). This makes our lives so much easier.

## TODO

- [ ] Verify Heroku account
- [ ] Look at auto-labeling issues, autotagging teams
