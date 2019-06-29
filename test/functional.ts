import config from "../testCredentials.json";
import CommandDelegator from "../src/CommandDelegator";

const commandDelegator = new CommandDelegator(config, console.log);

(async () => {
  await commandDelegator.flashHeadlights((result: string) => {
    console.log(result);
  });
})();
