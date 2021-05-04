import OnStar from "onstarjs";
import {
  CommandResponse,
  DiagnosticResponseItem,
  DiagnosticsRequestOptions,
  Result,
} from "onstarjs/dist/types";
import { DiagnosticInfo, OnStarJsMethod } from "./types";
import { getDiagnosticItem, pause } from "./utils";

class CommandDelegator {
  private doorLockCurrentState: number;
  private diagnosticCache: DiagnosticInfo = {
    batteryLevel: 0,
    chargingState: 0,
    lowBattery: false,
    timestamp: 0,
  };
  private diagnosticCacheUpdatingPromise: Promise<DiagnosticInfo> | undefined;

  constructor(
    private onStar: OnStar,
    private log: Function,
    private hapCharacteristic: any,
    private doorsDefaultToUnlocked: boolean,
  ) {
    this.doorLockCurrentState = this.getDefaultLockState(
      this.hapCharacteristic.LockCurrentState,
    );
  }

  async getFalse(_: OnStarJsMethod, reply: Function) {
    reply(null, false);
  }

  async setSwitch(method: OnStarJsMethod, on: boolean, reply: Function) {
    if (!on) {
      if (method === "start") {
        method = "cancelStart";
      } else if (method === "alert") {
        method = "cancelAlert";
      } else {
        reply(`${method}: Off Method Not Available`);

        return;
      }
    }

    try {
      await this.makeRequest(method);
      reply(null);
    } catch (e) {
      reply(e.message);
    }
  }

  async getDoorLockCurrentState(reply: Function) {
    reply(null, this.doorLockCurrentState);
  }

  async getDoorLockTargetState(reply: Function) {
    reply(
      null,
      this.getDefaultLockState(this.hapCharacteristic.LockTargetState),
    );
  }

  async setDoorLockTargetState(
    lockService: any,
    targetState: any,
    reply: Function,
  ) {
    const isLockTarget =
      targetState === this.hapCharacteristic.LockTargetState.SECURED;

    const method = isLockTarget ? "lockDoor" : "unlockDoor";

    try {
      await this.makeRequest(method);
    } catch (e) {
      reply(e.message);
      return;
    }

    this.doorLockCurrentState = isLockTarget
      ? this.hapCharacteristic.LockCurrentState.SECURED
      : this.hapCharacteristic.LockCurrentState.UNSECURED;

    reply(null);

    await pause(5000);

    this.doorLockCurrentState = this.getDefaultLockState(
      this.hapCharacteristic.LockCurrentState,
    );
  }

  private getDefaultLockState(hapCharacteristicState: any) {
    return this.doorsDefaultToUnlocked
      ? hapCharacteristicState.UNSECURED
      : hapCharacteristicState.SECURED;
  }

  async getBatteryLevel(service: any, reply: Function) {
    reply(null, this.diagnosticCache.batteryLevel);

    const characteristic = service.getCharacteristic(
      this.hapCharacteristic.BatteryLevel,
    );

    try {
      const { batteryLevel } = await this.getDiagnosticInfo();

      characteristic.updateValue(batteryLevel);
    } catch (e) {
      characteristic.updateValue(e);
    }
  }

  async getChargingState(service: any, reply: Function) {
    reply(null, this.diagnosticCache.chargingState);

    const characteristic = service.getCharacteristic(
      this.hapCharacteristic.ChargingState,
    );

    try {
      const { chargingState } = await this.getDiagnosticInfo();

      characteristic.updateValue(chargingState);
    } catch (e) {
      characteristic.updateValue(e);
    }
  }

  async getStatusLowBattery(service: any, reply: Function) {
    reply(null, this.diagnosticCache.lowBattery);

    const characteristic = service.getCharacteristic(
      this.hapCharacteristic.StatusLowBattery,
    );

    try {
      const { lowBattery } = await this.getDiagnosticInfo();

      characteristic.updateValue(lowBattery);
    } catch (e) {
      characteristic.updateValue(e);
    }
  }

  private async getDiagnosticInfo(): Promise<DiagnosticInfo> {
    if (Date.now() - this.diagnosticCache.timestamp < 60 * 5 * 1000) {
      return this.diagnosticCache;
    }

    if (this.diagnosticCacheUpdatingPromise) {
      return await this.diagnosticCacheUpdatingPromise;
    }

    this.diagnosticCacheUpdatingPromise = new Promise(
      async (resolve, reject) => {
        let diagnosticResponse: DiagnosticResponseItem[] = [];

        try {
          diagnosticResponse = await this.makeDiagnosticsRequest();
        } catch (e) {
          reject(e);

          this.diagnosticCacheUpdatingPromise = undefined;
          return;
        }

        const batteryLevel = getDiagnosticItem(
          "EV BATTERY LEVEL",
          diagnosticResponse,
        );

        const batteryLevelValue = Number(batteryLevel?.value ?? 0);

        this.diagnosticCache.lowBattery = batteryLevelValue < 20;
        this.diagnosticCache.batteryLevel = batteryLevelValue;

        const chargingState = getDiagnosticItem(
          "EV CHARGE STATE",
          diagnosticResponse,
        );

        const chargingStateValue =
          chargingState?.value === "charging"
            ? this.hapCharacteristic.ChargingState.CHARGING
            : this.hapCharacteristic.ChargingState.NOT_CHARGING;

        this.diagnosticCache.chargingState = chargingStateValue;

        this.diagnosticCache.timestamp = Date.now();

        resolve(this.diagnosticCache);

        this.diagnosticCacheUpdatingPromise = undefined;
      },
    );

    return this.diagnosticCacheUpdatingPromise;
  }

  private async makeDiagnosticsRequest(): Promise<DiagnosticResponseItem[]> {
    this.onStar.setCheckRequestStatus(true);

    const commandResponse = await this.makeRequest("diagnostics", {
      // @ts-ignore - Enums from onstarjs aren't bundled correctly
      diagnosticItem: ["EV BATTERY LEVEL", "EV CHARGE STATE"],
    });

    this.onStar.setCheckRequestStatus(false);

    if (!commandResponse.body?.diagnosticResponse) {
      throw new Error("Failed to retrieve diagnostic response");
    }

    return commandResponse.body.diagnosticResponse;
  }

  private async makeRequest(
    method: OnStarJsMethod,
    methodOptions?: DiagnosticsRequestOptions,
  ): Promise<CommandResponse> {
    this.log(`${method}: Requested`);

    try {
      let result: Result;

      // @ts-ignore - Method parameter mapping with options isn't working
      result = await this.onStar[method](methodOptions);

      this.log(`${method}: Finished`, result.response?.data);

      if (typeof result.response?.data === "undefined") {
        throw new Error(`${method} failed: No Response`);
      }

      if (typeof result.response.data === "string") {
        throw new Error(`${method} failed: ${result.response?.data}`);
      }

      if (typeof result.response.data.commandResponse === "undefined") {
        throw new Error(`${method} failed: No Command Response`);
      }

      return result.response?.data.commandResponse;
    } catch (e) {
      const errorMessage = `${method}: Error: ${e.message}`;

      this.log(errorMessage);

      throw new Error(errorMessage);
    }
  }
}

export default CommandDelegator;
