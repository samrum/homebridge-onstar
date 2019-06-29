import OnStar from "onstarjs";

class CommandDelegator {
  private onStar: OnStar;

  constructor(config: any, private log: Function) {
    this.onStar = OnStar.create({
      checkRequestStatus: false,
      ...config,
    });
  }

  setOnStar(onStar: OnStar) {
    this.onStar = onStar;
  }

  async getClimateOn(reply: Function) {
    const climateState = false;

    this.log("getClimateOn: Climate State: ", climateState ? "on" : "off");

    reply(null, climateState);
  }

  async setClimateOn(on: boolean, reply: Function) {
    this.log("setClimateOn: Turning on", on);

    try {
      this.log("setClimateOn: Requesting Remote Start");
      const result = await this.onStar.start();
      this.log("setClimateOn: Remote Start Finished", result.response.data);

      reply();
    } catch (e) {
      if (e.response) {
        this.log(`Error: ${e.response.status} - ${e.response.statusText}`);
      } else if (e.request) {
        this.log("Error: API returned no response");
      } else {
        this.log("Error:", e.message);
      }

      reply("Failed to start due to error");
    }
  }

  async flashHeadlights(reply: Function) {
    await this.onStar.alert({
      action: ["Flash"],
    });

    reply();
  }
}

export default CommandDelegator;
