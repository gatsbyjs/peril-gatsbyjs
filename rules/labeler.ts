import { schedule } from 'danger';
// import schedule from '../utils/testable-schedule';

const isJest = typeof jest !== 'undefined';

// The inspiration for this is https://git.io/fNh6i
// If `jest` is defined, we’re testing, so just return the Promise.
// If `jest` is undefined, actually schedule for execution with Danger.
const testableSchedule = (reason: string, action: any) =>
  isJest ? action : schedule(action);

export const labeler = testableSchedule(
  'Label newly created issue based on keywords',
  async () => {
    console.log('Is this thing working?');
  }
);
