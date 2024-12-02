import OnStar from "onstarjs2";
import { OnStarJsMethod } from "./types";
declare class CommandDelegator {
    private onStar;
    private log;
    private hapCharacteristic;
    private doorsDefaultToUnlocked;
    private doorLockCurrentState;
    constructor(onStar: OnStar, log: Function, hapCharacteristic: any, doorsDefaultToUnlocked: boolean);
    getFalse(_: OnStarJsMethod, reply: Function): Promise<void>;
    setSwitch(method: OnStarJsMethod, on: boolean, reply: Function): Promise<void>;
    getDoorLockCurrentState(reply: Function): Promise<void>;
    getDoorLockTargetState(reply: Function): Promise<void>;
    setDoorLockTargetState(lockService: any, targetState: any, reply: Function): Promise<void>;
    private getDefaultLockState;
    private makeRequest;
}
export default CommandDelegator;
