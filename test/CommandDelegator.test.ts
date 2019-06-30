import { mock, instance, when, anyString, anything } from "ts-mockito";

import { mocked } from "ts-jest/utils";
import OnStar from "onstarjs";
import CommandDelegator from "../src/CommandDelegator";
jest.mock("onstarjs");

const config = {
  deviceId: "742249ce-18e0-4c82-8bb2-9975367a7631",
  vin: "1G2ZF58B774109863",
  username: "foo@bar.com",
  password: "p@ssw0rd",
  onStarPin: "1234",
};

let commandDelegator: CommandDelegator;
let onStarMock = mock(OnStar);
let onStarInstance = instance(onStarMock);

describe("OnStarAccessory", () => {
  beforeEach(() => {
    mocked(OnStar.create).mockReturnValue(onStarInstance);
    commandDelegator = new CommandDelegator(config, () => {});
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
    when(onStarMock.start()).thenThrow(new Error("Start Failure"));

    commandDelegator.setClimateOn(true, (error: string) => {
      expect(error).toEqual("Error: Start Failure");
      done();
    });
  });
});
