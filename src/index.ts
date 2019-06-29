import OnStar from "onstarjs";

let Service: any, Characteristic: any;

export default function(homebridge: any) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;

  homebridge.registerAccessory("homebridge-onstar", "OnStar", OnStarAccessory);
}

class OnStarAccessory {
  private services: any[] = [];
  private onStar: OnStar;

  constructor(private log: Function, private config: any) {
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
      const result = await this.onStar.start();
      this.log("setClimateOn: Remote Start Finished", result.response.data);

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
    const climateService = new Service.Switch(this.config.name);

    climateService
      .getCharacteristic(Characteristic.On)
      .on("get", this.getClimateOn.bind(this))
      .on("set", this.setClimateOn.bind(this));

    return climateService;
  }
}
