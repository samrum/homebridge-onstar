import CommandDelegator from "./CommandDelegator";

class OnStarAccessory {
  private services: any[] = [];
  private commandDelegator: CommandDelegator;

  constructor(
    private hapService: any,
    private hapCharacteristic: any,
    private log: Function,
    private config: any,
  ) {
    this.commandDelegator = new CommandDelegator(config, log);
    this.services.push(this.createClimateService());
  }

  getServices() {
    return this.services;
  }

  private createClimateService() {
    const climateService = new this.hapService.Switch(this.config.name);

    climateService
      .getCharacteristic(this.hapCharacteristic.On)
      .on("get", this.commandDelegator.getClimateOn.bind(this.commandDelegator))
      .on(
        "set",
        this.commandDelegator.setClimateOn.bind(this.commandDelegator),
      );

    return climateService;
  }
}

export default OnStarAccessory;
