import { danger, peril } from "danger";
import * as endOfToday from "date-fns/end_of_today";
import * as subDays from "date-fns/sub_days";
import * as format from "date-fns/format";

const owner = `gatsbyjs`;
const repo = `gatsby`;
const STALE_LABEL = `stale?`;
const daysUntilStale = 2;
const daysUntilClose = 2;
const maxActions = 2;
const staleMessage = `No activity on this issue, marking as stale`;
const closeMessage = `This issue was stale, closing `;

export const dateDaysAgo = (today: Date, days: number): string => {
  const daysAgo = subDays(today, days);
  return format(daysAgo, "YYYY-MM-DD");
};

const search = async (days: number, query: string) => {
  const api = danger.github.api;
  const timestamp = dateDaysAgo(endOfToday(), days);
  const q = `org:${owner}/${repo} type:issue state:open updated:<${timestamp} per_page:${maxActions} ${query}`;
  const searchResponse = await api.search.issues({
    q,
    order: "asc",
    sort: "updated"
  });
  return searchResponse.data.items;
};

const makeItStale = async (issue: { number: number }) => {
  const number = issue.number;
  const api = danger.github.api;
  await api.issues.addLabels({ owner, repo, number, labels: [STALE_LABEL] });
  await api.issues.createComment({ owner, repo, number, body: staleMessage });
};

const makeItClosed = async (issue: { number: number }) => {
  const number = issue.number;
  const api = danger.github.api;
  await api.issues.createComment({ owner, repo, number, body: closeMessage });
  await api.issues.edit({ owner, repo, number, state: `closed` });
};

export default async () => {
  // mark old issues as stale
  const toLabel = await search(daysUntilStale, `-label:${STALE_LABEL}`);
  await Promise.all(toLabel.map(makeItStale));

  // close out untouched stale issues
  const toClose = await search(daysUntilClose, `label:${STALE_LABEL}`);
  await Promise.all(toClose.map(makeItClosed));
};
