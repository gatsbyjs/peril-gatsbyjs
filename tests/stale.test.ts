jest.mock("danger", () => jest.fn());
// import { IssueComment } from "github-webhook-event-types";
// import * as danger from "danger";
// const dm = danger as any;

import { dateDaysAgo } from "../tasks/stale";

// beforeEach(() => {
//   dm.danger = {
//     github: {}
//   };
// });

describe("date handling", () => {
  it("subtracts one day", () => {
    const dateToday = new Date(2015, 4, 21);
    const formatted = dateDaysAgo(dateToday, 1);
    expect(formatted).toEqual(`2015-05-20`);
  });
  it("subtracts across months", () => {
    const dateToday = new Date(2015, 4, 21);
    const formatted = dateDaysAgo(dateToday, 22);
    expect(formatted).toEqual(`2015-04-29`);
  });
  it("subtracts across years", () => {
    const dateToday = new Date(2015, 0, 21);
    const formatted = dateDaysAgo(dateToday, 21);
    expect(formatted).toEqual(`2014-12-31`);
  });
});
