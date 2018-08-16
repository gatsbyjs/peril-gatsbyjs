import { danger, schedule } from 'danger';

// The inspiration for this is https://github.com/artsy/artsy-danger/blob/f019ee1a3abffabad65014afabe07cb9a12274e7/org/all-prs.ts
const isJest = typeof jest !== 'undefined';
// Returns the promise itself, for testing.
const _test = (reason: string, promise: Promise<any>) => promise;
// Schedules the promise for execution via Danger.
const _run = (reason: string, promise: Promise<any>) => schedule(promise);
const wrap: any = isJest ? _test : _run;

export const labeler = wrap(
  'Label newly created issue based on keywords',
  async () => {
    console.log('-'.repeat(80));
    console.log('This is the labeler task');
    const gh = danger.github as any;
    const repo = gh.repository;
    const issue = gh.issue;
    const title = issue.title;
    console.log(`Incoming issue data: ${JSON.stringify(issue)}`);
    const titleWords = title.split(' ') as string[];

    let labelsToAdd: string[] = [];

    const titleIncludesAny = (words: Set<string>): boolean => {
      return (
        titleWords.filter(titleWord => words.has(titleWord.toLowerCase()))
          .length > 0
      );
    };

    const titleStartsWithAny = (words: Set<string>): boolean => {
      if (titleWords.length == 0) {
        return false;
      }

      const firstWord = titleWords[0];
      return words.has(firstWord.toLowerCase());
    };

    const titleEndsInQuestionMark = (): boolean => {
      return title.slice(-1) == '?';
    };

    const addLabelIfDoesNotExist = (name: string) => {
      const labels = danger.github.issue.labels;
      const hasLabel = labels.map(i => i.name).includes(name);
      if (!hasLabel) {
        labelsToAdd.push(name);
      }
    };

    // type: question or discussion
    const questionWords: Set<string> = new Set([
      'how',
      'who',
      'what',
      'where',
      'when',
      'why',
      'which'
    ]);

    if (titleEndsInQuestionMark() || titleStartsWithAny(questionWords)) {
      console.log(
        'discussion related words found label without spaces and colon'
      );
      addLabelIfDoesNotExist('question');
    }

    if (titleEndsInQuestionMark() || titleStartsWithAny(questionWords)) {
      console.log('discussion related words found');
      addLabelIfDoesNotExist('type: question or discussion');
    }

    // label: type: documentation
    const documentationWords: Set<string> = new Set([
      'documentation',
      'document',
      'docs',
      'doc',
      'readme',
      'changelog',
      'tutorial'
    ]);

    if (titleIncludesAny(documentationWords)) {
      console.log('documentation related words found');
      addLabelIfDoesNotExist('type: documentation');
    }

    if (labelsToAdd.length > 0) {
      console.log(`Labels to be added: ${labelsToAdd.join(',')}`);
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
