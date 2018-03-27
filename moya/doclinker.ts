import { schedule, danger } from "danger"

// URLs & Keywords

const basicURL = "https://github.com/Moya/Moya/blob/master/docs/Examples/Basic.md"

const authenticationWords: Set<string> = new Set(["auth", "authentication", "oauth"])
const authenticationURL = "https://github.com/Moya/Moya/blob/master/docs/Authentication.md"

const endpointWords: Set<string> = new Set(["endpoint", "endpoints", "endpointclosure", "requestclosure"])
const endpointsURL = "https://github.com/Moya/Moya/blob/master/docs/Endpoints.md"

const pluginWords: Set<string> = new Set(["plugin", "plugins", "plugintype"])
const pluginsURL = "https://github.com/Moya/Moya/blob/master/docs/Plugins.md"

const providerWords: Set<string> = new Set(["provider", "providers", "moyaprovider", "rxmoyaprovider", "reactivemoyaprovider"])
const providerURL = "https://github.com/Moya/Moya/blob/master/docs/Providers.md"

const reactiveSwiftWords: Set<string> = new Set(["reactiveswift", "reactivemoya"])
const reactiveSwiftURL = "https://github.com/Moya/Moya/blob/master/docs/ReactiveSwift.md"

const rxSwiftWords: Set<string> = new Set(["rxswift, rxmoya, rx"])
const rxSwiftURL = "https://github.com/Moya/Moya/blob/master/docs/RxSwift.md"

const targetWords: Set<string> = new Set(["target", "targettype"])
const targetsURL = "https://github.com/Moya/Moya/blob/master/docs/Targets.md"

const threadingWords: Set<string> = new Set(["thread", "threading"])
const threadingURL = "https://github.com/Moya/Moya/blob/master/docs/Threading.md"

const validationWords: Set<string> = new Set(["alamofirevalidation", "validation", "validationtype", "validate"])
const validationURL = "https://github.com/Moya/Moya/blob/master/docs/Examples/AlamofireValidation.md"

const authpluginWords: Set<string> = new Set(["authplugin", "auth", "plugin", "plugintype"])
const authpluginURL = "https://github.com/Moya/Moya/blob/master/docs/Examples/AuthPlugin.md"

const customPluginWords: Set<string> = new Set(["plugin", "plugintype"])
const customPluginURL = "https://github.com/Moya/Moya/blob/master/docs/Examples/CustomPlugin.md"

const moyaErrorWords: Set<string> = new Set(["moyaerror"])
const moyaErrorURL = "https://github.com/Moya/Moya/blob/master/docs/Examples/ErrorTypes.md"

const multiTargetWords: Set<string> = new Set(["multitarget"])
const multiTargetURL = "https://github.com/Moya/Moya/blob/master/docs/Examples/MultiTarget.md"

const multipartWords: Set<string> = new Set(["multipart"])
const multipartURL = "https://github.com/Moya/Moya/blob/master/docs/Examples/MultipartUpload.md"

const encodingWords: Set<string> = new Set(["encoding"])
const encodingURL = "https://github.com/Moya/Moya/blob/master/docs/Examples/ParameterEncoding.md"

const responseWords: Set<string> = new Set(["response", "moya.response"])
const responseURL = "https://github.com/Moya/Moya/blob/master/docs/Examples/Response.md"

const migrationWords: Set<string> = new Set(["migrate", "migration"])
const migrationURL = "https://github.com/Moya/Moya/tree/master/docs/MigrationGuides"

// Helpers

function createComment(body: string) {
  schedule(async () => {
    await danger.github.api.issues.createComment({
      owner: repo.owner.login,
      repo: repo.name,
      number: issue.number,
      body: body
    })
  })
}

function issueIsQuestion(): boolean {
  const labels = issue.labels
  for (var i = 0; i < labels.length; i++) {
    const label = labels[i]
    if (label.name == "question") { return true }
  }
  return false
}

function titleIncludesAny(words: Set<string>): boolean {
  if (titleWords.length == 0) { return false }
  for (var i = 0; i < titleWords.length; i++) {
    const titleWord = titleWords[i]
    if (words.has(titleWord)) { return true }
  }
  return false
}

function addLinkToBody(text: string, link: string) {
  commentBody.concat(`- [${text}](${link}) \n`)
}

function createCommentBody() {

  // Always add Basic.md as a suggestion
  addLinkToBody("Getting Started with Moya", basicURL)

  if (titleIncludesAny(migrationWords)) {
    addLinkToBody("Migration Guides", migrationURL)
  }

  if (titleIncludesAny(targetWords)) {
    addLinkToBody("Targets", targetsURL)
  }

  if (titleIncludesAny(providerWords)) {
    addLinkToBody("Providers", providerURL)
  }

  if (titleIncludesAny(endpointWords)) {
    addLinkToBody("Endpoints", endpointsURL)
  }

  if (titleIncludesAny(multiTargetWords)) {
    addLinkToBody("MultiTarget", multiTargetURL)
  }

  if (titleIncludesAny(multipartWords)) {
    addLinkToBody("MultipartUpload", multipartURL)
  }

  if (titleIncludesAny(encodingWords)) {
    addLinkToBody("ParameterEncoding", encodingURL)
  }

  if (titleIncludesAny(responseWords)) {
    addLinkToBody("Response", responseURL)
  }

  if (titleIncludesAny(moyaErrorWords)) {
    addLinkToBody("MoyaError", moyaErrorURL)
  }

  if (titleIncludesAny(reactiveSwiftWords)) {
    addLinkToBody("ReactiveSwift", reactiveSwiftURL)
  }

  if (titleIncludesAny(rxSwiftWords)) {
    addLinkToBody("RxSwift", rxSwiftURL)
  }

  if (titleIncludesAny(threadingWords)) {
    addLinkToBody("Threading", threadingURL)
  }

  if (titleIncludesAny(authenticationWords)) {
    addLinkToBody("Authentication", authenticationURL)
  }

  if (titleIncludesAny(pluginWords)) {
    addLinkToBody("Plugins", pluginsURL)
  }

  if (titleIncludesAny(authpluginWords)) {
    addLinkToBody("AuthPlugin", authpluginURL)
  }

  if (titleIncludesAny(customPluginWords)) {
    addLinkToBody("CustomPlugins", customPluginURL)
  }
}

// Github

const gh = danger.github as any;
const issue = gh.issue;
const username = issue.user.login
const repo = gh.repository;

const title = issue.title.toLowerCase()
const titleWords = title.split(" ")

const commentHeader = `
  Hey @${username},
  We think the following documentation may be helpful in resolving your question:
`

var commentBody = ""

const commentFooter = `
  You can find the rest of Moya's English documentation [here](https://github.com/Moya/Moya/tree/master/docs).
  We also have Chinese versions of the documentation [here](https://github.com/Moya/Moya/tree/master/docs_CN).
  You can see our in source documentation at [moya.github.io](https://moya.github.io). 
`

if (issueIsQuestion()) {
  createCommentBody()
  
  const comment = commentHeader + commentBody + commentFooter

  createComment(comment)
}
