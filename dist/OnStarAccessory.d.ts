import { OnStarAccessoryConfig } from "./types";
declare class OnStarAccessory {
    private hapService;
    private hapCharacteristic;
    private log;
    private config;
    private services;
    private commandDelegator?;
    constructor(hapService: any, hapCharacteristic: any, log: Function, config: OnStarAccessoryConfig);
    getServices(): any[];
    private getSwitchService;
    private getDoorLockService;
}
export default OnStarAccessory;
