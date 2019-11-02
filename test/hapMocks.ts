import { EventEmitter } from "events";

const HapCharacteristic = {
  On: {
    create() {
      return new EventEmitter();
    },
  },
  LockCurrentState: {
    UNSECURED: 0,
    SECURED: 1,
    create() {
      return new EventEmitter();
    },
  },
  LockTargetState: {
    UNSECURED: 10,
    SECURED: 11,
    create() {
      return new EventEmitter();
    },
  },
};

function mockService(name: string): any {
  return {
    name,
    characteristic: null,
    setCharacteristic() {},
    getCharacteristic(hapCharacteristic: any) {
      this.characteristic = hapCharacteristic.create();

      return this.characteristic;
    },
  };
}

const HapService = {
  Switch: mockService,
  LockMechanism: mockService,
};

export { HapCharacteristic, HapService };
