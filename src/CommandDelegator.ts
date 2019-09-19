import OnStar from "onstarjs";

class CommandDelegator {
  private onStar: OnStar;

  constructor(config: any, private log: Function) {
    this.onStar = OnStar.create({
      checkRequestStatus: false,
      ...config,
    });
  }

  async getClimateOn(reply: Function) {
    const climateState = false;

    this.log(`getClimateOn - Current State: ${climateState}`);

    reply(null, climateState);
  }

  async setClimateOn(on: boolean, reply: Function) {
    try {
      this.log("setClimateOn: Requesting Remote Start");
      const result = await this.onStar.start();
      this.log("setClimateOn: Remote Start Finished", result.response.data);

      reply(null);
    } catch (e) {
      const errorMessage = `setClimateOn: Error: ${e.message}`;

      this.log(errorMessage);
      reply(errorMessage);
    }
  }
}

export default CommandDelegator;
