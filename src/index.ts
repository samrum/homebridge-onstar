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
    this.commandDelegator = new CommandDelegator(config, log);
    this.services.push(this.createClimateService());
  }

  getServices() {
    return this.services;
  }

  private createClimateService() {
    const climateService = new Service.Switch(this.config.name);

    climateService
      .getCharacteristic(Characteristic.On)
      .on("get", this.commandDelegator.getClimateOn.bind(this.commandDelegator))
      .on(
        "set",
        this.commandDelegator.setClimateOn.bind(this.commandDelegator),
      );

    return climateService;
  }
}
