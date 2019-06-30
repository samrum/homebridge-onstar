import config from "../testCredentials.json";
import CommandDelegator from "../src/CommandDelegator";

const commandDelegator = new CommandDelegator(config, console.log);

(async () => {
  await commandDelegator.setClimateOn(true, (error: string) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Success!");
    }
  });
})();
