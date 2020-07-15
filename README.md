# homebridge-onstar (OnStar Accessory)

[![npm version](https://badge.fury.io/js/homebridge-onstar.svg)](https://badge.fury.io/js/homebridge-onstar)
[![Build Status](https://travis-ci.org/samrum/homebridge-onstar.svg?branch=master)](https://travis-ci.org/samrum/homebridge-onstar)
[![Coverage Status](https://coveralls.io/repos/github/samrum/homebridge-onstar/badge.svg?branch=master)](https://coveralls.io/github/samrum/homebridge-onstar?branch=master)

Homebridge support for OnStar!

**Use at your own risk. This is an unofficial plugin.**

# Configuration

## Basic Config

    {
      "accessories": [
        {
          "accessory": "OnStar",
          "name": "Car",
          "deviceId": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
          "vin": "11111111111111111",
          "username": "foo@bar.com",
          "password": "p@ssw0rd",
          "onStarPin": "1234",
        }
      ]
    }

Use a random version 4 uuid as a deviceId. Generator avaiable [here](https://www.uuidgenerator.net/version4).

With this config, a climate control (remote start) switch will be available in the Home app.

Siri Command: "Turn on the Car climate"

## Additional Config Options

### Lock/Unlock Doors Switch

    "enableDoors": true,

Enables locking/unlocking the vehicle doors.

Since querying the current state of locks through OnStar is slow, the switch will always reset to a locked state. The doorsDefaultToUnlocked option can be used to default to an unlocked state (see below).

Siri command: "Unlock the Car"

### Door Default Lock Status

    "doorsDefaultToUnlocked": true,

Default the doors lock switch to an unlocked state.

### Charger Switch

    "enableCharger": true

Enable a switch that will set the vehicle charge mode to immediate (For EV/PHEV). Turning the switch off does nothing.

Siri command: "Turn on the Car charger"

### Alert Switch

    "enableAlert": true,

Enable a switch that triggers the panic function of the car (horn + lights flashing).

Siri command: "Turn on the Car alert"

# Notes

- Turning off switches is possible using Siri/Shortcuts/Scenes
- When secret keys are rotated by MyChevrolet/OnStar, the plugin may stop working until the keys are updated.
- OnStar request failures after the initial request are made won't be processed. homebridge-onstar will return success once requests are considered _In Progress_.
- The name you set in the config should be unique. If it matches app names, other Siri commands, or other Home accessories, Siri may get confused.

# Credits

[OnStarJS](https://github.com/samrum/OnStarJS) (Shoutout to [mikenemat](https://github.com/mikenemat/) and [gm-onstar-probe](https://github.com/mikenemat/gm-onstar-probe))

[homebridge-tesla](https://github.com/nfarina/homebridge-tesla) for being a great reference to refer to on how to set up various homebridge services.
