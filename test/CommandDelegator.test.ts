import { mock, instance, when } from "ts-mockito";

import OnStar from "onstarjs";
import { HapCharacteristic, HapService } from "./hapMocks";
import CommandDelegator from "../src/CommandDelegator";
jest.mock("onstarjs");

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

describe("CommandDelegator", () => {
  beforeEach(() => {
    commandDelegator = createCommandDelegator();
  });

  test("getFalse", done => {
    commandDelegator.getFalse("start", (error: string, value: boolean) => {
      expect(error).toBeNull();
      expect(value).toBeFalsy();
      done();
    });
  });

  test("getDoorLockCurrentState", done => {
    commandDelegator.getDoorLockCurrentState(
      (error: string | null, state: any) => {
        expect(error).toBeNull();
        expect(state).toEqual(HapCharacteristic.LockCurrentState.SECURED);
        done();
      },
    );
  });

  test("getDoorLockTargetState", done => {
    commandDelegator.getDoorLockTargetState(
      (error: string | null, state: any) => {
        expect(error).toBeNull();
        expect(state).toEqual(HapCharacteristic.LockTargetState.SECURED);
        done();
      },
    );
  });

  test("getDoorLockCurrentState - defaultUnlocked", done => {
    commandDelegator = createCommandDelegator(true);

    commandDelegator.getDoorLockCurrentState(
      (error: string | null, state: any) => {
        expect(error).toBeNull();
        expect(state).toEqual(HapCharacteristic.LockCurrentState.UNSECURED);
        done();
      },
    );
  });

  test("getDoorLockTargetState - defaultUnlocked", done => {
    commandDelegator = createCommandDelegator(true);

    commandDelegator.getDoorLockTargetState(
      (error: string | null, state: any) => {
        expect(error).toBeNull();
        expect(state).toEqual(HapCharacteristic.LockTargetState.UNSECURED);
        done();
      },
    );
  });

  test("setDoorLockTargetState - SECURED", done => {
    when(onStarMock.lockDoor()).thenResolve({
      status: "success",
      response: {
        data: {
          status: "In Progress",
        },
      },
    });

    commandDelegator.setDoorLockTargetState(
      HapService.LockMechanism("lock"),
      HapCharacteristic.LockTargetState.SECURED,
      (error: string) => {
        expect(error).toBeNull();
        done();
      },
    );
  });

  test("setDoorLockTargetState - UNSECURED", done => {
    when(onStarMock.unlockDoor()).thenResolve({
      status: "success",
      response: {
        data: {
          status: "In Progress",
        },
      },
    });

    commandDelegator.setDoorLockTargetState(
      HapService.LockMechanism("unlock"),
      HapCharacteristic.LockTargetState.UNSECURED,
      (error: string) => {
        expect(error).toBeNull();
        done();
      },
    );
  });

  test("setSwitch", done => {
    when(onStarMock.start()).thenResolve({
      status: "success",
      response: {
        data: {
          status: "In Progress",
        },
      },
    });

    commandDelegator.setSwitch("start", true, (error: string) => {
      expect(error).toBeNull();
      done();
    });
  });

  test("setSwitchError", done => {
    when(onStarMock.start()).thenThrow(new Error("Start Failure"));

    commandDelegator.setSwitch("start", true, (error: string) => {
      expect(error).toBeDefined;
      expect(error).not.toBeNull;
      done();
    });
  });
});
