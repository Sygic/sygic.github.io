# How to use

Clone repository. Navigate in respective addon directory ([geotabdrive-sygic-addin](geotabdrive-sygic-addin) or [mygeotab-sygic-page](mygeotab-sygic-page))

To run locally:

```
npm install
npm run serve
```

To build production version (can be run in respective addon folders or in root folder to create common config.json)

```
npm run build
```

To ensure proper sygic-geotab-utils module inclusion in both projects you need to:

1. ```cd ~/sygic-geotab-utils && npm link```
2. ```cd ~/mygeotab-sygic-page && npm link sygic-geotab-utils```
3. ```cd ~/geotabdrive-sygic-addin && npm link sygic-geotab-utils```

## My Geotab Sygic Page

This page allows you to set dimensions of 'Devices' ([see here](https://github.com/Sygic/sygic.github.io/blob/master/geotab/mygeotab-sygic-page/src/app/scripts/main.js#L232)).

To install the page in mygeotab UI use this [config.json](mygeotab-sygic-page/dist/config.json)

![My Geotab Sygic Addin Page](mygeotab-sygic-page.png)

### Sequence diagram

![My Geotab Sygic Addin Page](mygeotab-sygic-page-sequence.png)

### System architecture diagram

![My Geotab Sygic Addin Page](mygeotab-sygic-page-architecture.png)

## Geotab Drive Sygic Addin

This addin allows you to use [Sygic Professional Navigation](https://www.sygic.com/enterprise/professional-gps-navigation-sdk) to navigate to assigned 'Routes' of type 'Plan' to your 'Device' in the future (starting from now) ([see here](https://github.com/Sygic/sygic.github.io/blob/master/geotab/geotabdrive-sygic-addin/src/app/scripts/main.js#L189))

To install the addin in Geotab Drive APP use this [config.json](geotabdrive-sygic-addin/dist/config.json)

![Geotab Drive Sygic Addin](geotabdrive-sygic-addin.png)

### Sequence diagram

![Geotab Drive Sygic Addin](geotabdrive-sygic-addin-sequence.png)

### System architecture diagram

![Geotab Drive Sygic Addin](geotabdrive-sygic-addin-architecture.png)

## Security and access rights

To view vehicles in the list a user must have **"List devices"** (securityIdentifier: DeviceList) and **"View Add-in data"** (securityIdentifier: ViewAddInData) feature access in his security clearance.

To modify vehicle dimensions a user must have **"Administer devices"** (securityIdentifier: DeviceAdmin) and **Manage Add-in data** (securityIdentifier: ManageAddInData) feature access in his security clearance.

Contact: [os-team@sygic.com](mailto:os-team@sygic.com)
