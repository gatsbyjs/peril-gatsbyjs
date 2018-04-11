// For the inspiration for this file, see: https://github.com/danger/peril-settings/blob/fc0015452438c8a1624c0951a600f723f2e60fea/org/aeryn.ts#L18-L39
import { schedule, danger, markdown } from "danger"

// Hey there!
//
// When a PR is closed, this file gets run. The purpose of this file is to 
// replicate Aeryn (https://github.com/Moya/Aeryn), which invites new 
// contributors to join the organization after their first PR gets merged.
//
// Ignore the next four const lines.
// The inspiration for this is https://github.com/artsy/artsy-danger/blob/f019ee1a3abffabad65014afabe07cb9a12274e7/org/all-prs.ts
const isJest = typeof jest !== "undefined"
// Returns the promise itself, for testing.
const _test = (reason: string, promise: Promise<any>) => promise
// Schedules the promise for execution via Danger.
const _run = (reason: string, promise: Promise<any>) => schedule(promise)
const wrap: any = isJest ? _test : _run

export const aeryn = wrap("When a PR is merged, check if the author is in the org", async () => {
  const pr = danger.github.pr
  const username = pr.user.login
  const api = danger.github.api

  if (!pr.merged) {
    // Only proceed if the PR was merged (as opposed to closed without merging).
    return
  }

  const org = "Moya"
  const inviteMarkdown = `
  @${username} Thanks a lot for contributing to Moya! I've invited you to join 
  the Moya GitHub organization – no pressure to accept! If you'd like more 
  information on what that means, check out our [contributor guidelines][c] and
  feel free to reach out with any questions.
  [c]: https://github.com/Moya/Moya/blob/master/Contributing.md
  `

  try {
    // This throws if the user isn't a member of the org yet. If it doesn't
    // throw, then it means the user was already invited or has already 
    // accepted the invitation (we ignore the return value here).
    await api.orgs.checkMembership({ org, username })
  } catch (error) {
    markdown(inviteMarkdown)
    await api.orgs.addOrgMembership({ org, username, role: "member" })
  }
})
