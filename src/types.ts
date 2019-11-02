export type OnStarJsMethod =
  | "start"
  | "cancelStart"
  | "lockDoor"
  | "unlockDoor"
  | "alert"
  | "cancelAlert"
  | "chargeOverride";

export interface OnStarAccessoryConfig {
  deviceId: string;
  vin: string;
  username: string;
  password: string;
  onStarPin: string;
  name: string;
  enableAlert?: boolean;
  enableCharger?: boolean;
  enableDoors?: boolean;
  doorsDefaultToUnlocked?: boolean;
}
