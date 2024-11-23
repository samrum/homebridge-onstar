# homebridge-aonstar (OnStar Accessory)

[![npm version](https://badge.fury.io/js/homebridge-onstar2.svg)](https://badge.fury.io/js/homebridge-onstar2)

[![Coverage Status](https://coveralls.io/repos/github/samrum/homebridge-onstar/badge.svg?branch=master)](https://coveralls.io/github/samrum/homebridge-onstar?branch=master)

Homebridge support for OnStar!

**Use at your own risk. This is an unofficial plugin.**

# Configuration

## Basic Config (Climate)

    {
      "accessories": [
        {
          "accessory": "OnStar",
          "name": "Car",
          "deviceId": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
          "vin": "1G2ZF58B774109863",
          "username": "foo@bar.com",
          "password": "p@ssw0rd",
          "onStarPin": "1234"
          "TOTPKEY": "6eufgy2398reweg0",
        }
      ]
    }

Use a random version 4 uuid as a deviceId. Generator avaiable [here](https://www.uuidgenerator.net/version4).

With this config, a climate control (remote start) switch will be available in the Home app.

Siri Command: "Turn on the Car climate"

## Additional Config Options

### Lock/Unlock Doors Switch

    "enableDoors": true

Enables locking/unlocking the vehicle doors.

Querying the current state of locks through OnStar is slow, so the switch will always reset to a locked state.

Siri command: "Unlock the Car"

### Reset Doors Switch to an Unlocked State

    "doorsDefaultToUnlocked": true

Default the doors switch to an unlocked state.

### Charger Switch

    "enableCharger": true

Enable a switch that will set the vehicle charge mode to immediate (for EV/PHEV). Turning the switch off does nothing.

Siri command: "Turn on the Car charger"

### Alert Switch

    "enableAlert": true

Enable a switch that triggers an alert for the vehicle (horn + lights flashing).

Siri command: "Turn on the Car alert"

# Notes

- Toggling switches off is possible using Siri/Shortcuts/Scenes
- When secret keys are rotated by MyChevrolet/OnStar, the plugin may stop working until the keys are updated.
- homebridge-onstar will return success once requests are considered _In Progress_. As such, OnStar request failures after the initial request are made won't be handled.

# Credits

[OnStarJS](https://github.com/samrum/OnStarJS) (Shoutout to [mikenemat](https://github.com/mikenemat/) and [gm-onstar-probe](https://github.com/mikenemat/gm-onstar-probe))

[homebridge-tesla](https://github.com/nfarina/homebridge-tesla) for being a great reference to refer to on how to set up various homebridge services.
