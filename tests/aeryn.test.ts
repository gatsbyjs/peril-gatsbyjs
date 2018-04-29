jest.mock("danger", () => jest.fn());
import * as danger from "danger";
const dm = danger as any;

import { aeryn } from "../org/aeryn";

beforeEach(() => {
  dm.danger = {
    github: {
      pr: {
        user: {
          login: "a_new_user"
        }
      }
    }
  };
  dm.markdown = jest.fn();
});

const res = {
  data: {
    total_count: 1
  },
  meta: {}
};

it("doesn't do anything if the PR was closed without merging", () => {
  return aeryn().then(() => {
    expect(dm.markdown).not.toHaveBeenCalled();
  });
});

describe("a merged PR", () => {
  beforeEach(() => {
    dm.danger.github.pr.merged = true;
  });

  it("doesn't do anything if the user is a member", () => {
    dm.danger.github.api = {
      orgs: {
        checkMembership: async () => {}
      },
      search: {
        issues: () => Promise.resolve({ data: { total_count: 1 } })
      }
    };
    return aeryn().then(() => {
      expect(dm.markdown).not.toHaveBeenCalled();
    });
  });

  it("doesn't do anything if it is not the users first PR", () => {
    const inviteMock = jest.fn();
    dm.danger.github.api = {
      search: {
        issues: () => Promise.resolve({ data: { total_count: 2 } })
      },
      orgs: {
        checkMembership: async () => {
          throw new Error("Not a member");
        },
        addOrgMembership: inviteMock
      }
    };
    return aeryn().then(() => {
      expect(dm.markdown).not.toHaveBeenCalled();
    });
  });

  it("invites the user", () => {
    const inviteMock = jest.fn();
    dm.danger.github.api = {
      search: {
        issues: () => Promise.resolve({ data: { total_count: 1 } })
      },
      orgs: {
        checkMembership: async () => {
          throw new Error("Not a member");
        },
        addOrgMembership: inviteMock
      }
    };
    return aeryn().then(() => {
      expect(dm.markdown).toHaveBeenCalled();
      expect(inviteMock).toHaveBeenCalled();
    });
  });
});
