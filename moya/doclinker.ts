import { schedule, danger } from "danger"

var linkToKeywordMap = [
  { link: "[Migration Guides](https://github.com/Moya/Moya/tree/master/docs/MigrationGuides)", 
    keywords: new Set(["migrate", "migration"])
  },
  { link: "[Targets](https://github.com/Moya/Moya/blob/master/docs/Targets.md)", 
    keywords: new Set(["target", "targettype"])
  },
  { link: "[Providers](https://github.com/Moya/Moya/blob/master/docs/Providers.md)", 
  keywords: new Set(["provider", "providers", "moyaprovider", "rxmoyaprovider", "reactivemoyaprovider"])
  },
  { link: "[Endpoints](https://github.com/Moya/Moya/blob/master/docs/Endpoints.md)", 
  keywords: new Set(["endpoint", "endpoints", "endpointclosure", "requestclosure"])
  },
  { link: "[MultiTarget](https://github.com/Moya/Moya/blob/master/docs/Examples/MultiTarget.md)", 
  keywords: new Set(["multitarget"])
  },
  { link: "[MultipartUpload](https://github.com/Moya/Moya/blob/master/docs/Examples/MultipartUpload.md)", 
  keywords: new Set(["multipart"])
  },
  { link: "[ParameterEncoding](https://github.com/Moya/Moya/blob/master/docs/Examples/ParameterEncoding.md)", 
  keywords: new Set(["encoding"])
  },
  { link: "[Response](https://github.com/Moya/Moya/blob/master/docs/Examples/Response.md)", 
  keywords: new Set(["response", "moya.response"])
  },
  { link: "[ErrorTypes](https://github.com/Moya/Moya/blob/master/docs/Examples/ErrorTypes.md)", 
  keywords: new Set(["moyaerror"])
  },
  { link: "[RxSwift](https://github.com/Moya/Moya/blob/master/docs/RxSwift.md)", 
  keywords: new Set(["rxswift, rxmoya, rx"])
  },
  { link: "[ReactiveSwift](https://github.com/Moya/Moya/blob/master/docs/ReactiveSwift.md)", 
  keywords: new Set(["reactiveswift", "reactivemoya"])
  },
  { link: "[Threading](https://github.com/Moya/Moya/blob/master/docs/Threading.md)", 
  keywords: new Set(["thread", "threading"])
  },
  { link: "[Authentication](https://github.com/Moya/Moya/blob/master/docs/Authentication.md)", 
  keywords: new Set(["auth", "authentication", "oauth"])
  },
  { link: "[Plugins](https://github.com/Moya/Moya/blob/master/docs/Plugins.md)", 
  keywords: new Set(["plugin", "plugins", "plugintype"])
  },
  { link: "[AuthPlugin](https://github.com/Moya/Moya/blob/master/docs/Examples/AuthPlugin.md)", 
  keywords: new Set(["authplugin", "auth", "plugin", "plugintype"])
  },
  { link: "[Custom Plugin](https://github.com/Moya/Moya/blob/master/docs/Examples/CustomPlugin.md)", 
  keywords: new Set(["plugin", "plugintype"])
  },
  { link: "[Alamofire Validation](https://github.com/Moya/Moya/blob/master/docs/Examples/AlamofireValidation.md)", 
  keywords: new Set(["alamofirevalidation", "validation", "validationtype", "validate"])
  }
]

// Variables / Constants

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

let commentBody = "- [Getting Started with Moya](https://github.com/Moya/Moya/blob/master/docs/Examples/Basic.md) \n"

const commentFooter = `
  You can find the rest of Moya's English documentation [here](https://github.com/Moya/Moya/tree/master/docs).
  We also have Chinese versions of the documentation [here](https://github.com/Moya/Moya/tree/master/docs_CN).
  You can see our in source documentation at [moya.github.io](https://moya.github.io). 
`

// Functions

const isIssueQuestion = (): boolean => {
  const labels = issue.labels
  for (var i = 0; i < labels.length; i++) {
    const label = labels[i]
    if (label.name == "question") { return true }
  }
  return false
}

const titleIncludesAny = (words: Set<string>): boolean => {
  if (titleWords.length == 0) { return false }
  for (var i = 0; i < titleWords.length; i++) {
    const titleWord = titleWords[i]
    if (words.has(titleWord)) { return true }
  }
  return false
}

const createCommentBody = () => {
  for (const link in linkToKeywordMap) {
    if (linkToKeywordMap.hasOwnProperty(link)) {
      const element = linkToKeywordMap[link];
      if (titleIncludesAny(element.keywords)) {
        commentBody.concat(`- ${link} \n`)
      }
    }
  }
}

const addComment = (body: string) => {
  schedule(async () => {
    await danger.github.api.issues.createComment({
      owner: repo.owner.login,
      repo: repo.name,
      number: issue.number,
      body: body
    })
  })
}

// Rule

if (isIssueQuestion) {
  createCommentBody()
  const comment = commentHeader + commentBody + commentFooter
  addComment(comment)
}
