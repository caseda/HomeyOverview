// Set any of these from `false;` to `true;` to see the corresponding Name(s) or Node ID('s) added to the list
const showStorage = false; // Show storage status (Very slow!, is enabled for Homey Pro (early 2023))
const showUpdateableApps = false; // Names of Apps that can be updated
const showDisabledApps = false; // Names of Apps that are disabled or crashed
const showStableApps = false; // Names of Stable channel Apps
const showTestApps = false; // Names of Test channel Apps
const showDevApps = false; // Names of Apps that are installed via CLI or Community Appstore
const showSDKv2Apps = false; // Names of Apps that are on SDKv2
const showSDKv3Apps = false; // Names of Apps that are on SDKv3
const showZones = false; // Names of Zones
const showLogicBoolean = false; // Names and ID of boolean (yes/no) variables
const showLogicNumber = false; // Names and ID of number variables
const showLogicString = false; // Names and ID of string (text) variables
const showDisabledFlows = false; // Names of Flows that are disabled
const showBrokenFlows = false; // Names of Flows that are broken
const showDisabledAdvancedFlows = false; // Names of Advanced Flows that are disabled
const showBrokenAdvancedFlows = false; // Names of Advanced Flows that are broken
const showImages = false; // URLs of all your images (HP 2023+ only)
const showMoods = false; // Names of all Moods (HP 2023+ only)
const showUnavailableDevices = false; // Names of devices that are marked unavailable
const showZwaveDevices = false; // Names and Node ID of all Z-Wave devices
const showZwaveRouterDevices = false; // Names and Node ID of Z-Wave router devices
const showZwaveUnsecureDevices = false; // Names and Node ID of unsecure Z-Wave devices
const showZwaveSecureS0Devices = false; // Names and Node ID of secure (S0) Z-Wave devices
const showZwaveSecureS2AuthenticatedDevices = false; // Names and Node ID of secure (S2 Authenticated) Z-Wave devices
const showZwaveSecureS2UnauthenticatedDevices = false; // Names and Node ID of secure (S2 Unauthenticated) Z-Wave devices
const showZwaveBatteryDevices = false; // Names and Node ID of Z-Wave battery devices
const showZwaveUnreachableNodes = false; // Node ID's of unreachable (flagged) devices
const showZwaveUnknownNodes = false; // Node ID's of unknown nodes
const showZigbeeNodes = false; // Names of all ZigBee devices
const showZigbeeRouter = false; // Names of ZigBee: router devices
const showZigbeeEndDevice = false; // Names of ZigBee: end device devices
const showZigbeeLastSeen = false; // Show additional: the last seen time and date (HP 2023+ only)
const showVirtualDevices = false; // Names of all Virtual devices
const showIRDevices = false; // Names of all InfraRed devices

// ================= Don't edit anything below here =================

log('--------------- Homey Pro Overview v1.18 --------------');

await Homey.system.getSystemName()
  .then(result => log('Homey name:', result))
  .catch(() => log('Failed: Getting Homey name'));

let homeyPlatformVersion, homeyVersion, timezone;
await Homey.system.getInfo()
  .then(result => {
    log('Homey version:', homeyVersion = result.homeyVersion);
    log('Homey model:', result.homeyModelName, '(' + result.cpus.length + ' core(s))');
    homeyPlatformVersion = result.homeyPlatformVersion || 1;
    timezone = result.timezone;

    const d = Math.floor(result.uptime / 86400);
    const h = Math.floor((result.uptime % 86400) / 3600);
    const m = Math.floor((result.uptime % 3600) / 60);
    const s = Math.floor(result.uptime % 60);
    let uptimeHuman = '';
    if (d > 0) uptimeHuman += d + ' day' + (d > 1 ? 's, ' : ', ');
    uptimeHuman += h + ' hour' + (h > 1 ? 's, ' : ', ');
    uptimeHuman += m + ' minute' + (m > 1 ? 's, ' : ', ');
    uptimeHuman += s + ' second' + (s > 1 ? 's' : '');
    log('Uptime:', result.uptime, '(' + uptimeHuman + ')');

    if (homeyPlatformVersion === 2) {
      log('WiFi:', (result.wifiConnected) ? 'Connected' : 'Not connected');
      log('Ethernet:', (result.ethernetConnected) ? 'Connected' : 'Not connected');
      log('Throttled:', (result.videoCoreThrottleOccured) ? 'Yes' : 'No', '(Currently:', (result.videoCoreThrottleCurrently) ? 'Yes)' : 'No)');
      log('Under voltage:', (result.videoCoreUndervoltageOccured) ? 'Yes' : 'No', '(Currently:', (result.videoCoreUnderVoltageCurrently) ? 'Yes)' : 'No)');
    }
  })
  .catch(() => log('Failed: Getting Homey\'s statistics'));

await Homey.updates.getUpdates()
  .then(result => {
    if(result.length > 0) {
      log('Update available:', result[0].version);
    } else {
      log('Update available: No');
    }
  })
  .catch(() => log('Failed: Getting updates'));

if (showStorage || homeyPlatformVersion === 2) {
  await Homey.system.getStorageInfo()
    .then(result => {
      let sizeFree = result.free + 'B'
      if (result.free >= 1000000000) {
        sizeFree = (result.free / 1000000000).toFixed(2) + ' GB';
      } else if (result.free >= 1000000) {
        sizeFree = (result.free / 1000000).toFixed(2) + ' MB';
      }
      log('Storage:', (result.total / 1000000000).toFixed(2), 'GB (' + sizeFree + ' free)');
    })
    .catch(() => log('Failed: Getting storage information'));
}

log('\r\n------------------ Main ---------------------');

await Homey.users.getUsers()
  .then(result => {
    let owner = 0, manager = 0, user = 0, guest = 0;

    Object.keys(result).forEach(function(key) {
      const role = result[key].role;
      if (role === 'owner') owner++;
      if (role === 'manager') manager++;
      if (role === 'user') user++;
      if (role === 'guest') guest++;
    });

    log(Object.keys(result).length, 'Users', '('  + owner + ' Owner, ' + manager + ' Manager, ' + user + ' User, ' + guest + ' Guest)');
  })
  .catch(() => log('Failed: Getting users'));

await Homey.apps.getApps()
  .then(result => {
    let sdkv2Apps = [], sdkv3Apps = [], updateableApps = [], disabledApps = [], stableApps = [], testApps = [], devApps = [];

    Object.keys(result).forEach(function(key) {
      if (result[key].updateAvailable) updateableApps.push(result[key].name);
      if (result[key].sdk === 2) sdkv2Apps.push(result[key].name);
      if (
        result[key].sdk === 3
        || homeyPlatformVersion === 2
      ) {
        sdkv3Apps.push(result[key].name);
      }
      if (!result[key].ready) disabledApps.push(result[key].name);
      if (result[key].origin === 'devkit_install') devApps.push(result[key].name);
      else if (result[key].channel === 'stable' || result[key].channel === 'live') stableApps.push(result[key].name);
      if (result[key].channel === 'beta' || result[key].channel === 'test') testApps.push(result[key].name);
    });

    log(Object.keys(result).length, 'Apps', '(' + stableApps.length + ' Stable, ' + testApps.length + ' Test, ' + devApps.length + ' Development/Community Appstore, ' + sdkv2Apps.length + ' SDKv2, '  + sdkv3Apps.length + ' SDKv3, '  + updateableApps.length + ' Updateable, ' + disabledApps.length + ' Disabled/Crashed)');
    if (showStableApps) {
      log('---------------------------------------------')
      log('App(s) in the Stable channel:');
      log(stableApps.join('\r\n'));
      log('---------------------------------------------')
    }

    if (showTestApps) {
      log('---------------------------------------------')
      log('App(s) in the Test channel:');
      log(testApps.join('\r\n'));
      log('---------------------------------------------')
    }

    if (showDevApps) {
      log('---------------------------------------------')
      log('App(s) that are installed via CLI or Community Appstore:');
      log(devApps.join('\r\n'));
      log('---------------------------------------------')
    }

    if (showSDKv2Apps) {
      log('---------------------------------------------')
      log('SDKv2 app(s):');
      log(sdkv2Apps.join('\r\n'));
      log('---------------------------------------------')
    }

    if (showSDKv3Apps) {
      log('---------------------------------------------')
      log('SDKv3 app(s):');
      log(sdkv3Apps.join('\r\n'));
      log('---------------------------------------------')
    }

    if (showUpdateableApps) {
      log('---------------------------------------------')
      log('Updateable app(s):');
      log(updateableApps.join('\r\n'));
      log('---------------------------------------------')
    }

    if (showDisabledApps) {
      log('---------------------------------------------')
      log('Disabled app(s):');
      log(disabledApps.join('\r\n'));
      log('---------------------------------------------')
    }
  })
  .catch(() => log('Failed: Getting apps'));

let zones = {};
await Homey.zones.getZones()
  .then(result => {
    Object.keys(result).forEach(function(key) {
      zones[result[key].id] = result[key].name;
    });
    log(Object.keys(result).length, 'Zones');

    if (showZones) {
      log('---------------------------------------------')
      log('Zones:');
      log(Object.entries(zones).sort((a, b) => a[1].localeCompare(b[1])).map(zone => zone[1]).join('\r\n'));
      log('---------------------------------------------')
    }
  })
  .catch(() => log('Failed: Getting zones'));

await Homey.notifications.getNotifications()
  .then(result => log(Object.keys(result).length || 0, 'Notifications (Timeline)'))
  .catch(() => log('Failed: Getting notifications'));

await Homey.insights.getLogs()
  .then(result => {
    let boolean = 0, number = 0;

    Object.keys(result).forEach(function(key) {
      if (result[key].type === 'number') number++;
      if (result[key].type === 'boolean') boolean++;
    });

    log(Object.keys(result).length, 'Insight entries', '(' + boolean + ' Boolean (Yes/No), ' + number + ' Number)');
  })
  .catch(() => log('Failed: Getting Insights'));

await Homey.logic.getVariables()
  .then(result => {
    let boolean = [], number = [], string = [];

    Object.keys(result).forEach(function(key) {
      if (result[key].type === 'boolean') boolean.push(result[key].name + ' (ID: ' + result[key].id + ')');
      if (result[key].type === 'number') number.push(result[key].name + ' (ID: ' + result[key].id + ')');
      if (result[key].type === 'string') string.push(result[key].name + ' (ID: ' + result[key].id + ')');
    });

    log(Object.keys(result).length, 'Logic Variables', '(' + boolean.length + ' Boolean (Yes/No), ' + number.length + ' Number, ' + string.length + ' String (Text))');

    if (showLogicBoolean) {
      log('---------------------------------------------')
      log('Boolean (yes/no) variable(s):');
      log(boolean.join('\r\n'));
      log('---------------------------------------------')
    }

    if (showLogicNumber) {
      log('---------------------------------------------')
      log('Number variable(s):');
      log(number.join('\r\n'));
      log('---------------------------------------------')
    }

    if (showLogicString) {
      log('---------------------------------------------')
      log('String (text) variable(s):');
      log(string.join('\r\n'));
      log('---------------------------------------------')
    }

  })
  .catch(() => log('Failed: Getting variables'));

await Homey.flow.getFlows()
  .then(result => {
    let disabledFlows = [], brokenFlows = [];
    Object.keys(result).forEach(function(key) {
      if (!result[key].enabled) disabledFlows.push(result[key].name);
      if (result[key].broken) brokenFlows.push(result[key].name);
    });

    log(Object.keys(result).length, 'Flows', '('  + brokenFlows.length + ' Broken, ' + disabledFlows.length + ' Disabled)');

    if (showBrokenFlows) {
      log('---------------------------------------------')
      log('Broken flow name(s):');
      log(brokenFlows.join('\r\n'));
      log('---------------------------------------------')
    }

    if (showDisabledFlows) {
      log('---------------------------------------------')
      log('Disabled flow name(s):');
      log(disabledFlows.join('\r\n'));
      log('---------------------------------------------')
    }
  })
  .catch(() => log('Failed: Getting flows'));

await Homey.flow.getAdvancedFlows()
  .then(result => {
    let disabledFlows = [], brokenFlows = [];
    Object.keys(result).forEach(function(key) {
      if (!result[key].enabled) disabledFlows.push(result[key].name);
      if (result[key].broken) brokenFlows.push(result[key].name);
    });

    log(Object.keys(result).length, 'Advanced flows', '('  + brokenFlows.length + ' Broken, ' + disabledFlows.length + ' Disabled)');

    if (showBrokenAdvancedFlows) {
      log('---------------------------------------------')
      log('Broken advanced flow name(s):');
      log(brokenFlows.join('\r\n'));
      log('---------------------------------------------')
    }

    if (showDisabledAdvancedFlows) {
      log('---------------------------------------------')
      log('Disabled advanced flow name(s):');
      log(disabledFlows.join('\r\n'));
      log('---------------------------------------------')
    }
  })
  .catch(() => log('Failed: Getting advanced flows'));

if (homeyPlatformVersion === 2) {
  await Homey.images.getImages()
    .then(result => {
      let images = [];

      Object.keys(result).forEach(function(key) {
        if (result[key].id !== 'dummy') {
          images.push(result[key].url);
        }
      });

      log(images.length, 'Images');

      if (showImages) {
        log('---------------------------------------------')
        log('Image URL(s):');
        log(images.join('\r\n'));
        log('\r\n');
        log('Images can also be found in the developer tools:');
        log('https://tools.developer.homey.app/tools/images');
        log('---------------------------------------------')
      }
    })
    .catch(() => log('Failed: Getting images'));
}

if (Homey.moods !== undefined) {
  await Homey.moods.getMoods()
    .then(result => {
      let moods = [];

      Object.keys(result).forEach(async function(key) {
        moods.push(zones[result[key].zone] + ' : ' + result[key].name);
      });

      log(moods.length, 'Moods');

      if (showMoods) {
        log('---------------------------------------------')
        log('Mood(s):');
        log(moods.join('\r\n'));
        log('---------------------------------------------')
      }
    })
    .catch(() => log('Failed: Getting Moods'));
}

await Homey.alarms.getAlarms()
  .then(result => {
    let enabled = 0;
    Object.keys(result).forEach(function(key) {
      if (result[key].enabled) enabled++;
    });

    log(Object.keys(result).length, 'Alarms', '(' + enabled + ' Enabled)')
  })
  .catch(() => log('Failed: Getting alarms'));

await Homey.apps.getAppSettings({id: 'com.athom.homeyscript'})
  .then(result => {
    log(Object.keys(result.scripts).length, 'HomeyScript scripts', '(' + ((result.tokens) ? Object.keys(result.tokens).length : 0) + ' Token/Tag)');
  })
  .catch(() => {
    if (homeyPlatformVersion === 2 && homeyVersion.localeCompare("10.0.0-rc.80", undefined, {numeric: true, preversion: ["rc"]}) < 0) {
      log('Failed: Getting HomeyScript, Homey Pro (early 2023): getting information from apps is currently unavailable.');
    }
    else {
      log('Failed: Getting HomeyScript');
    }
  });

await Homey.apps.getAppSettings({id: 'net.i-dev.betterlogic'})
  .then(result => {
    let boolean = 0, number = 0, string = 0;
    Object.keys(result.variables).forEach(function(key) {
      if (result.variables[key].type === 'boolean') boolean++;
      if (result.variables[key].type === 'number') number++;
      if (result.variables[key].type === 'string') string++;
    });

    log(Object.keys(result.variables).length, 'Better Logic Variables', '(' + boolean + ' Boolean (Yes/No), ' + number + ' Number, ' + string + ' String)');
  })
  .catch(() => {
    if (homeyPlatformVersion === 2 && homeyVersion.localeCompare("10.0.0-rc.80", undefined, {numeric: true, preversion: ["rc"]}) < 0) {
      log('Failed: Getting Better logic, Homey Pro (early 2023): getting information from apps is currently unavailable.');
    }
  });

log('\r\n----------------- Devices -------------------');
let allDevices = 0, other = 0, homeyBridge = 0, zwaveDevices = [], zwaveNodes = [], zwaveRouterDevices = [], zwaveBatteryDevices = [], zwaveSxDevices = [], zwaveS0Devices = [], zwaveS2AuthDevices = [], zwaveS2UnauthDevices = [], unavailableDevices = [];

await Homey.devices.getDevices()
  .then(result => {
    let virtualNames = [], irNames = [];

    Object.keys(result).forEach(function(key) {
      const device = result[key];
      const virtualDeviceApps = [
        'homey:app:com.arjankranenburg.virtual',
        'homey:app:nl.qluster-it.DeviceCapabilities',
        'homey:app:nl.fellownet.chronograph',
        'homey:app:net.i-dev.betterlogic',
        'homey:app:com.swttt.devicegroups',
        'homey:app:com.sysInternals',
        'homey:virtualdriver',
      ]

      if (
        device.hasOwnProperty('available')
        && device.available === false
      ) {
        unavailableDevices.push(device.name + ' (' + device.unavailableMessage + ')');
      }

      if (device.driverId.includes('infraredbasic') || device.driverId.includes('homey:virtualdriverinfrared')) {
        irNames.push(device.name);
      }
      else if (device.driverId.includes('homey:virtualdriverbridge')) {
        homeyBridge++;
      }
      else if (virtualDeviceApps.some(app => app === device.driverUri || device.driverId.includes(app))) {
        virtualNames.push(device.name);
      }
      else if (device.flags.includes('zwaveRoot')) {
        zwaveDevices.push(device.name + ' (Node ID: ' + device.settings.zw_node_id + ')');
        zwaveNodes.push(Number(device.settings.zw_node_id));

        if (
          device.settings.zw_battery === '✓'
          || device.energyObj.batteries
        ) {
          zwaveBatteryDevices.push(device.name + ' (Node ID: ' + device.settings.zw_node_id + ')');
        }
        else {
          zwaveRouterDevices.push(device.name + ' (Node ID: ' + device.settings.zw_node_id + ')');
        }

        switch(device.settings.zw_secure) {
          case '⨯':
            zwaveSxDevices.push(device.name + ' (Node ID: ' + device.settings.zw_node_id + ')');
            break;
          case '✓':
          case 'S0':
            zwaveS0Devices.push(device.name + ' (Node ID: ' + device.settings.zw_node_id + ')');
            break;
          case 'S2 (Unauthenticated)':
          case 'Unauthenticated':
            zwaveS2UnauthDevices.push(device.name + ' (Node ID: ' + device.settings.zw_node_id + ')');
            break;
          case 'S2 (Authenticated)':
          case 'Authenticated':
            zwaveS2AuthDevices.push(device.name + ' (Node ID: ' + device.settings.zw_node_id + ')');
            break;
        }
      }
      else if (
        !device.flags.includes('zwave')
        && !device.flags.includes('zigbee')
      ) {
        other++;
      }
    });

    allDevices = virtualNames.length + irNames.length + zwaveDevices.length + other + homeyBridge;

    log(unavailableDevices.length, 'Unavailable devices')
    if (showUnavailableDevices) {
      log('---------------------------------------------')
      log('Unavailable device(s):');
      log(unavailableDevices.sort((a, b) => a - b).join('\r\n'));
      log('---------------------------------------------')
    }

    log(virtualNames.length, 'Virtual devices');
    if (showVirtualDevices) {
      log('---------------------------------------------')
      log('Virtual device(s):');
      log(virtualNames.sort((a, b) => a - b).join('\r\n'));
      log('---------------------------------------------')
    }

    log(irNames.length, 'Infrared (database) devices');
    if (showIRDevices) {
      log('---------------------------------------------')
      log('Infrared (database) device(s):');
      log(irNames.sort((a, b) => a - b).join('\r\n'));
      log('---------------------------------------------')
    }
  })
  .catch(() => log('Failed: Getting devices'));

await Homey.zwave.getState()
  .then(result => {
    const unknownNodes = result.zw_state.nodes
      .filter((el) => !zwaveNodes.includes(el))
      .sort((a, b) => a - b)
      .slice(1);

    log(zwaveDevices.length, 'Z-Wave devices', '(' + zwaveSxDevices.length + ' Unsecure, ' + zwaveS0Devices.length + ' Secure (S0), ' + zwaveS2AuthDevices.length + ' Secure (S2 Authenticated), ' + zwaveS2UnauthDevices.length + ' Secure (S2 Unauthenticated), ' + zwaveRouterDevices.length + ' Router, ' + zwaveBatteryDevices.length + ' Battery, ' + result.zw_state.noAckNodes.length + ' Unreachable, ' + unknownNodes.length + ' Unknown)')

    if (showZwaveDevices) {
      log('---------------------------------------------')
      log('Z-Wave device(s):');
      log(zwaveDevices.join('\r\n'));
      log('---------------------------------------------')
    }

    if (showZwaveRouterDevices) {
      log('---------------------------------------------')
      log('Z-Wave router device(s):');
      log(zwaveRouterDevices.sort((a, b) => a - b).join('\r\n'));
      log('---------------------------------------------')
    }

    if (showZwaveUnsecureDevices) {
      log('---------------------------------------------')
      log('Z-Wave unsecure device(s):');
      log(zwaveSxDevices.sort((a, b) => a - b).join('\r\n'));
      log('---------------------------------------------')
    }

    if (showZwaveSecureS0Devices) {
      log('---------------------------------------------')
      log('Z-Wave secure (S0) device(s):');
      log(zwaveS0Devices.sort((a, b) => a - b).join('\r\n'));
      log('---------------------------------------------')
    }

    if (showZwaveSecureS2AuthenticatedDevices) {
      log('---------------------------------------------')
      log('Z-Wave secure (S2) authenticated device(s):');
      log(zwaveS2AuthDevices.sort((a, b) => a - b).join('\r\n'));
      log('---------------------------------------------')
    }

    if (showZwaveSecureS2UnauthenticatedDevices) {
      log('---------------------------------------------')
      log('Z-Wave secure (S2) Unauthenticated device(s):');
      log(zwaveS2Unauth.sort((a, b) => a - b).join('\r\n'));
      log('---------------------------------------------')
    }

    if (showZwaveBatteryDevices) {
      log('---------------------------------------------')
      log('Z-Wave battery device(s):');
      log(zwaveBatteryDevices.sort((a, b) => a - b).join('\r\n'));
      log('---------------------------------------------')
    }

    if (showZwaveUnreachableNodes) {
      log('---------------------------------------------')
      log('Unreachable node(s):');
      log('Node ID:', result.zw_state.noAckNodes.sort((a, b) => a - b).join('\r\nNode ID: '));
      log('---------------------------------------------')
    }

    if (showZwaveUnknownNodes) {
      log('---------------------------------------------')
      log('Unknown node(s):');
      log('Node ID:', unknownNodes.join('\r\nNode ID: '));
      log('---------------------------------------------')
    }
  })
  .catch(() => log('Failed: Getting Z-Wave state'));

let zigbee;
if (Homey.zigBee !== undefined) {
  await Homey.zigBee.getState()
    .then(result => {
      zigbee = result;
    })
    .catch(async () => log('Failed: Getting ZigBee state'));
}
if (Homey.zigbee !== undefined) {
  await Homey.zigbee.getState()
    .then(result => {
      zigbee = result;
    })
    .catch(async () => log('Failed: Getting Zigbee state'));
}

if (zigbee) {
  let zigbeeDevices = [], routerDevices = [], endDevices = [];

  Object.keys(zigbee.nodes).forEach(function(key) {
    device = zigbee.nodes[key];
    let deviceName = device.name;
    if (showZigbeeLastSeen && device.hasOwnProperty('lastSeen')) {
      const lastSeen = new Date(device.lastSeen).toLocaleString('en-GB', {timeZone: timezone, month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'});
      deviceName += ' (last seen: ' + lastSeen + ')';
    }
    zigbeeDevices.push(deviceName);

    if (device.type.toLowerCase() === 'router') routerDevices.push(deviceName);
    if (device.type.toLowerCase() === 'enddevice') endDevices.push(deviceName);
  });

  log(zigbeeDevices.length, 'Zigbee devices', '(' + routerDevices.length + ' Router, ' + endDevices.length + ' End device)');

  if (showZigbeeNodes) {
    log('---------------------------------------------')
    log('ZigBee device(s):');
    log(zigbeeDevices.join('\r\n'));
    log('---------------------------------------------')
  }

  if (showZigbeeRouter) {
    log('---------------------------------------------')
    log('ZigBee router(s):');
    log(routerDevices.sort((a, b) => a - b).join('\r\n'));
    log('---------------------------------------------')
  }

  if (showZigbeeEndDevice) {
    log('---------------------------------------------')
    log('ZigBee end device(s):');
    log(endDevices.sort((a, b) => a - b).join('\r\n'));
    log('---------------------------------------------')
  }

  allDevices += zigbeeDevices.length;
};

log(homeyBridge, 'Homey bridges');
log(other, 'Other devices');
log(allDevices, 'Total devices')

return 'Overview finished';
