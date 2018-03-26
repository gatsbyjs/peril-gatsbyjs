import { danger, schedule } from "danger";

const gh = danger.github as any;
const issue = gh.issue;
const repo = gh.repository;

const title = issue.title.toLowerCase()
const titleWords = title.split(" ")

var labelsToAdd: string[] = []

// label: question

const questionWords: Set<string> = new Set(["how", "who", "what", "where", "when", "why", "which"])

if (titleEndsInQuestionMark() || titleStartsWithAny(questionWords)) {
  labelsToAdd.push("question")
}

// label: documentation

const documentationWords: Set<string> = new Set(["documentation", "document", "docs", "doc", "readme", "changelog"])

if (titleStartsWithAny(documentationWords)) {
  labelsToAdd.push("documentation")
}

// label: enhancement

const enhancementWords: Set<string> = new Set(["add", "allow", "improve", "upgrade", "update", "support"])

if (titleStartsWithAny(enhancementWords)) {
  labelsToAdd.push("enhancement")
}

// label: cocoapods

const cocoaPodsWords: Set<string> = new Set(["pod", "cocoapod", "cocoapods"])

if (titleIncludesAny(cocoaPodsWords)) {
  labelsToAdd.push("cocoapods")
}

// label: carthage

const carthageWords: Set<string> = new Set(["carthage", "cartfile"])

if (titleIncludesAny(carthageWords)) {
  labelsToAdd.push("carthage")
}

// label: bug?

const bugWords: Set<string> = new Set(["bug", "crash", "leak"])

if (titleIncludesAny(bugWords)) {
  labelsToAdd.push("bug?")
}

// Helpers

function titleStartsWithAny(words: Set<string>): boolean  {
  if (titleWords.length == 0) { return false }
  const firstWord = titleWords[0]
  return words.has(firstWord)
}

function titleIncludesAny(words: Set<string>): boolean {
  if (titleWords.length == 0) { return false }
  for (var i = 0; i < titleWords.length; i++) {
    const titleWord = titleWords[i]
    if (words.has(titleWord)) { return true }
  }
  return false
}

function titleEndsInQuestionMark(): boolean {
  return title.slice(-1) == "?"
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