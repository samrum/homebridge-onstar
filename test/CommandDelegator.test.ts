import { mock, instance, when } from "ts-mockito";
import { mocked } from "ts-jest/utils";

import testConfig from "./testConfig.json";
import OnStar from "onstarjs";
import CommandDelegator from "../src/CommandDelegator";
jest.mock("onstarjs");

let commandDelegator: CommandDelegator;
let onStarMock = mock(OnStar);
let onStarInstance = instance(onStarMock);

describe("OnStarAccessory", () => {
  beforeEach(() => {
    mocked(OnStar.create).mockReturnValue(onStarInstance);
    commandDelegator = new CommandDelegator(testConfig, () => {});
  });

  test("getClimateOn", done => {
    commandDelegator.getClimateOn((error: string, newValue: boolean) => {
      expect(error).toBeNull();
      expect(newValue).toBeFalsy();
      done();
    });
  });

  test("setClimateOn", done => {
    when(onStarMock.start()).thenResolve({
      status: "success",
      response: {
        data: {
          status: "In Progress",
        },
      },
    });

    commandDelegator.setClimateOn(true, (error: string) => {
      expect(error).toBeNull();
      done();
    });
  });

  test("setClimateOnError", done => {
    const errorMessage = "Start Failure";

    when(onStarMock.start()).thenThrow(new Error(errorMessage));

    commandDelegator.setClimateOn(true, (error: string) => {
      expect(error).toBeDefined;
      expect(error).not.toBeNull;
      done();
    });
  });
});
