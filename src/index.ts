import OnStarAccessory from "./OnStarAccessory";

export default function(homebridge: any) {
  homebridge.registerAccessory(
    "homebridge-onstar",
    "OnStar",
    OnStarAccessory.bind(homebridge.hap.Service, homebridge.hap.Characteristic),
  );
}
