import { danger, peril } from "danger";
import * as endOfToday from "date-fns/end_of_today";
import * as subDays from "date-fns/sub_days";
import * as format from "date-fns/format";

const owner = `gatsbyjs`;

const STALE_LABEL = `stale?`;
const EXEMPT_LABEL = `not stale`;
const DAYS_TO_STALE = 20;
const DAYS_TO_CLOSE = 10;
const MAX_ACTIONS = 2;
const STALE_MESSAGE = `Old issues will be closed after ${DAYS_TO_STALE +
  DAYS_TO_CLOSE} days of inactivity. This issue has been quiet for ${DAYS_TO_STALE} days and is being marked as stale. Reply here or add the label "${EXEMPT_LABEL}" to keep this issue open!`;
const CLOSE_MESSAGE = `This issue is being closed due to inactivity. Is this a mistake? Please re-open this issue or create a new issue.`;

export const dateDaysAgo = (today: Date, days: number): string => {
  const daysAgo = subDays(today, days);
  return format(daysAgo, "YYYY-MM-DD");
};

interface ApiError {
  action: string;
  opts: object;
  error: any;
}

const logApiError = ({ action, opts, error }: ApiError) => {
  const msg = `Could not run ${action} with options ${JSON.stringify(
    opts
  )}\n Error was ${error}\nSet env var DEBUG=octokit:rest* for extended logging info.`;
  console.log(msg);
};

// url format is "https://api.github.com/repos/<orgname>/<reponame>"
// See https://api.github.com/search/issues?q=-label:%22not%20stale%22 for examples
// TODO: hit the url and parse the name from the response, with error handling
const getRepoFromUrl = (url: string) => url.split("/").pop();

const search = async (days: number, query: string) => {
  const api = danger.github.api;
  const timestamp = dateDaysAgo(endOfToday(), days);
  const q = `-label:"${EXEMPT_LABEL}" org:${owner} type:issue state:open updated:<${timestamp} ${query}`;
  const searchResponse = await api.search.issues({
    q,
    order: "asc",
    sort: "updated",
    per_page: MAX_ACTIONS
  });
  const items = searchResponse.data.items;
  return items.slice(0, Math.min(items.length, MAX_ACTIONS));
};

const makeItStale = async (issue: {
  number: number;
  repository_url: string;
}) => {
  let opts: any; // any :(
  const api = danger.github.api;
  const repo = getRepoFromUrl(issue.repository_url);
  const defaultOpts = { owner, repo, number: issue.number };

  opts = { ...defaultOpts, labels: [STALE_LABEL] };
  try {
    await api.issues.addLabels(opts);
  } catch (error) {
    logApiError({ action: `issues.addLabels`, opts, error });
  }

  opts = { ...defaultOpts, body: STALE_MESSAGE };
  try {
    await api.issues.createComment(opts);
  } catch (error) {
    logApiError({ action: `issues.createComment`, opts, error });
  }
};

const makeItClosed = async (issue: {
  number: number;
  repository_url: string;
}) => {
  let opts: any; // any :(
  const api = danger.github.api;
  const repo = getRepoFromUrl(issue.repository_url);
  const defaultOpts = { owner, repo, number: issue.number };

  opts = { ...defaultOpts, body: CLOSE_MESSAGE };
  try {
    await api.issues.createComment(opts);
  } catch (error) {
    logApiError({ action: `issues.createComment`, opts, error });
  }

  opts = { ...defaultOpts, state: "closed" };
  try {
    await api.issues.edit(opts);
  } catch (error) {
    logApiError({ action: `issues.edit`, opts, error });
  }
};

export default async () => {
  console.log("Stale task: init");

  // mark old issues as stale
  const toLabel = await search(DAYS_TO_STALE, `-label:"${STALE_LABEL}"`);
  console.log(`Stale task: found ${toLabel.length} issues to label`);
  await Promise.all(toLabel.map(makeItStale));
  console.log("Stale task: labelled stale issues");

  // close out untouched stale issues
  const toClose = await search(DAYS_TO_CLOSE, `label:"${STALE_LABEL}"`);
  console.log(`Stale task: found ${toClose.length} issues to close`);
  await Promise.all(toClose.map(makeItClosed));
  console.log("Stale task: closed issues");
};
