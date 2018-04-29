jest.mock("danger", () => jest.fn());
import * as danger from "danger";
const dm = danger as any;

import { labeler } from "../org/labeler";

beforeEach(() => {
  dm.danger = {
    github: {
      api: {
        issues: {
          addLabels: jest.fn()
        }
      },
      repository: {
        name: "Repo",
        owner: {
          login: "Owner"
        }
      },
      issue: {
        number: 100
      }
    }
  };
});

describe("a new issue that ends in a question mark", () => {
  it("labels issue as a question", () => {
    dm.danger.github.issue.title = "This is a question?";
    return labeler().then(() => {
      expect(dm.danger.github.api.issues.addLabels).toBeCalledWith({
        repo: "Repo",
        owner: "Owner",
        number: 100,
        labels: ["question"]
      });
    });
  });
});

describe("a new issue that starts with a question keyword", () => {
  it("labels the issue as a question", () => {
    dm.danger.github.issue.title = "How does Moya work";
    return labeler().then(() => {
      expect(dm.danger.github.api.issues.addLabels).toBeCalledWith({
        repo: "Repo",
        owner: "Owner",
        number: 100,
        labels: ["question"]
      });
    });
  });
});

describe("a new issue that starts with an enhancement keyword", () => {
  it("labels the issue as enhancement", () => {
    dm.danger.github.issue.title = "Allow us to conquer the world";
    return labeler().then(() => {
      expect(dm.danger.github.api.issues.addLabels).toBeCalledWith({
        repo: "Repo",
        owner: "Owner",
        number: 100,
        labels: ["enhancement"]
      });
    });
  });
});

describe("a new issue that contains a rxmoya keyword", () => {
  it("labels the issue as rxmoya", () => {
    dm.danger.github.issue.title = "Moya and RxSwift are awesome";
    return labeler().then(() => {
      expect(dm.danger.github.api.issues.addLabels).toBeCalledWith({
        repo: "Repo",
        owner: "Owner",
        number: 100,
        labels: ["rxmoya"]
      });
    });
  });
});

describe("a new issue that contains a reactivemoya keyword", () => {
  it("labels the issue as reactivemoya", () => {
    dm.danger.github.issue.title = "Moya and ReactiveSwift are awesome";
    return labeler().then(() => {
      expect(dm.danger.github.api.issues.addLabels).toBeCalledWith({
        repo: "Repo",
        owner: "Owner",
        number: 100,
        labels: ["reactivemoya"]
      });
    });
  });
});

describe("a new issue that contains a Swift Package Manager keyword", () => {
  it("labels the issue as spm", () => {
    dm.danger.github.issue.title = "Please add SPM support";
    return labeler().then(() => {
      expect(dm.danger.github.api.issues.addLabels).toBeCalledWith({
        repo: "Repo",
        owner: "Owner",
        number: 100,
        labels: ["spm"]
      });
    });
  });
});

describe("a new issue that contains a documentation keyword", () => {
  it("labels the issue as documentation", () => {
    dm.danger.github.issue.title = "The documentation is out of date";
    return labeler().then(() => {
      expect(dm.danger.github.api.issues.addLabels).toBeCalledWith({
        repo: "Repo",
        owner: "Owner",
        number: 100,
        labels: ["documentation"]
      });
    });
  });
});

describe("a new issue that contains a CocoaPods keyword", () => {
  it("labels the issue as cocoapods", () => {
    dm.danger.github.issue.title = "Moya CocoaPods are awesome";
    return labeler().then(() => {
      expect(dm.danger.github.api.issues.addLabels).toBeCalledWith({
        repo: "Repo",
        owner: "Owner",
        number: 100,
        labels: ["cocoapods"]
      });
    });
  });
});

describe("a new issue that contains a carthage keyword", () => {
  it("labels the issue as carthage", () => {
    dm.danger.github.issue.title = "Moya and Carthage are awesome";
    return labeler().then(() => {
      expect(dm.danger.github.api.issues.addLabels).toBeCalledWith({
        repo: "Repo",
        owner: "Owner",
        number: 100,
        labels: ["carthage"]
      });
    });
  });
});

describe("a new issue that contains a bug keyword", () => {
  it("labels the issue as bug?", () => {
    dm.danger.github.issue.title = "There is a memory leak somewhere";
    return labeler().then(() => {
      expect(dm.danger.github.api.issues.addLabels).toBeCalledWith({
        repo: "Repo",
        owner: "Owner",
        number: 100,
        labels: ["bug?"]
      });
    });
  });
});

describe("a new issue that does not contain any label keywords", () => {
  it("does not add any labels", () => {
    dm.danger.github.issue.title = "Not a question";
    return labeler().then(() => {
      expect(dm.danger.github.api.issues.addLabels).not.toBeCalled();
    });
  });
});
