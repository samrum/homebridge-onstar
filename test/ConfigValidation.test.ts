import { isValidConfig } from "./../src/ConfigValidation";
import { OnStarAccessoryConfig, OnStarAccessoryConfigKey } from "../src/types";

let testAccessoryConfig: OnStarAccessoryConfig;

describe("isValidConfig", () => {
  beforeEach(() => {
    testAccessoryConfig = {
      [OnStarAccessoryConfigKey.DeviceId]:
        "742249ce-18e0-4c82-8bb2-9975367a7631",
      [OnStarAccessoryConfigKey.Vin]: "1G2ZF58B774109863",
      [OnStarAccessoryConfigKey.Username]: "foo@bar.com",
      [OnStarAccessoryConfigKey.Password]: "p@ssw0rd",
      [OnStarAccessoryConfigKey.OnStarPin]: "1234",
      [OnStarAccessoryConfigKey.Name]: "Car",
    };
  });

  test("Missing Required Key", () => {
    // @ts-ignore
    delete testAccessoryConfig[OnStarAccessoryConfigKey.DeviceId];

    expect(isValidConfig(testAccessoryConfig)).toEqual(false);
  });

  test("Invalid key", () => {
    testAccessoryConfig[OnStarAccessoryConfigKey.DeviceId] = "";

    expect(isValidConfig(testAccessoryConfig)).toEqual(false);
  });

  test("Valid Config", () => {
    expect(isValidConfig(testAccessoryConfig)).toEqual(true);
  });
});
