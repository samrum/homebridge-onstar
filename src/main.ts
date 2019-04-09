import OnStar from "onstarjs";

export default function(homebridge: any) {
  homebridge.registerAccessory(
    "homebridge-onstar",
    "OnStar",
    OnStarAccessory.bind(homebridge.hap.Service, homebridge.hap.Characteristic),
  );
}

export class OnStarAccessory {
  private services: any[] = [];
  private onStar: OnStar;

  constructor(
    private log: Function,
    private config: any,
    private homebridgeService: any,
    private homebridgeCharacteristic: any,
  ) {
    this.services.push(this.createClimateService());

    this.onStar = OnStar.create(config);
  }

  setOnStar(onStar: OnStar) {
    this.onStar = onStar;
  }

  getServices() {
    return this.services;
  }

  async getClimateOn(reply: Function) {
    const climateState = false;

    this.log("getClimateOn: Climate State: ", climateState ? "on" : "off");

    reply(null, climateState);
  }

  async setClimateOn(on: boolean, reply: Function) {
    this.log("setClimateOn: Turning on", on);

    try {
      this.log("setClimateOn: Requesting Remote Start");
      const response = await this.onStar.remoteStart();
      this.log("setClimateOn: Remote Start Finished", response.data);

      reply();
    } catch (e) {
      if (e.response) {
        this.log(`Error: ${e.response.status} - ${e.response.statusText}`);
      } else if (e.request) {
        this.log("Error: API returned no response");
      } else {
        this.log("Error:", e.message);
      }

      reply("Failed to start due to error");
    }
  }

  private createClimateService() {
    const climateService = new this.homebridgeService.Switch(this.config.name);

    climateService
      .getCharacteristic(this.homebridgeCharacteristic.On)
      .on("get", this.getClimateOn.bind(this))
      .on("set", this.setClimateOn.bind(this));

    return climateService;
  }
}
