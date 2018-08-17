import { schedule } from 'danger';

// The inspiration for this is https://git.io/fNh6i
// If `jest` is defined, we’re testing, so just return the Promise.
// If `jest` is undefined, actually schedule for execution with Danger.
const testableSchedule = (reason: string, action: any) =>
  typeof jest !== 'undefined' ? action : schedule(action);

export default testableSchedule;
