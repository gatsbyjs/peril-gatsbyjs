jest.mock('danger', () => jest.fn());
import * as danger from 'danger';
const dm = danger as any;

import { emptybody } from '../rules/emptybody';
import { notDeepEqual } from 'assert';

beforeEach(() => {
  dm.danger = {
    github: {
      repository: {
        owner: 'gatsbyjs'
      },
      issue: {
        user: {
          login: 'someUser'
        }
      },
      api: {
        issues: {
          createComment: jest.fn()
        }
      }
    }
  };
});

describe('a new issue', () => {
  it('has no contnent in the body', () => {
    dm.danger.github.issue.body = '';
    return emptybody().then(() => {
      expect(dm.danger.github.api.issues.createComment).toBeCalled();
    });
  });
  it('only contains whitespace in body', () => {
    dm.danger.github.issue.body = '\n';
    return emptybody().then(() => {
      expect(dm.danger.github.api.issues.createComment).toBeCalled();
    });
  });
  it('has a body with content', () => {
    dm.danger.github.issue.body = 'Moya is awesome';
    return emptybody().then(() => {
      expect(dm.danger.github.api.issues.createComment).not.toBeCalled();
    });
  });
});
