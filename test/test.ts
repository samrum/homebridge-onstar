import { mock, when, instance } from "ts-mockito";
import OnStarAccessory from "./../src/OnStarAccessory";
import OnStar from "onstarjs";

const config = {
  name: "Test Car",
  deviceId: "742249ce-18e0-4c82-8bb2-9975367a7631",
  vin: "1G2ZF58B774109863",
  username: "samrum@samrum.com",
  password: "p@ssw0rd",
  onStarPin: "1234",
};

class Switch {
  getCharacteristic() {
    return this;
  }
  on() {
    return this;
  }
}

const Service = {
  Switch,
};

const Characteristic = {
  On: "On",
};

let onStarAccessory: OnStarAccessory;

describe("OnStarAccessory", () => {
  beforeEach(() => {
    onStarAccessory = new OnStarAccessory(
      () => {},
      config,
      Service,
      Characteristic,
    );

    const mockOnStar = mock(OnStar);
    when(mockOnStar.remoteStart()).thenResolve();
    onStarAccessory.setOnStar(instance(mockOnStar));
  });

  test("getClimateOn", async () => {
    await onStarAccessory.getClimateOn(
      (error: string | null, success: boolean) => {
        expect(error).toBeNull();
        expect(success).toBeFalsy();
      },
    );
  });
});
