import { danger } from "danger";
import { IssueComment } from "github-webhook-event-types";

export const STALE_LABEL = `stale?`;

export const notStale = async () => {
  const gh = (danger.github as any) as IssueComment;
  const repo = gh.repository;
  const labels = gh.issue.labels.map(i => i.name);

  if (labels.includes(STALE_LABEL)) {
    await danger.github.api.issues.removeLabel({
      owner: repo.owner.login,
      repo: repo.name,
      number: gh.issue.number,
      name: STALE_LABEL
    });
  }
};

export default async () => {
  await notStale();
};
