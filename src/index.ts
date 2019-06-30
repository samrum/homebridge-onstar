import OnStarAccessory from "./OnStarAccessory";

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
