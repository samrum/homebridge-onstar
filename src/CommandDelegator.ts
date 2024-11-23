import OnStar from "aonstarjs";
import { Result } from "aonstarjs/dist/types";
import { OnStarJsMethod } from "./types";
import { pause } from "./utils";

class CommandDelegator {
  private doorLockCurrentState: number;

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

    reply(await this.makeRequest(method));
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

    const error = await this.makeRequest(method);

    if (!error) {
      this.doorLockCurrentState = isLockTarget
        ? this.hapCharacteristic.LockCurrentState.SECURED
        : this.hapCharacteristic.LockCurrentState.UNSECURED;
    }

    reply(error);

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

  private async makeRequest(method: OnStarJsMethod): Promise<string | null> {
    this.log(`${method}: Requested`);

    try {
      let result: Result;

      result = await this.onStar[method]();

      this.log(`${method}: Finished`, result.response?.data);

      return null;
    } catch (e) {
      const errorMessage = `${method}: Error: ${
        e instanceof Error ? e.message : "unknown error"
      }`;

      this.log(errorMessage);

      return errorMessage;
    }
  }
}

export default CommandDelegator;
