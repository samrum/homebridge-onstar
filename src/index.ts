import CommandDelegator from "./CommandDelegator";

let Service: any, Characteristic: any;

export default function(homebridge: any) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;

  homebridge.registerAccessory("homebridge-onstar", "OnStar", OnStarAccessory);
}

class OnStarAccessory {
  private services: any[] = [];
  private commandDelegator: CommandDelegator;

  constructor(private log: Function, private config: any) {
    this.services.push(this.createClimateService());

    this.commandDelegator = new CommandDelegator(config, log);
  }

  getServices() {
    return this.services;
  }

  private createClimateService() {
    const climateService = new Service.Switch(this.config.name);

    climateService
      .getCharacteristic(Characteristic.On)
      .on("get", this.commandDelegator.getClimateOn.bind(this))
      .on("set", this.commandDelegator.setClimateOn.bind(this));

    return climateService;
  }
}
