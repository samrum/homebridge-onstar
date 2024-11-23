import OnStar from "aonstarjs";
import CommandDelegator from "./CommandDelegator";
import { isValidConfig } from "./ConfigValidation";
import { OnStarJsMethod, OnStarAccessoryConfig } from "./types";

class OnStarAccessory {
  private services: any[] = [];
  private commandDelegator?: CommandDelegator;

  constructor(
    private hapService: any,
    private hapCharacteristic: any,
    private log: Function,
    private config: OnStarAccessoryConfig,
  ) {
    if (!isValidConfig(config, log)) {
      log("Config Error: The provided configuration is not valid.");

      return;
    }

    this.commandDelegator = new CommandDelegator(
      OnStar.create({
        deviceId: this.config.deviceId,
        vin: this.config.vin,
        username: this.config.username,
        password: this.config.password,
        onStarPin: this.config.onStarPin,
        TOTPKEY: this.config.TOTPKEY,
        checkRequestStatus: false,
      }),
      this.log,
      this.hapCharacteristic,
      this.config.doorsDefaultToUnlocked || false,
    );

    const name = this.config.name;

    this.services.push(this.getSwitchService(`${name} Climate`, "start"));

    if (this.config.enableAlert) {
      this.services.push(this.getSwitchService(`${name} Alert`, "alert"));
    }

    if (this.config.enableCharger) {
      this.services.push(
        this.getSwitchService(`${name} Charger`, "chargeOverride"),
      );
    }

    if (this.config.enableDoors) {
      this.services.push(this.getDoorLockService(`${name} Doors`));
    }
  }

  getServices() {
    return this.services;
  }

  private getSwitchService(name: string, method: OnStarJsMethod) {
    const service = new this.hapService.Switch(name, method);

    if (!this.commandDelegator) {
      return service;
    }

    service
      .getCharacteristic(this.hapCharacteristic.On)
      .on(
        "get",
        this.commandDelegator.getFalse.bind(this.commandDelegator, method),
      )
      .on(
        "set",
        this.commandDelegator.setSwitch.bind(this.commandDelegator, method),
      );

    return service;
  }

  private getDoorLockService(name: string) {
    const service = new this.hapService.LockMechanism(name, "doors");

    if (!this.commandDelegator) {
      return service;
    }

    service
      .getCharacteristic(this.hapCharacteristic.LockCurrentState)
      .on(
        "get",
        this.commandDelegator.getDoorLockCurrentState.bind(
          this.commandDelegator,
        ),
      );

    service
      .getCharacteristic(this.hapCharacteristic.LockTargetState)
      .on(
        "get",
        this.commandDelegator.getDoorLockTargetState.bind(
          this.commandDelegator,
        ),
      )
      .on(
        "set",
        this.commandDelegator.setDoorLockTargetState.bind(
          this.commandDelegator,
          service,
        ),
      );

    return service;
  }
}

export default OnStarAccessory;
