## Moya's Peril Settings

This is the configuration repo for Peril on the Moya org. There is a [settings file](settings.json) and org-wide
dangerfiles which are inside the [org folder](org).

Here's some links to the key things

* [Peril](https://github.com/danger/peril)
* [Danger JS](http://danger.systems/js/)
* [Peril for Orgs](https://github.com/danger/peril/blob/master/docs/setup_for_org.md)
* [Peril on the Moya Heroku team](https://dashboard.heroku.com/apps/moya-peril)

### What is this project?

* [Aeryn](org/aeryn.ts): Automatically invites new contributors to the Moya GitHub organization after their first merged pull request. You can find out more about this practice at the [Moya contributors repo](https://github.com/Moya/contributors).

* [Labeler](org/labeler.ts): Attempts to automatically label newly created issues based on keywords in their title.

* [DocLinker](moya/labeler.ts): When an issue is labeled as a question, the bot attempts to recommend useful documentation based on keywords in the issue's title.

* [EmptyBody](org/emptybody.ts): Automatically requests more information from a user who opens a new issue with a blank body.

### To Develop

```sh
git clone https://github.com/CocoaPods/peril-settings.git
yarn install
code .
```

You will need node and yarn installed beforehand. You can get them both by running `brew install yarn`.

This will give you auto-completion and types for Danger mainly.

### TLDR on this Repo?

Peril is Danger running on a web-server, this repo is the configuration for that, currently the dangerfiles in [org](org/)
run on every issue and pull request for all Moya Repos.
