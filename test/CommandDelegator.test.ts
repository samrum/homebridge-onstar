import { mock, instance, when } from "ts-mockito";

import OnStar from "aonstarjs";
import { HapCharacteristic, HapService } from "./hapMocks";
import CommandDelegator from "../src/CommandDelegator";
jest.mock("onstarjs");
jest.mock("../src/utils");

let commandDelegator: CommandDelegator;
let onStarMock = mock(OnStar);
let onStarInstance = instance(onStarMock);

function createCommandDelegator(doorsDefaultToUnlocked: boolean = false) {
  return new CommandDelegator(
    onStarInstance,
    () => {},
    HapCharacteristic,
    doorsDefaultToUnlocked,
  );
}

const onStarJsResponseInProgress = {
  status: "success",
  response: {
    data: "In Progress",
  },
};

describe("CommandDelegator", () => {
  beforeEach(() => {
    commandDelegator = createCommandDelegator();
  });

  test("getFalse", (done) => {
    commandDelegator.getFalse("start", (error: string, value: boolean) => {
      expect(error).toBeNull();
      expect(value).toBeFalsy();
      done();
    });
  });

  test("getDoorLockCurrentState", (done) => {
    commandDelegator.getDoorLockCurrentState(
      (error: string | null, state: any) => {
        expect(error).toBeNull();
        expect(state).toEqual(HapCharacteristic.LockCurrentState.SECURED);
        done();
      },
    );
  });

  test("getDoorLockTargetState", (done) => {
    commandDelegator.getDoorLockTargetState(
      (error: string | null, state: any) => {
        expect(error).toBeNull();
        expect(state).toEqual(HapCharacteristic.LockTargetState.SECURED);
        done();
      },
    );
  });

  test("getDoorLockCurrentState - defaultUnlocked", (done) => {
    commandDelegator = createCommandDelegator(true);

    commandDelegator.getDoorLockCurrentState(
      (error: string | null, state: any) => {
        expect(error).toBeNull();
        expect(state).toEqual(HapCharacteristic.LockCurrentState.UNSECURED);
        done();
      },
    );
  });

  test("getDoorLockTargetState - defaultUnlocked", (done) => {
    commandDelegator = createCommandDelegator(true);

    commandDelegator.getDoorLockTargetState(
      (error: string | null, state: any) => {
        expect(error).toBeNull();
        expect(state).toEqual(HapCharacteristic.LockTargetState.UNSECURED);
        done();
      },
    );
  });

  test("setDoorLockTargetState - SECURED", (done) => {
    when(onStarMock.lockDoor()).thenResolve(onStarJsResponseInProgress);

    commandDelegator.setDoorLockTargetState(
      HapService.LockMechanism("lock"),
      HapCharacteristic.LockTargetState.SECURED,
      (error: string) => {
        expect(error).toBeNull();
        done();
      },
    );
  });

  test("setDoorLockTargetState - UNSECURED", (done) => {
    when(onStarMock.unlockDoor()).thenResolve(onStarJsResponseInProgress);

    commandDelegator.setDoorLockTargetState(
      HapService.LockMechanism("unlock"),
      HapCharacteristic.LockTargetState.UNSECURED,
      (error: string) => {
        expect(error).toBeNull();
        done();
      },
    );
  });

  test("setDoorLockTargetState - Error", (done) => {
    when(onStarMock.lockDoor()).thenThrow(
      new Error("setDoorLockTargetState Failure"),
    );

    commandDelegator.setDoorLockTargetState(
      HapService.LockMechanism("lock"),
      HapCharacteristic.LockTargetState.SECURED,
      (error: string) => {
        expect(error).toBeDefined;
        expect(error).not.toBeNull;
        done();
      },
    );
  });

  test("setSwitch - Start On", (done) => {
    when(onStarMock.start()).thenResolve(onStarJsResponseInProgress);

    commandDelegator.setSwitch("start", true, (error: string) => {
      expect(error).toBeNull();
      done();
    });
  });

  test("setSwitch - Start Off", (done) => {
    when(onStarMock.cancelStart()).thenResolve(onStarJsResponseInProgress);

    commandDelegator.setSwitch("start", false, (error: string) => {
      expect(error).toBeNull();
      done();
    });
  });

  test("setSwitch - Alert On", (done) => {
    when(onStarMock.alert()).thenResolve(onStarJsResponseInProgress);

    commandDelegator.setSwitch("alert", true, (error: string) => {
      expect(error).toBeNull();
      done();
    });
  });

  test("setSwitch - Alert Off", (done) => {
    when(onStarMock.cancelAlert()).thenResolve(onStarJsResponseInProgress);

    commandDelegator.setSwitch("alert", false, (error: string) => {
      expect(error).toBeNull();
      done();
    });
  });

  test("setSwitch - Charger On", (done) => {
    when(onStarMock.chargeOverride()).thenResolve(onStarJsResponseInProgress);

    commandDelegator.setSwitch("chargeOverride", true, (error: string) => {
      expect(error).toBeNull();
      done();
    });
  });

  test("setSwitch - Charger Off", (done) => {
    commandDelegator.setSwitch("chargeOverride", false, (error: string) => {
      expect(error).toEqual("chargeOverride: Off Method Not Available");
      done();
    });
  });

  test("setSwitchError", (done) => {
    when(onStarMock.start()).thenThrow(new Error("Start Failure"));

    commandDelegator.setSwitch("start", true, (error: string) => {
      expect(error).toBeDefined;
      expect(error).not.toBeNull;
      done();
    });
  });
});
