# Gatsby's Peril Settings

This is the configuration repo for Peril on the GatsbyJS org. There is a [settings file](peril.settings.json) and org-wide
dangerfiles which are inside the [org folder](org).

Here's some links to the key things

- [Peril](https://github.com/danger/peril)
- [Danger JS](http://danger.systems/js/)
- [Peril for Orgs](https://github.com/danger/peril/blob/master/docs/setup_for_org.md)
- [Peril on the GatsbyJS Heroku team](https://dashboard.heroku.com/apps/peril-gatsbyjs)

### What is this project?

- [EmptyBody](org/emptybody.ts): Automatically requests more information from a user who opens a new issue with a blank body.

### To Develop

```sh
git clone https://github.com/gatsbyjs/peril-gatsbyjs.git
yarn install
code .
```

You will need node and yarn installed beforehand. You can get them both by running `brew install yarn`.

This will give you auto-completion and types for Danger mainly.

### TLDR on this Repo?

Peril is Danger running on a web-server, this repo is the configuration for that, currently the dangerfiles in [org](org/)
run on every issue and pull request for all GatsbyJS Repos.
