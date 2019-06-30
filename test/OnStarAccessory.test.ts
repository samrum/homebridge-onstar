import { mocked } from "ts-jest/utils";
import { EventEmitter } from "events";

import CommandDelegator from "../src/CommandDelegator";
import OnStarAccessory from "../src/OnStarAccessory";
jest.mock("../src/CommandDelegator");

const config = {
  deviceId: "742249ce-18e0-4c82-8bb2-9975367a7631",
  vin: "1G2ZF58B774109863",
  username: "foo@bar.com",
  password: "p@ssw0rd",
  onStarPin: "1234",
};

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
      config,
    );
  });

  test("getServices", () => {
    expect(onStarAccessory.getServices().length).toEqual(1);
  });

  test("climateServiceGet", done => {
    mocked(CommandDelegator.prototype.getClimateOn).mockImplementationOnce(
      async (reply: Function) => {
        reply("Climate Get Error", true);
      },
    );

    onStarAccessory
      .getServices()[0]
      .getCharacteristic()
      .emit("get", (error: string, newValue: boolean) => {
        expect(error).toEqual("Climate Get Error");
        expect(newValue).toBeTruthy();
        done();
      });
  });

  test("climateServiceSet", done => {
    mocked(CommandDelegator.prototype.setClimateOn).mockImplementationOnce(
      async (on: boolean, reply: Function) => {
        reply("Climate Set Error");
      },
    );

    onStarAccessory
      .getServices()[0]
      .getCharacteristic()
      .emit("set", true, (error: string) => {
        expect(error).toEqual("Climate Set Error");
        done();
      });
  });
});
