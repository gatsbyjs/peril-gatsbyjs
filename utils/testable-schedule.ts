import { schedule } from 'danger';

// The inspiration for this is https://git.io/fNh6i
// If `jest` is defined, we’re testing, so just return the Promise.
// If `jest` is undefined, actually schedule for execution with Danger.
export default (reason: string, promise: Promise<any>) =>
  typeof jest !== 'undefined' ? promise : schedule(promise);
