import { OnStarAccessoryConfig, OnStarAccessoryConfigKey } from "./types";

const REQUIRED_CONFIG_KEYS = [
  OnStarAccessoryConfigKey.DeviceId,
  OnStarAccessoryConfigKey.Vin,
  OnStarAccessoryConfigKey.Username,
  OnStarAccessoryConfigKey.Password,
  OnStarAccessoryConfigKey.OnStarPin,
  OnStarAccessoryConfigKey.Name,
];

export function isValidConfig(
  config: OnStarAccessoryConfig,
  log: Function = () => {},
) {
  const missingRequiredKeys: string[] = [];

  REQUIRED_CONFIG_KEYS.forEach((reqConfigKey) => {
    if (
      typeof config[reqConfigKey] !== "string" ||
      config[reqConfigKey] === ""
    ) {
      missingRequiredKeys.push(reqConfigKey);
    }
  });

  if (missingRequiredKeys.length) {
    missingRequiredKeys.forEach((key) =>
      log(`Config Error: Invalid or missing value for ${key}`),
    );

    return false;
  }

  return true;
}
