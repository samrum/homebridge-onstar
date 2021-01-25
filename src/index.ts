import OnStarAccessory from "./OnStarAccessory";
import { OnStarAccessoryConfig } from "./types";

export default function HomebridgeOnStar(homebridge: any) {
  homebridge.registerAccessory(
    "homebridge-onstar",
    "OnStar",
    OnStarAccessory.bind(
      OnStarAccessory,
      homebridge.hap.Service,
      homebridge.hap.Characteristic,
    ),
  );
}
