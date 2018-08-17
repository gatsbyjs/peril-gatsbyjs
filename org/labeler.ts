import { danger } from 'danger';
import schedule from '../utils/testable-schedule';

const questionWords: Set<string> = new Set([
  'how',
  'who',
  'what',
  'where',
  'when',
  'why',
  'will',
  'which'
]);

const documentationWords: Set<string> = new Set([
  'documentation',
  'document',
  'docs',
  'doc',
  'readme',
  'changelog',
  'tutorial'
]);

const endsWith = (character: string, sentence: string): boolean =>
  sentence.slice(-1) === character;

const matchKeyword = (
  keywords: Set<string>,
  sentence: string,
  firstOnly: boolean = false
): boolean => {
  /*
   * We need to turn the title into a parseable array of words. To do this, we:
   * 1. Remove any character that’s not a letter or space
   * 2. Split the sentence on spaces to create an array of words, and
   * 3. Get the first word if `firstOnly` is `true`, or else the whole array
   */
  const words = sentence
    .replace(/\W /g, '')
    .split(' ')
    .slice(0, firstOnly ? 1 : Infinity) as string[];

  console.log(
    `Checking if ${JSON.stringify(
      words.join(', ')
    )} appears in ${JSON.stringify(Array.from(keywords).join(', '))}`
  );

  // Check if any of the words matches our set of keywords.
  return words.some((word: string) => keywords.has(word.toLowerCase()));
};

const validateLabels = (
  validLabels: GitHubIssueLabel[],
  labels: string[]
): string[] =>
  labels.filter(label => validLabels.map(i => i.name).includes(label));

export const labeler = schedule(
  'Label newly created issue based on keywords',
  async () => {
    console.log('-'.repeat(80));
    console.log('This is the labeler task');
    const gh = danger.github as any;
    const repo = gh.repository;
    const issue = gh.issue;
    const title = issue.title;
    const repoLabels = danger.github.issue.labels;
    console.log(`Incoming issue #${issue.number} “${title}”`);
    console.log(`Repo labels: ${repoLabels.join(', ')}`);

    let labels: string[] = [];

    // const addLabelIfDoesNotExist = (name: string) => {
    //   const labels = danger.github.issue.labels;
    //   const hasLabel = labels.map(i => i.name).includes(name);
    //   if (!hasLabel) {
    //     labelsToAdd.push(name);
    //   }
    // };

    if (endsWith('?', title) || matchKeyword(questionWords, title, true)) {
      console.log('This issue contains question words.');
      labels.push('question');
    }

    if (matchKeyword(documentationWords, title)) {
      console.log('This issue contains documentation words');
      labels.push('type: documentation');
    }

    const labelsToAdd = validateLabels(repoLabels, labels);
    console.log(`Labels to be added: ${labels.join(',')}`);

    if (labelsToAdd.length > 0) {
      await danger.github.api.issues.addLabels({
        owner: repo.owner.login,
        repo: repo.name,
        number: issue.number,
        labels: labelsToAdd
      });
    }
    console.log('-'.repeat(80));
  }
);
