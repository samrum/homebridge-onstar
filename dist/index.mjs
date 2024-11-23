import OnStar from 'onstarjs2';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function pause(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

class CommandDelegator {
    constructor(onStar, log, hapCharacteristic, doorsDefaultToUnlocked) {
        this.onStar = onStar;
        this.log = log;
        this.hapCharacteristic = hapCharacteristic;
        this.doorsDefaultToUnlocked = doorsDefaultToUnlocked;
        this.doorLockCurrentState = this.getDefaultLockState(this.hapCharacteristic.LockCurrentState);
    }
    getFalse(_, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            reply(null, false);
        });
    }
    setSwitch(method, on, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!on) {
                if (method === "start") {
                    method = "cancelStart";
                }
                else if (method === "alert") {
                    method = "cancelAlert";
                }
                else {
                    reply(`${method}: Off Method Not Available`);
                    return;
                }
            }
            reply(yield this.makeRequest(method));
        });
    }
    getDoorLockCurrentState(reply) {
        return __awaiter(this, void 0, void 0, function* () {
            reply(null, this.doorLockCurrentState);
        });
    }
    getDoorLockTargetState(reply) {
        return __awaiter(this, void 0, void 0, function* () {
            reply(null, this.getDefaultLockState(this.hapCharacteristic.LockTargetState));
        });
    }
    setDoorLockTargetState(lockService, targetState, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const isLockTarget = targetState === this.hapCharacteristic.LockTargetState.SECURED;
            const method = isLockTarget ? "lockDoor" : "unlockDoor";
            const error = yield this.makeRequest(method);
            if (!error) {
                this.doorLockCurrentState = isLockTarget
                    ? this.hapCharacteristic.LockCurrentState.SECURED
                    : this.hapCharacteristic.LockCurrentState.UNSECURED;
            }
            reply(error);
            yield pause(5000);
            this.doorLockCurrentState = this.getDefaultLockState(this.hapCharacteristic.LockCurrentState);
        });
    }
    getDefaultLockState(hapCharacteristicState) {
        return this.doorsDefaultToUnlocked
            ? hapCharacteristicState.UNSECURED
            : hapCharacteristicState.SECURED;
    }
    makeRequest(method) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this.log(`${method}: Requested`);
            try {
                let result;
                result = yield this.onStar[method]();
                this.log(`${method}: Finished`, (_a = result.response) === null || _a === void 0 ? void 0 : _a.data);
                return null;
            }
            catch (e) {
                const errorMessage = `${method}: Error: ${e instanceof Error ? e.message : "unknown error"}`;
                this.log(errorMessage);
                return errorMessage;
            }
        });
    }
}

var OnStarAccessoryConfigKey;
(function (OnStarAccessoryConfigKey) {
    OnStarAccessoryConfigKey["DeviceId"] = "deviceId";
    OnStarAccessoryConfigKey["Vin"] = "vin";
    OnStarAccessoryConfigKey["Username"] = "username";
    OnStarAccessoryConfigKey["Password"] = "password";
    OnStarAccessoryConfigKey["OnStarPin"] = "onStarPin";
    OnStarAccessoryConfigKey["TOTPKEY"] = "onstarTOTP";
    OnStarAccessoryConfigKey["Name"] = "name";
    OnStarAccessoryConfigKey["EnableAlert"] = "enableAlert";
    OnStarAccessoryConfigKey["EnableCharger"] = "enableCharger";
    OnStarAccessoryConfigKey["EnableDoors"] = "enableDoors";
    OnStarAccessoryConfigKey["DoorsDefaultToUnlocked"] = "doorsDefaultToUnlocked";
})(OnStarAccessoryConfigKey || (OnStarAccessoryConfigKey = {}));

const REQUIRED_CONFIG_KEYS = [
    OnStarAccessoryConfigKey.DeviceId,
    OnStarAccessoryConfigKey.Vin,
    OnStarAccessoryConfigKey.Username,
    OnStarAccessoryConfigKey.Password,
    OnStarAccessoryConfigKey.OnStarPin,
    OnStarAccessoryConfigKey.TOTPKEY,
    OnStarAccessoryConfigKey.Name,
];
function isValidConfig(config, log = () => { }) {
    const missingRequiredKeys = [];
    REQUIRED_CONFIG_KEYS.forEach((reqConfigKey) => {
        if (typeof config[reqConfigKey] !== "string" ||
            config[reqConfigKey] === "") {
            missingRequiredKeys.push(reqConfigKey);
        }
    });
    if (missingRequiredKeys.length) {
        missingRequiredKeys.forEach((key) => log(`Config Error: Invalid or missing value for ${key}`));
        return false;
    }
    return true;
}

class OnStarAccessory {
    constructor(hapService, hapCharacteristic, log, config) {
        this.hapService = hapService;
        this.hapCharacteristic = hapCharacteristic;
        this.log = log;
        this.config = config;
        this.services = [];
        if (!isValidConfig(config, log)) {
            log("Config Error: The provided configuration is not valid.");
            return;
        }
        this.commandDelegator = new CommandDelegator(OnStar.create({
            deviceId: this.config.deviceId,
            vin: this.config.vin,
            username: this.config.username,
            password: this.config.password,
            onStarPin: this.config.onStarPin,
            totpKey: this.config.onStarTOTP,
            checkRequestStatus: false,
        }), this.log, this.hapCharacteristic, this.config.doorsDefaultToUnlocked || false);
        const name = this.config.name;
        this.services.push(this.getSwitchService(`${name} Climate`, "start"));
        if (this.config.enableAlert) {
            this.services.push(this.getSwitchService(`${name} Alert`, "alert"));
        }
        if (this.config.enableCharger) {
            this.services.push(this.getSwitchService(`${name} Charger`, "chargeOverride"));
        }
        if (this.config.enableDoors) {
            this.services.push(this.getDoorLockService(`${name} Doors`));
        }
    }
    getServices() {
        return this.services;
    }
    getSwitchService(name, method) {
        const service = new this.hapService.Switch(name, method);
        if (!this.commandDelegator) {
            return service;
        }
        service
            .getCharacteristic(this.hapCharacteristic.On)
            .on("get", this.commandDelegator.getFalse.bind(this.commandDelegator, method))
            .on("set", this.commandDelegator.setSwitch.bind(this.commandDelegator, method));
        return service;
    }
    getDoorLockService(name) {
        const service = new this.hapService.LockMechanism(name, "doors");
        if (!this.commandDelegator) {
            return service;
        }
        service
            .getCharacteristic(this.hapCharacteristic.LockCurrentState)
            .on("get", this.commandDelegator.getDoorLockCurrentState.bind(this.commandDelegator));
        service
            .getCharacteristic(this.hapCharacteristic.LockTargetState)
            .on("get", this.commandDelegator.getDoorLockTargetState.bind(this.commandDelegator))
            .on("set", this.commandDelegator.setDoorLockTargetState.bind(this.commandDelegator, service));
        return service;
    }
}

function HomebridgeOnStar(homebridge) {
    homebridge.registerAccessory("homebridge-onstar2", "OnStar", OnStarAccessory.bind(OnStarAccessory, homebridge.hap.Service, homebridge.hap.Characteristic));
}

export { HomebridgeOnStar as default };
