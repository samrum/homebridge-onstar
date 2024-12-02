# homebridge-onstar-dev (OnStar Accessory)

[![npm version](https://badge.fury.io/js/homebridge-onstar-dev.svg)](https://badge.fury.io/js/homebridge-onstar-dev)

Homebridge support for OnStar!

**Use at your own risk. This is an unofficial plugin.**

# New Requirement as of 2024-11-19

Updated to use TOTP to fulfill new authentication process from GM.

You will need to change your OnStar account's MFA method to "Third-Party Authenticator App"

_The "Third-Party Authenticator App" option doesn't seem to show up on mobile, so please try from a desktop browser._

**You will need to capture your TOTP key from the "Third-Party Authenticator App" setup so that you can provide it in your .env or initialization config.**

You may be able to obtain your TOTP key by inspecting/hovering over the link under the QR code **when you are setting it up.**

If you use an authenticator app such as [Stratum](https://stratumauth.com/), [Bitwarden](https://bitwarden.com/), or [Vaultwarden](https://github.com/dani-garcia/vaultwarden) that allows you to view your TOTP key, you can view it at any time.

In the IOS Passwords app you can tap "Copy Setup URL" and obtain the secret from the copied data.

_If you cannot find the option to configure a "Third-Party Authenticator App" on your GM account page, try contacting OnStar to see if there is another way to enable it._

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
          "onStarTOTP": "XXXXXXXXXXXXXX",
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
- homebridge-onstar-dev will return success once requests are considered _In Progress_. As such, OnStar request failures after the initial request are made won't be handled.

# Credits

[OnStarJS](https://github.com/samrum/OnStarJS) (Shoutout to [mikenemat](https://github.com/mikenemat/) and [gm-onstar-probe](https://github.com/mikenemat/gm-onstar-probe))

[homebridge-tesla](https://github.com/nfarina/homebridge-tesla) for being a great reference to refer to on how to set up various homebridge services.

Credits to [reartvapps](https://github.com/reartvapps) and [BigThunderSR](https://github.com/bigthundersr) for the updated homebridge-onstar version support.
