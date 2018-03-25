import { danger, schedule } from "danger";

const gh = danger.github as any;
const issue = gh.issue;
const repo = gh.repository;

const title = issue.title.toLowerCase()

var labelsToAdd: string[] = []

// label: question

const qWords: string[] = ["how", "who", "what", "where", "when", "why", "which"]

if (issue.title.slice(-1) == "?") {
  labelsToAdd.push("question")
} else {
  for (var i = 0; i < qWords.length; i++) {
    if (title.startsWith(qWords[i])) {
      labelsToAdd.push("question")
      break
    }
  }
}

// label: documentation

const docWords: string[] = ["documentation", "document", "docs", "readme", "changelog", ".md"]

for (var i = 1; i < docWords.length; i++) {
  if (title.includes(docWords[i])) {
    labelsToAdd.push("documentation")
    break
  }
}

// label: enhancement

const enhanceWords: string[] = ["add", "allow", "improve", "upgrade", "update", "support"]

if (title.includes("enhancement")) {
  labelsToAdd.push("enhancement")
} else {
  for (var i = 1; i < enhanceWords.length; i++) {
    if (title.includes(enhanceWords[i])) {
      labelsToAdd.push("enhancement")
      break
    }
  }
}

// label: cocoapods

const podWords: string[] = ["pod", "cocoapods"]

for (var i = 1; i < podWords.length; i++) {
  if (title.includes(podWords[i])) {
    labelsToAdd.push("cocoapods")
    break
  }
}

// label: carthage

if (title.includes("carthage")) {
  labelsToAdd.push("carthage")
}

// label: bug?

const bugWords: string[] = ["bug", "crash", "memory leak"]

for (var i = 1; i < bugWords.length; i++) {
  if (title.includes(bugWords[i])) {
    labelsToAdd.push("bug?")
  }
}

// Adding labels

function addLabels(names: string[]) {
  schedule(async () => {
    await danger.github.api.issues.addLabels({
      owner: repo.owner.login,
      repo: repo.name,
      number: issue.number,
      labels: names
    })
  })
}

addLabels(labelsToAdd)