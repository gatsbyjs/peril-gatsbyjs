jest.mock('danger', () => jest.fn());
import * as danger from 'danger';
const dm = danger as any;

import { inviteCollaborator } from '../rules/invite-collaborator';

beforeEach(() => {
  dm.danger = {
    github: {
      thisPR: {
        owner: 'gatsbyjs',
        repo: 'peril-gatsbyjs',
        number: 1
      },
      pr: {
        user: {
          login: 'someUser'
        }
      },
      api: {
        orgs: {
          getTeamMembership: () => Promise.resolve({ meta: { status: '404' } }),
          addTeamMembership: jest.fn(() =>
            Promise.resolve({ data: { state: 'pending' } })
          )
        },
        issues: {
          createComment: jest.fn()
        }
      }
    }
  };
});

describe('a closed pull request', () => {
  it('was merged and authored by a first-time contributor', () => {
    dm.danger.github.pr.merged = true;
    return inviteCollaborator().then(() => {
      expect(dm.danger.github.api.issues.createComment).toBeCalled();
      expect(dm.danger.github.api.orgs.addTeamMembership).toBeCalled();
    });
  });

  it('was merged and authored by an existing collaborator', () => {
    dm.danger.github.pr.merged = true;
    dm.danger.github.api.orgs.getTeamMembership = () =>
      Promise.resolve({ meta: { status: '204 No Content' } });
    return inviteCollaborator().then(() => {
      expect(dm.danger.github.api.issues.createComment).not.toBeCalled();
    });
  });
});
