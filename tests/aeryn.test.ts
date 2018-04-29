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
      }
    };
    return aeryn().then(() => {
      expect(dm.markdown).not.toHaveBeenCalled();
    });
  });

  it("invites the user", () => {
    const inviteMock = jest.fn();
    dm.danger.github.api = {
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
