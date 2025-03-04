import { Router } from "../src/router";
import { add } from "../src/utils";

test("add test", () => {
  expect(add(3, 4)).toBe(7);
});

test("Valid route", () => {
  const testRouter = new Router();

  testRouter.get("/test", () => {});
  const route = testRouter.findRoute("/test", "GET");
  expect(route).toBeTruthy;
});

test("Invalid route", () => {
  const testRouter = new Router();

  const route = testRouter.findRoute("/test", "GET");
  expect(route).toBeNull;
});

test("Capture dynamic parameters", () => {
  const testRouter = new Router();

  testRouter.get("/test/:id", () => {});
  const route = testRouter.findRoute("/test/1", "GET");
  expect(route?.params?.id).toBe("1");
});

test("Capture query parameters", () => {
  const testRouter = new Router();

  testRouter.get("/test", () => {});
  const route = testRouter.findRoute("/test?testParam=yes", "GET");
  expect(route?.queryParams?.get("testParam")).toBe("yes");
});
