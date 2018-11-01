import { danger, peril } from "danger";
import * as endOfToday from "date-fns/end_of_today";
import * as subDays from "date-fns/sub_days";
import * as format from "date-fns/format";

const owner = `gatsbyjs`;
const repo = `gatsby-starter-default`;

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

const search = async (days: number, query: string) => {
  const api = danger.github.api;
  const timestamp = dateDaysAgo(endOfToday(), days);
  const q = `-label:"${EXEMPT_LABEL}" repo:${owner}/${repo} type:issue state:open updated:<${timestamp} ${query}`;
  const searchResponse = await api.search.issues({
    q,
    order: "asc",
    sort: "updated",
    per_page: MAX_ACTIONS
  });
  const items = searchResponse.data.items;
  if (items.length > MAX_ACTIONS) items.length = MAX_ACTIONS;
  return items;
};

const makeItStale = async (issue: { number: number }) => {
  let opts;
  const number = issue.number;
  const api = danger.github.api;
  const defaultOpts = { owner, repo, number };

  try {
    opts = { ...defaultOpts, labels: [STALE_LABEL] };
    await api.issues.addLabels(opts);
  } catch (error) {
    console.log(
      `Could not run issues.addLabels with options ${JSON.stringify(opts)}`
    );
  }

  try {
    opts = { ...defaultOpts, body: STALE_MESSAGE };
    await api.issues.createComment(opts);
  } catch (error) {
    console.log(
      `Could not run issues.createComment with options ${JSON.stringify(opts)}`
    );
  }
};

const makeItClosed = async (issue: { number: number }) => {
  let opts;
  const number = issue.number;
  const api = danger.github.api;
  const defaultOpts = { owner, repo, number };
  try {
    opts = { ...defaultOpts, body: CLOSE_MESSAGE };
    await api.issues.createComment(opts);
  } catch (error) {
    console.log(
      `Could not run issues.createComment with options ${JSON.stringify(opts)}`
    );
  }

  try {
    await api.issues.edit({ ...defaultOpts, state: "closed" });
  } catch (error) {
    console.log(
      `Could not run issues.edit with options ${JSON.stringify({
        ...defaultOpts,
        state: "closed"
      })}`
    );
  }
  await api.issues.edit({ owner, repo, number, state: `closed` });
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
