# Pi Deployment

## Purpose
Describe the Raspberry Pi update path for this repository and the operational assumptions behind it.

## Scope
This document covers:
- the update service and timer used on the Pi
- the expected repository script path
- the build behaviour triggered during updates
- the current runtime boundary observed on the device

It does not attempt to document every kiosk-side process in detail.

## Update mechanism
The Pi expects a version-controlled update script at:

`scripts/pi/update-from-main.sh`

The current systemd units on the Pi are:

- `pi-dashboard-update.service`
- `pi-dashboard-update.timer`

Observed timer behaviour:
- `OnBootSec=2min`
- `OnUnitActiveSec=5min`
- `Persistent=true`

The service is a oneshot update job. A successful run should end in:
- `inactive (dead)`
- result: `success`

That is expected behaviour for this unit type.

## Script behaviour
The repository update script is designed to:
1. change into `/home/nerdyboy/pi-dashboard`
2. fetch the current branch from `origin`
3. hard reset to the remote branch when changes exist
4. install dependencies with `npm ci` when `package-lock.json` is present, otherwise `npm install`
5. run `npm run build` when available, otherwise `npm run build:all`
6. restart `pi-dashboard.service` only if that unit exists

This conditional restart matters because the current Pi runtime does not expose a `pi-dashboard.service` unit.

## Runtime boundary
During verification, the dashboard runtime appeared to be composed of a broader kiosk stack, including processes such as:
- Chromium kiosk processes
- `control-server.mjs`
- proxy services on localhost ports
- `rpiplay-kiosk-bridge.sh`

That means this repository currently governs the build output and update path, but not necessarily the full runtime orchestration.

## Rules and conventions
- Keep `scripts/pi/update-from-main.sh` in version control.
- If the systemd unit path changes, update both the Pi unit and this document.
- Do not assume `pi-dashboard.service` exists on every device.
- Prefer documenting deployment expectations explicitly rather than relying on device-local drift.

## Next steps
- Decide whether Pi-specific systemd units should also live in this repository.
- Decide whether the kiosk runtime scripts belong here or in a separate operational repo.
- If the update path changes, verify service and timer health on-device after deployment.
