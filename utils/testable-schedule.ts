import { schedule } from 'danger';

const isJest = typeof jest !== 'undefined';

// The inspiration for this is https://git.io/fNh6i
// If `jest` is defined, we’re testing, so just return the Promise.
// If `jest` is undefined, actually schedule for execution with Danger.
const testableSchedule = (
  reason: string,
  promise: Promise<any | void>
): void | Promise<any | void> => (isJest ? promise : schedule(promise));

export default testableSchedule;
