jest.mock('danger', () => jest.fn());
import * as danger from 'danger';
const dm = danger as any;

import { labeler } from '../org/labeler';

beforeEach(() => {
  dm.danger = {
    github: {
      repository: {
        name: 'gatsby',
        owner: {
          login: "gatsbyjs"
        }
      },
      issue: {
        labels: [],
        number: 100
      },
      api: {
        issues: {
          addLabels: jest.fn()
        }
      }
    }
  };
});

describe('a new issue', () => {
  it('with question mark in a title', () => {
    dm.danger.github.issue.title = 'Help - Has anyone hosted a gatsby.js site on Platform.sh?';
    return labeler().then(() => {
      expect(dm.danger.github.api.issues.addLabels).toBeCalledWith({
        repo: 'gatsby',
        owner: 'gatsbyjs',
        number: 100,
        labels: ['question', 'type: question or discussion']
      })
    });
  });

  it('starting with how', () => {
    dm.danger.github.issue.title = 'How do you justify Gatsby’s bundle size to clients';
    return labeler().then(() => {
      expect(dm.danger.github.api.issues.addLabels).toBeCalledWith({
        repo: 'gatsby',
        owner: 'gatsbyjs',
        number: 100,
        labels: ['question', 'type: question or discussion']
      })
    });
  });

  it('including tutorial', () => {
    dm.danger.github.issue.title = 'Tutorial template + gold standard example';
    return labeler().then(() => {
      expect(dm.danger.github.api.issues.addLabels).toBeCalledWith({
        repo: 'gatsby',
        owner: 'gatsbyjs',
        number: 100,
        labels: ['type: documentation']
      })
    });
  });

  it('including readme', () => {
    dm.danger.github.issue.title = '[v2] default starter: update README';
    return labeler().then(() => {
      expect(dm.danger.github.api.issues.addLabels).toBeCalledWith({
        repo: 'gatsby',
        owner: 'gatsbyjs',
        number: 100,
        labels: ['type: documentation']
      })
    });
  });

  it('not recognised', () => {
    dm.danger.github.issue.title = 'Supporting HSTS and how to HSTS preloading';
    return labeler().then(() => {
      expect(dm.danger.github.api.issues.addLabels).not.toBeCalled()
    })
  });
});
