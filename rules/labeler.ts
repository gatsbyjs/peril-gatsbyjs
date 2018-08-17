import testableSchedule from '../utils/testable-schedule';

export const labeler = testableSchedule(
  'Label newly created issue based on keywords',
  async () => {
    console.log('Is this thing working?');
  }
);
