# homebridge-onstar

[![npm version](https://badge.fury.io/js/homebridge-onstar.svg)](https://badge.fury.io/js/homebridge-onstar)

Only exposes a method to remote start (aka precondition) a vehicle for now. Doesn't handle any failure responses from OnStar after the initial request is made.

**Use at your own risk. This is an unofficial plugin.**

## Example config.json:

Use a random version 4 uuid as a deviceId.

    {
      "accessories": [
        {
          "accessory": "OnStar",
          "name": "Volty",
          "deviceId": "742249ce-18e0-4c82-8bb2-9975367a7631",
          "vin": "1G2ZF58B774109863",
          "username": "dev@rubenmedina.com",
          "password": "p@ssw0rd",
          "onStarPin": "1234",
        }
      ]
    }

To trigger a remote start using the above config, the following Siri commands would work:

- "Start the Volty"
- "Turn on the Volty"

# Credits

Uses [OnStarJS](https://github.com/samrum/OnStarJS) which was made possible by [mikenemat](https://github.com/mikenemat/)'s work in [gm-onstar-probe](https://github.com/mikenemat/gm-onstar-probe).
