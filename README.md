# homebridge-onstar (OnStar Accessory)

[![npm version](https://badge.fury.io/js/homebridge-onstar.svg)](https://badge.fury.io/js/homebridge-onstar)
[![Build Status](https://travis-ci.org/samrum/homebridge-onstar.svg?branch=master)](https://travis-ci.org/samrum/homebridge-onstar)
[![Coverage Status](https://coveralls.io/repos/github/samrum/homebridge-onstar/badge.svg?branch=master)](https://coveralls.io/github/samrum/homebridge-onstar?branch=master)

Homebridge support for OnStar!

A climate control switch is available by default. Charge Override, Alert, and Door Lock/Unlock functionality can be enabled via configuration options as seen in the example config below.

**Use at your own risk. This is an unofficial plugin.**

## Example config.json:

Use a random version 4 uuid as a deviceId. There are online generators you can use to generate one.

    {
      "accessories": [
        {
          "accessory": "OnStar",
          "name": "Car",
          "deviceId": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
          "vin": "11111111111111111",
          "username": "dev@rubenmedina.com",
          "password": "p@ssw0rd",
          "onStarPin": "1234",
          "enableCharger": true,
          "enableAlert": true,
          "enableDoors": true,
          "doorsDefaultToUnlocked": false,
        }
      ]
    }

## Siri Commands
For the above example config, the following Siri commands would be available. 
- _"Turn on the Car climate"_ - Precondition/remote start the Vehicle
- _"Turn on the Car charger"_ - Set charge mode to immediate (For EV/PHEV)
- _"Turn on the Car alert"_ - Trigger a horn/lights alert 
- _"Unlock the Car"_ - Send an unlock command to the Vehicle
- _"Turn on the Car"_ - Turns on all available switches 

Turning off switches is also possible via Siri, but not via the Home UI as the switches default to off.
Note that turning off the charger is not supported.

# Important Notes
- The Doors Lock component will always reset to a Locked state due to the fact that querying for the current state of the lock via the API is not reponsive enough to do quickly or keep in sync very easily. Siri commands to lock doors will work even if the lock component is in the locked state.
  - Use the _doorsDefaultToUnlocked_ option to default the lock to an Unlocked state instead
- Request failures after the initial request are made won't be processed. The plugin will return success once requests are considered _In Progress_. 
- Siri service names are essentially global, so the name you set in config (or in the home app itself) should be unique. If it matches app names or other Siri commands, Siri will get confused.
- This plugin may stop working every few months when secret keys are rotated by MyChevrolet/OnStar. Feel free to open an issue when this happens.

# Credits
[OnStarJS](https://github.com/samrum/OnStarJS) for providing the library to make OnStar requests. (Shoutout to [mikenemat](https://github.com/mikenemat/) and [gm-onstar-probe](https://github.com/mikenemat/gm-onstar-probe) for facilitating that library)

[homebridge-tesla](https://github.com/nfarina/homebridge-tesla) for providing much needed help and guidance in figuring out how to set up various homebridge services.
