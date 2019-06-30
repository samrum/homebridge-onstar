import { mocked } from "ts-jest/utils";
import { EventEmitter } from "events";

import testConfig from "./testConfig.json";
import CommandDelegator from "../src/CommandDelegator";
import OnStarAccessory from "../src/OnStarAccessory";
jest.mock("../src/CommandDelegator");

let onStarAccessory: OnStarAccessory;

describe("OnStarAccessory", () => {
  beforeEach(() => {
    const mockCharacteristic = new EventEmitter();

    const HapService = {
      Switch: function(name: string) {
        return {
          getCharacteristic: function(hapCharacteristic: any) {
            return mockCharacteristic;
          },
        };
      },
    };

    const HapCharacteristic = {};

    onStarAccessory = new OnStarAccessory(
      HapService,
      HapCharacteristic,
      () => {},
      testConfig,
    );
  });

  test("getServices", () => {
    expect(onStarAccessory.getServices().length).toEqual(1);
  });

  test("climateServiceGet", done => {
    const errorMessage = "Climate Get Error";

    mocked(CommandDelegator.prototype.getClimateOn).mockImplementationOnce(
      async (reply: Function) => {
        reply(errorMessage, true);
      },
    );

    onStarAccessory
      .getServices()[0]
      .getCharacteristic()
      .emit("get", (error: string, newValue: boolean) => {
        expect(error).toEqual(errorMessage);
        expect(newValue).toBeTruthy();
        done();
      });
  });

  test("climateServiceSet", done => {
    const errorMessage = "Climate Set Error";

    mocked(CommandDelegator.prototype.setClimateOn).mockImplementationOnce(
      async (on: boolean, reply: Function) => {
        reply(errorMessage);
      },
    );

    onStarAccessory
      .getServices()[0]
      .getCharacteristic()
      .emit("set", true, (error: string) => {
        expect(error).toEqual(errorMessage);
        done();
      });
  });
});
