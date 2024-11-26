export type OnStarJsMethod = "start" | "cancelStart" | "lockDoor" | "unlockDoor" | "alert" | "cancelAlert" | "chargeOverride";
export declare enum OnStarAccessoryConfigKey {
    DeviceId = "deviceId",
    Vin = "vin",
    Username = "username",
    Password = "password",
    OnStarPin = "onStarPin",
    Totpkey = "totpKey",
    Name = "name",
    EnableAlert = "enableAlert",
    EnableCharger = "enableCharger",
    EnableDoors = "enableDoors",
    DoorsDefaultToUnlocked = "doorsDefaultToUnlocked"
}
export type OnStarAccessoryConfig = {
    [OnStarAccessoryConfigKey.DeviceId]: string;
    [OnStarAccessoryConfigKey.Vin]: string;
    [OnStarAccessoryConfigKey.Username]: string;
    [OnStarAccessoryConfigKey.Password]: string;
    [OnStarAccessoryConfigKey.OnStarPin]: string;
    [OnStarAccessoryConfigKey.Totpkey]: string;
    [OnStarAccessoryConfigKey.Name]: string;
    [OnStarAccessoryConfigKey.EnableAlert]?: boolean;
    [OnStarAccessoryConfigKey.EnableCharger]?: boolean;
    [OnStarAccessoryConfigKey.EnableDoors]?: boolean;
    [OnStarAccessoryConfigKey.DoorsDefaultToUnlocked]?: boolean;
};
