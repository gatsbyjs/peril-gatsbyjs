jest.mock('danger', () => jest.fn());
import * as danger from 'danger';
const dm = danger as any;

import { inviteCollaborator } from '../org/invite-collaborator';
import { notDeepEqual } from 'assert';

beforeEach(() => {
  dm.danger = {
    github: {
      repository: {
        owner: 'gatsbyjs'
      },
      pull_request: {
        user: {
          login: 'someUser'
        }
      },
      api: {
        repos: {
          addCollaborator: jest.fn(),
          checkCollaborator: () => Promise.resolve({ status: 404 })
        },
        issues: {
          createComment: jest.fn()
        }
      }
    }
  };
});

describe('a closed pull request', () => {
  it.skip('was merged and authored by a first-time contributor', () => {
    dm.danger.github.pull_request.merged = true;
    return inviteCollaborator().then(() => {
      expect(dm.danger.github.api.repos.addCollaborator).toBeCalled();
    });
  });

  it.skip('was merged and authored by an existing collaborator', () => {
    dm.danger.github.pull_request.merged = true;
    dm.danger.github.api.repos.checkCollaborator = () => Promise.resolve(false);
    return inviteCollaborator().then(() => {
      expect(dm.danger.github.api.repos.addCollaborator).not.toBeCalled();
    });
  });

  it('was not merged', () => {
    dm.danger.github.pull_request.merged = false;
    return inviteCollaborator().then(() => {
      expect(dm.danger.github.api.repos.addCollaborator).not.toBeCalled();
    });
  });
});
