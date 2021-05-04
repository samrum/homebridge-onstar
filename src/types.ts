export type OnStarJsMethod =
  | "start"
  | "cancelStart"
  | "lockDoor"
  | "unlockDoor"
  | "alert"
  | "cancelAlert"
  | "chargeOverride"
  | "diagnostics";

export enum OnStarAccessoryConfigKey {
  DeviceId = "deviceId",
  Vin = "vin",
  Username = "username",
  Password = "password",
  OnStarPin = "onStarPin",
  Name = "name",
  EnableAlert = "enableAlert",
  EnableBattery = "enableBattery",
  EnableCharger = "enableCharger",
  EnableDoors = "enableDoors",
  DoorsDefaultToUnlocked = "doorsDefaultToUnlocked",
}

export type OnStarAccessoryConfig = {
  [OnStarAccessoryConfigKey.DeviceId]: string;
  [OnStarAccessoryConfigKey.Vin]: string;
  [OnStarAccessoryConfigKey.Username]: string;
  [OnStarAccessoryConfigKey.Password]: string;
  [OnStarAccessoryConfigKey.OnStarPin]: string;
  [OnStarAccessoryConfigKey.Name]: string;
  [OnStarAccessoryConfigKey.EnableAlert]?: boolean;
  [OnStarAccessoryConfigKey.EnableBattery]?: boolean;
  [OnStarAccessoryConfigKey.EnableCharger]?: boolean;
  [OnStarAccessoryConfigKey.EnableDoors]?: boolean;
  [OnStarAccessoryConfigKey.DoorsDefaultToUnlocked]?: boolean;
};

export interface DiagnosticInfo {
  batteryLevel: number;
  chargingState: number;
  lowBattery: boolean;
  timestamp: number;
}
