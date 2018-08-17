// import { danger } from 'danger';
import schedule from '../utils/testable-schedule';

export const labeler = schedule(
  'Label newly created issue based on keywords',
  async () => {
    console.log('Is this thing working?');
  }
);
