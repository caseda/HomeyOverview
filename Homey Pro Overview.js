// Set any of these values below how the result will be returned or displayed
const returnObject = false; // Return the enabled values as a valid JSON object (Stringified)
const returnString = true; // Return the enabled values as a string seperated by the below "stringSeparator"
const setToDeviceTag = false; // Set the return Object or String (default) to a "HomeyScript tag"
const setToLogicVariable = false; // Set the return Object or String (default) to a "Logic variable"
const tagName = 'Homey Overview'; // HomeyScript tag's name to use
let variableID = ''; // The ID of the Logic variable, only a "Text" variable, this has a higher priority then name
const variableName = 'Homey Overview'; // The Name of the Logic variable, only a "Text" variable
const stringSeparator = '\n'; // Seperate the values in the returned string ("\n", is a new line)
const tagSeparator = '\n'; // Seperate the values (string only) for the tag or logic variable ("\n", is a new line)

// Set any of these below to "true;" or "false;" to add (true) or hide (false) it from the list
const showHeaders = true; // Show the headers like "Main" or "Devices", with "returnString" only
const showName = true; // Show the current Homey name
const showVersion = true; // Show current Homey version
const showModel = true; // Show Homey model
const showUptime = true; // Show the uptime
const showNetwork = true; // Show "network" related values
const showThrottle = true; // Show "throttled" related values
const showUpdate = true; // Show available Homey update
const showStoragePre2023 = false; // Show used storage value on Homey Pro 2016 - 2019, disabled by default as this is a very heavy function for the older Homey Pro's
const showStorage2023 = false; // Show used storage value on Homey Pro 2023

const showMain = true; // Show everything (enabled) under "Main"
const showUsers = true; // Show amount of users
const showApps = true; // Show amount of apps
const showZones = true; // Show amount of zones
const showNotifications = true; // Show amount of notifications
const showInsights = true; // Show amount of insight entries
const showLogic = true; // Show amount of logic variables
const showFlows = true; // Show amount of Flows
const showAdvancedFlows = true; // Show amount of advanced Flows
const showImages = true; // Show amount of images (Homey Pro 2023 only)
const showMoods = true; // Show amount of Moods (Homey Pro 2023 only)
const showAlarms = true; // Show amount of Alarm clocks
const showScripts = true; // Show amount of HomeyScript scripts
const showBL = true; // Show amount of Better Logic variables (if installed)

const showDevices = true; // Show everything (enabled) under "Devices"
const showUnavailable = true // Show amount of "Unavailable" devices
const showVirtual = true; // Show amount of virtual devices
const showIR = true; // Show amount of Infra Red devices
const showZwave = true; // Show amount of Z-Wave devices
const showZigbee = true; // Show amount of ZigBee devices
const showHomeyBridge = true; // Show amount of Homey Bridge devices
const showOtherDevices = true; // Show amount of other devices
const showTotalDevices = true // Show amount of total devices

// ================= Don't edit anything below here =================

const returnableObject = {};
const returnableString = [];

returnableObject['Script_version'] = 'v1.1';
if (showHeaders) returnableString.push('--------------- Homey Pro Tagged Overview v1.1 --------------');

if (showName) {
  await Homey.system.getSystemName()
    .then(result => {
      returnableObject['Homey_name'] = result;
      returnableString.push('Homey name: ' + result);
    })
    .catch(() => log('Failed: Getting Homey name'));
}

let homeyPlatformVersion, homeyVersion, timezone;
await Homey.system.getInfo()
  .then(result => {
    if (showVersion) {
      returnableObject['Homey_version'] = result.homeyVersion;
      returnableString.push('Homey version: ' + result.homeyVersion);
    }
    if (showModel) {
      returnableObject['Homey_model'] = result.homeyModelName, '(' + result.cpus.length + ' core(s))';
      returnableString.push('Homey model: ' + result.homeyModelName + ' (' + result.cpus.length + ' core(s))');
    }
    homeyPlatformVersion = result.homeyPlatformVersion || 1;
    homeyVersion = result.homeyVersion;
    timezone = result.timezone;

    if (showUptime) {
      const d = Math.floor(result.uptime / 86400);
      const h = Math.floor((result.uptime % 86400) / 3600);
      const m = Math.floor((result.uptime % 3600) / 60);
      const s = Math.floor(result.uptime % 60);
      let uptimeHuman = '';
      if (d > 0) uptimeHuman += d + ' day' + (d > 1 ? 's, ' : ', ');
      uptimeHuman += h + ' hour' + (h > 1 ? 's, ' : ', ');
      uptimeHuman += m + ' minute' + (m > 1 ? 's, ' : ', ');
      uptimeHuman += s + ' second' + (s > 1 ? 's' : '');
      returnableObject['Uptime'] = {};
      returnableObject['Uptime']['Overview'] = Math.round(result.uptime) + ' (' + uptimeHuman + ')';
      returnableObject['Uptime']['Seconds'] = Math.round(result.uptime);
      returnableObject['Uptime']['Human'] = uptimeHuman;
      returnableString.push('Uptime: ' + Math.round(result.uptime) + ' (' + uptimeHuman + ')');
    }

    if (homeyPlatformVersion === 2) {
      if (showNetwork) {
        returnableObject['WiFi'] = result.wifiConnected;
        returnableObject['WiFi_human'] = (result.wifiConnected) ? 'Connected' : 'Not connected';
        returnableString.push('WiFi: ' + returnableObject['WiFi_human']);
        returnableObject['Ethernet'] = result.ethernetConnected;
        returnableObject['Ethernet_human'] = (result.ethernetConnected) ? 'Connected' : 'Not connected';
        returnableString.push('Ethernet: ' + returnableObject['Ethernet_human']);
      }
      if (showThrottle) {
        returnableObject['Throttled'] = result.videoCoreThrottleOccured;
        returnableObject['Throttled_human'] = (result.videoCoreThrottleOccured) ? 'Yes' : 'No';
        returnableObject['Throttled_current'] = result.videoCoreThrottleCurrently;
        returnableObject['Throttled_current_human'] = (result.videoCoreThrottleCurrently) ? 'Yes' : 'No';
        returnableString.push('Throttled: ' + returnableObject['Throttled_human'] + ' (Currently: ' + returnableObject['Throttled_current_human'] + ')');
        returnableObject['Under_voltage'] = result.videoCoreUndervoltageOccured;
        returnableObject['Under_voltage_human'] = (result.videoCoreUndervoltageOccured) ? 'Yes' : 'No'
        returnableObject['Under_voltage_current'] = result.videoCoreUnderVoltageCurrently;
        returnableObject['Under_voltage_current_human'] = (result.videoCoreUnderVoltageCurrently) ? 'Yes' : 'No';
        returnableString.push('Under_voltage: ' + returnableObject['Under_voltage_human'] + ' (Currently: ' + returnableObject['Under_voltage_current_human'] + ')');
      }
    }
  })
  .catch((err) => log(err));

if (showUpdate) {
    await Homey.updates.getUpdates()
      .then(result => {
        if(result.length > 0) {
          returnableObject['Update_available'] = true;
          returnableObject['Update_available_human'] = 'Yes';
          returnableObject['Update_version'] = result[0].version;
          returnableString.push('Update available: ' + result[0].version);
        } else {
          returnableObject['Update_available'] = false;
          returnableObject['Update_available human'] = 'No';
          returnableObject['Update_version'] = null;
          returnableString.push('Update_available: No');
        }
      })
      .catch(() => log('Failed: Getting updates'));
}

if (
  (showStoragePre2023 && homeyPlatformVersion === 1)
  || (showStorage2023 && homeyPlatformVersion === 2)
) {
  await Homey.system.getStorageInfo()
    .then(result => {
      let sizeFree = result.free + 'B';
      let sizeFreeNum = result.free;
      if (result.free >= 1000000000) {
        sizeFree = (result.free / 1000000000).toFixed(2) + ' GB';
      } else if (result.free >= 1000000) {
        sizeFree = (result.free / 1000000).toFixed(2) + ' MB';
      }
      returnableObject['Storage'] = {};
      returnableObject['Storage']['Overview'] = (result.total / 1000000000).toFixed(2) + ' GB (' + sizeFree + ' free)';
      returnableObject['Storage']['Used'] = {};
      returnableObject['Storage']['Used']['Bytes'] = result.total;
      returnableObject['Storage']['Used']['KB'] = Math.round(result.total / 10) / 100;
      returnableObject['Storage']['Used']['MB'] = Math.round(result.total / 10000) / 100;
      returnableObject['Storage']['Used']['GB'] = Math.round(result.total / 10000000) / 100;
      returnableObject['Storage']['Free'] = {};
      returnableObject['Storage']['Free']['Bytes'] = sizeFreeNum;
      returnableObject['Storage']['Free']['KB'] = Math.round(sizeFreeNum / 10) / 100;
      returnableObject['Storage']['Free']['MB'] = Math.round(sizeFreeNum / 10000) / 100;
      returnableObject['Storage']['Free']['GB'] = Math.round(sizeFreeNum / 10000000) / 100;
      returnableString.push('Storage: ' + (result.total / 1000000000).toFixed(2) + ' GB (' + sizeFree + ' free)');
    })
    .catch(() => log('Failed: Getting storage information'));
}

if (showMain) {
  if (showHeaders) returnableString.push(stringSeparator + '------------------ Main ---------------------');

  if (showUsers) {
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

        returnableObject['Users'] = {};
        returnableObject['Users']['Overview'] = Object.keys(result).length + ' Users' + ' ('  + owner + ' Owner, ' + manager + ' Manager, ' + user + ' User, ' + guest + ' Guest)';
        returnableObject['Users']['Total'] = Object.keys(result).length;
        returnableObject['Users']['Owner'] = owner;
        returnableObject['Users']['Manager'] = manager;
        returnableObject['Users']['User'] = user;
        returnableObject['Users']['Guest'] = guest;
        returnableString.push(Object.keys(result).length + ' Users' + ' ('  + owner + ' Owner, ' + manager + ' Manager, ' + user + ' User, ' + guest + ' Guest)');
      })
      .catch(() => log('Failed: Getting users'));
  }

  if (showApps) {
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

        returnableObject['Apps'] = {};
        returnableObject['Apps']['Overview'] = Object.keys(result).length + ' Apps' + ' (' + stableApps.length + ' Stable, ' + testApps.length + ' Test, ' + devApps.length + ' Development/Community Appstore, ' + sdkv2Apps.length + ' SDKv2, '  + sdkv3Apps.length + ' SDKv3, '  + updateableApps.length + ' Updateable, ' + disabledApps.length + ' Disabled/Crashed)';
        returnableObject['Apps']['Total'] = Object.keys(result).length;
        returnableObject['Apps']['Stable'] = stableApps.length;
        returnableObject['Apps']['Stable_names'] = stableApps;
        returnableObject['Apps']['Test'] = testApps.length;
        returnableObject['Apps']['Test_names'] = testApps;
        returnableObject['Apps']['Development'] = devApps.length;
        returnableObject['Apps']['Development_names'] = devApps;
        returnableObject['Apps']['SDKv2'] = sdkv2Apps.length;
        returnableObject['Apps']['SDKv2_names'] = sdkv2Apps;
        returnableObject['Apps']['SDKv3'] = sdkv3Apps.length;
        returnableObject['Apps']['SDKv3_names'] = sdkv3Apps;
        returnableObject['Apps']['Updateable'] = updateableApps.length;
        returnableObject['Apps']['Updateable_names'] = updateableApps;
        returnableObject['Apps']['Disabled'] = disabledApps.length;
        returnableObject['Apps']['Disabled_names'] = disabledApps;
        returnableString.push(Object.keys(result).length + ' Apps' + ' (' + stableApps.length + ' Stable, ' + testApps.length + ' Test, ' + devApps.length + ' Development/Community Appstore, ' + sdkv2Apps.length + ' SDKv2, '  + sdkv3Apps.length + ' SDKv3, '  + updateableApps.length + ' Updateable, ' + disabledApps.length + ' Disabled/Crashed)');
      })
      .catch(() => log('Failed: Getting apps'));
  }

  if (showZones) {
    let zones = {};
    await Homey.zones.getZones()
      .then(result => {
        Object.keys(result).forEach(function(key) {
          zones[result[key].id] = result[key].name;
        });
        returnableObject['Zones'] = {};
        returnableObject['Zones']['Overview'] = Object.keys(result).length + ' Zones';
        returnableObject['Zones']['Total'] = Object.keys(result).length;
        returnableObject['Zones']['Names'] = Object.entries(zones).sort((a, b) => a[1].localeCompare(b[1])).map(zone => zone[1]);
        returnableString.push(Object.keys(result).length + ' Zones');
      })
      .catch(() => log('Failed: Getting zones'));
  }

  if (showNotifications) {
    await Homey.notifications.getNotifications()
      .then(result => {
        returnableObject['Notifications'] = {};
        returnableObject['Notifications']['Overview'] = (Object.keys(result).length || 0) + ' Notifications (Timeline)';
        returnableObject['Notifications']['Total'] = Object.keys(result).length || 0;
        returnableString.push((Object.keys(result).length || 0) + ' Notifications (Timeline)');
      })
      .catch(() => log('Failed: Getting notifications'));
  }

  if (showInsights) {
    await Homey.insights.getLogs()
      .then(result => {
        let boolean = 0, number = 0;

        Object.keys(result).forEach(function(key) {
          if (result[key].type === 'number') number++;
          if (result[key].type === 'boolean') boolean++;
        });

        returnableObject['Insights'] = {};
        returnableObject['Insights']['Overview'] = Object.keys(result).length + ' Insight entries' + ' (' + boolean + ' Boolean (Yes/No), ' + number + ' Number)';
        returnableObject['Insights']['Total'] = Object.keys(result).length;
        returnableObject['Insights']['Boolean'] = boolean;
        returnableObject['Insights']['Number'] = number;
        returnableString.push(Object.keys(result).length + ' Insight entries' + ' (' + boolean + ' Boolean (Yes/No), ' + number + ' Number)');
      })
      .catch(() => log('Failed: Getting Insights'));
  }

  if (showLogic) {
    await Homey.logic.getVariables()
      .then(result => {
        let boolean = [], number = [], string = [];
      
        Object.keys(result).forEach(function(key) {
          if (result[key].type === 'boolean') boolean.push(result[key].name + ' (ID: ' + result[key].id + ')');
          if (result[key].type === 'number') number.push(result[key].name + ' (ID: ' + result[key].id + ')');
          if (result[key].type === 'string') string.push(result[key].name + ' (ID: ' + result[key].id + ')');
        });

        returnableObject['Logic'] = {};
        returnableObject['Logic']['Overview'] = Object.keys(result).length + ' Logic Variables' + ' (' + boolean.length + ' Boolean (Yes/No), ' + number.length + ' Number, ' + string.length + ' String (Text))';
        returnableObject['Logic']['Total'] = Object.keys(result).length;
        returnableObject['Logic']['Boolean'] = boolean.length;
        returnableObject['Logic']['Boolean_names'] = boolean;
        returnableObject['Logic']['Number'] = number.length;
        returnableObject['Logic']['Number_names'] = number;
        returnableObject['Logic']['String'] = string.length;
        returnableObject['Logic']['String_names'] = string;
        returnableString.push(Object.keys(result).length + ' Logic Variables' + ' (' + boolean.length + ' Boolean (Yes/No), ' + number.length + ' Number, ' + string.length + ' String (Text))');

      })
      .catch(() => log('Failed: Getting variables'));
  }

  if (showFlows) {
    await Homey.flow.getFlows()
      .then(result => {
        let disabledFlows = [], brokenFlows = [];
        Object.keys(result).forEach(function(key) {
          if (!result[key].enabled) disabledFlows.push(result[key].name);
          if (result[key].broken) brokenFlows.push(result[key].name);
        });

        returnableObject['Flows'] = {};
        returnableObject['Flows']['Overview'] = Object.keys(result).length + ' Flows' + ' ('  + brokenFlows.length + ' Broken, ' + disabledFlows.length + ' Disabled)';
        returnableObject['Flows']['Total'] = Object.keys(result).length;
        returnableObject['Flows']['Broken'] = brokenFlows.length;
        returnableObject['Flows']['Broken_names'] = brokenFlows;
        returnableObject['Flows']['Disabled'] = disabledFlows.length;
        returnableObject['Flows']['Disabled_names'] = disabledFlows;
        returnableString.push(Object.keys(result).length + ' Flows' + ' ('  + brokenFlows.length + ' Broken, ' + disabledFlows.length + ' Disabled)');
      })
      .catch(() => log('Failed: Getting flows'));
  }

  if (showAdvancedFlows) {
    await Homey.flow.getAdvancedFlows()
      .then(result => {
        let disabledFlows = [], brokenFlows = [];
        Object.keys(result).forEach(function(key) {
          if (!result[key].enabled) disabledFlows.push(result[key].name);
          if (result[key].broken) brokenFlows.push(result[key].name);
        });

        returnableObject['Advanced flows'] = {};
        returnableObject['Advanced flows']['Overview'] = Object.keys(result).length + ' Flows' + ' ('  + brokenFlows.length + ' Broken, ' + disabledFlows.length + ' Disabled)';
        returnableObject['Advanced flows']['Total'] = Object.keys(result).length;
        returnableObject['Advanced flows']['Broken'] = brokenFlows.length;
        returnableObject['Advanced flows']['Broken_names'] = brokenFlows;
        returnableObject['Advanced flows']['Disabled'] = disabledFlows.length;
        returnableObject['Advanced flows']['Disabled_names'] = disabledFlows;
        returnableString.push(Object.keys(result).length + ' Flows' + ' ('  + brokenFlows.length + ' Broken, ' + disabledFlows.length + ' Disabled)');
      })
      .catch(() => log('Failed: Getting advanced flows'));
  }

  if (showImages && homeyPlatformVersion === 2) {
    await Homey.images.getImages()
      .then(result => {
        let images = [];

        Object.keys(result).forEach(function(key) {
          if (result[key].id !== 'dummy') {
            images.push(result[key].url);
          }
        });

        returnableObject['Images'] = {};
        returnableObject['Images']['Overview'] = images.length + ' Images';
        returnableObject['Images']['Total'] = images.length;
        returnableObject['Images']['URLs'] = images;
        returnableString.push(images.length + ' Images');
      })
      .catch(() => log('Failed: Getting images'));
  }

  if (showMoods) {
    if (homeyPlatformVersion === 2 && Homey.moods !== undefined) {
      await Homey.moods.getMoods()
        .then(result => {
          let moods = [];

          Object.keys(result).forEach(async function(key) {
            moods.push(zones[result[key].zone] + ' : ' + result[key].name);
          });

          returnableObject['Moods'] = {};
          returnableObject['Moods']['Overview'] = moods.length + ' Moods';
          returnableObject['Moods']['Total'] = moods.length;
          returnableObject['Moods']['Names'] = moods;
          returnableString.push(moods.length + ' Moods');
        })
        .catch(() => log('Failed: Getting Moods'));
    }
  }

  if (showAlarms) {
    await Homey.alarms.getAlarms()
      .then(result => {
        let enabled = 0;
        Object.keys(result).forEach(function(key) {
          if (result[key].enabled) enabled++;
        });

        returnableObject['Alarms'] = {};
        returnableObject['Alarms']['Overview'] = Object.keys(result).length + ' Alarms' + ' (' + enabled + ' Enabled)';
        returnableObject['Alarms']['Total'] = Object.keys(result).length;
        returnableObject['Alarms']['Enabled'] = enabled;
        returnableString.push(Object.keys(result).length + ' Alarms' + ' (' + enabled + ' Enabled)');
      })
      .catch(() => log('Failed: Getting alarms'));
  }

  if (showScripts) {
    await Homey.apps.getAppSettings({id: 'com.athom.homeyscript'})
      .then(result => {
        returnableObject['HomeyScript'] = {};
        returnableObject['HomeyScript']['Overview'] = Object.keys(result.scripts).length + ' HomeyScript scripts' + ' (' + ((result.tokens) ? Object.keys(result.tokens).length : 0) + ' Token/Tag)';
        returnableObject['HomeyScript']['Total'] = Object.keys(result.scripts).length;
        returnableObject['HomeyScript']['Token/Tag'] = ((result.tokens) ? Object.keys(result.tokens).length : 0);
        returnableString.push(Object.keys(result.scripts).length + ' HomeyScript scripts' + ' (' + ((result.tokens) ? Object.keys(result.tokens).length : 0) + ' Token/Tag)');
      })
      .catch(() => {
        if (homeyPlatformVersion === 2 && homeyVersion.localeCompare("10.0.0-rc.80", undefined, {numeric: true, preversion: ["rc"]}) < 0) {
          log('Failed: Getting HomeyScript, Homey Pro (early 2023): getting information from apps is currently unavailable.');
        }
        else {
          log('Failed: Getting HomeyScript');
        }
      });
  }

  if (showBL) {
    await Homey.apps.getAppSettings({id: 'net.i-dev.betterlogic'})
      .then(result => {
        let boolean = 0, number = 0, string = 0;
        Object.keys(result.variables).forEach(function(key) {
          if (result.variables[key].type === 'boolean') boolean++;
          if (result.variables[key].type === 'number') number++;
          if (result.variables[key].type === 'string') string++;
        });

        returnableObject['BetterLogic'] = {};
        returnableObject['BetterLogic']['Overview'] = Object.keys(result.variables).length + ' Better Logic Variables' + ' (' + boolean + ' Boolean (Yes/No), ' + number + ' Number, ' + string + ' String)';
        returnableObject['BetterLogic']['Total'] = Object.keys(result.variables).length;
        returnableObject['BetterLogic']['Boolean'] = boolean;
        returnableObject['BetterLogic']['Number'] = number;
        returnableObject['BetterLogic']['String'] = string;
        returnableString.push(Object.keys(result.variables).length + ' Better Logic Variables' + ' (' + boolean + ' Boolean (Yes/No), ' + number + ' Number, ' + string + ' String)');
      })
      .catch(() => {
        if (homeyPlatformVersion === 2 && homeyVersion.localeCompare("10.0.0-rc.80", undefined, {numeric: true, preversion: ["rc"]}) < 0) {
          log('Failed: Getting Better logic, Homey Pro (early 2023): getting information from apps is currently unavailable.');
        }
      });
  }
}

if (showDevices) {
  if (
    showUnavailable
    || showVirtual
    || showIR
    || showZwave
    || showZigbee
    || showOtherDevices
    || showTotalDevices
  ) returnableObject['Devices'] = {};

  if (showHeaders) returnableString.push(stringSeparator + '----------------- Devices -------------------');

  let allDevices = 0, other = 0, homeyBridge = 0, zwaveDevices = [], zwaveNodes = [], zwaveRouterDevices = [], zwaveBatteryDevices = [], zwaveSxDevices = [], zwaveS0Devices = [], zwaveS2AuthDevices = [], zwaveS2UnauthDevices = [], unavailableDevices = [];

  await Homey.devices.getDevices()
    .then(result => {
      let virtualNames = [], irNames = [];

      Object.keys(result).forEach(function(key) {
        const device = result[key];
        const virtualDeviceApps = [
          'homey:virtualdriver',
          'homey:app:com.arjankranenburg.virtual',
          'homey:app:nl.qluster-it.DeviceCapabilities',
          'homey:app:nl.fellownet.chronograph',
          'homey:app:net.i-dev.betterlogic',
          'homey:app:com.swttt.devicegroups',
          'homey:app:com.sysInternals',
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

          if (showZwave) {
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
        }
        else if (
          !device.flags.includes('zwave')
          && !device.flags.includes('zigbee')
        ) {
          other++;
        }
      });

      allDevices = virtualNames.length + irNames.length + zwaveDevices.length + other + homeyBridge;

      if (showUnavailable) {
        returnableObject['Devices']['Unavailable'] = {};
        returnableObject['Devices']['Unavailable']['Overview'] = unavailableDevices.length + ' Unavailable devices';
        returnableObject['Devices']['Unavailable']['Total'] = unavailableDevices.length;
        returnableObject['Devices']['Unavailable']['Names'] = unavailableDevices;
        returnableString.push(unavailableDevices.length + ' Unavailable devices');
      }
      if (showVirtual) {
        returnableObject['Devices']['Virtual'] = {};
        returnableObject['Devices']['Virtual']['Overview'] = virtualNames.length + ' Virtual devices';
        returnableObject['Devices']['Virtual']['Total'] = virtualNames.length;
        returnableObject['Devices']['Virtual']['Names'] = virtualNames;
        returnableString.push(virtualNames.length + ' Virtual devices');
      }
      if (showIR) {
        returnableObject['Devices']['InfraRed'] = {};
        returnableObject['Devices']['InfraRed']['Overview'] = irNames.length + ' Infrared (database) devices';
        returnableObject['Devices']['InfraRed']['Total'] = irNames.length;
        returnableObject['Devices']['InfraRed']['Names'] = irNames;
        returnableString.push(irNames.length + ' Infrared (database) devices');
      }
    })
    .catch(() => log('Failed: Getting devices'));

  if (showZwave) {
    await Homey.zwave.getState()
      .then(result => {
        const unknownNodes = result.zw_state.nodes
          .filter((el) => !zwaveNodes.includes(el))
          .sort((a, b) => a - b)
          .slice(1);
        
        returnableObject['Devices']['Zwave'] = {};
        returnableObject['Devices']['Zwave']['Overview'] = zwaveDevices.length + ' Z-Wave devices' + ' (' + zwaveSxDevices.length + ' Unsecure, ' + zwaveS0Devices.length + ' Secure (S0), ' + zwaveS2AuthDevices.length + ' Secure (S2 Authenticated), ' + zwaveS2UnauthDevices.length + ' Secure (S2 Unauthenticated), ' + zwaveRouterDevices.length + ' Router, ' + zwaveBatteryDevices.length + ' Battery, ' + result.zw_state.noAckNodes.length + ' Unreachable, ' + unknownNodes.length + ' Unknown)';
        returnableObject['Devices']['Zwave']['Total'] = zwaveDevices.length;
        returnableObject['Devices']['Zwave']['Unsecure'] = zwaveSxDevices.length;
        returnableObject['Devices']['Zwave']['Unsecure_names'] = zwaveSxDevices;
        returnableObject['Devices']['Zwave']['Secure_(S0)'] = zwaveS0Devices.length;
        returnableObject['Devices']['Zwave']['Secure_(S0)_names'] = zwaveS0Devices;
        returnableObject['Devices']['Zwave']['Secure_(S2_Authenticated)'] = zwaveS2AuthDevices.length;
        returnableObject['Devices']['Zwave']['Secure_(S2_Authenticated)_names'] = zwaveS2AuthDevices;
        returnableObject['Devices']['Zwave']['Secure_(S2_Unauthenticated)'] = zwaveS2UnauthDevices.length;
        returnableObject['Devices']['Zwave']['Secure_(S2_Unauthenticated)_names'] = zwaveS2UnauthDevices;
        returnableObject['Devices']['Zwave']['Router'] = zwaveRouterDevices.length;
        returnableObject['Devices']['Zwave']['Router_names'] = zwaveRouterDevices;
        returnableObject['Devices']['Zwave']['Battery'] = zwaveBatteryDevices.length;
        returnableObject['Devices']['Zwave']['Battery_names'] = zwaveBatteryDevices;
        returnableObject['Devices']['Zwave']['Unreachable'] = result.zw_state.noAckNodes.length;
        returnableObject['Devices']['Zwave']['Unreachable_names'] = result.zw_state.noAckNodes;
        returnableObject['Devices']['Zwave']['Unknown'] = unknownNodes.length;
        returnableObject['Devices']['Zwave']['Unknown_names'] = unknownNodes;
        returnableString.push(zwaveDevices.length + ' Z-Wave devices' + ' (' + zwaveSxDevices.length + ' Unsecure, ' + zwaveS0Devices.length + ' Secure (S0), ' + zwaveS2AuthDevices.length + ' Secure (S2 Authenticated), ' + zwaveS2UnauthDevices.length + ' Secure (S2 Unauthenticated), ' + zwaveRouterDevices.length + ' Router, ' + zwaveBatteryDevices.length + ' Battery, ' + result.zw_state.noAckNodes.length + ' Unreachable, ' + unknownNodes.length + ' Unknown)');
      })
      .catch(() => log('Failed: Getting Z-Wave state'));
  }

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
      zigbeeDevices.push(deviceName);

      if (device.type.toLowerCase() === 'router') routerDevices.push(deviceName);
      if (device.type.toLowerCase() === 'enddevice') endDevices.push(deviceName);
    });
    
    if (showZigbee) {
      returnableObject['Devices']['Zigbee'] = {};
      returnableObject['Devices']['Zigbee']['Overview'] = zigbeeDevices.length + ' Zigbee devices' + ' (' + routerDevices.length + ' Router, ' + endDevices.length + ' End device)';
      returnableObject['Devices']['Zigbee']['Total'] = zigbeeDevices.length;
      returnableObject['Devices']['Zigbee']['Router'] = routerDevices.length;
      returnableObject['Devices']['Zigbee']['Router_names'] = routerDevices;
      returnableObject['Devices']['Zigbee']['End_device'] = endDevices.length;
      returnableObject['Devices']['Zigbee']['End_device_names'] = endDevices;
      returnableString.push(zigbeeDevices.length + ' Zigbee devices' + ' (' + routerDevices.length + ' Router, ' + endDevices.length + ' End device)');
    }

    allDevices += zigbeeDevices.length;
  };
  
  if (showHomeyBridge) {
    returnableObject['Devices']['Homey_Bridge'] = {};
    returnableObject['Devices']['Homey_Bridge']['Overview'] = homeyBridge + ' Homey Bridges';
    returnableObject['Devices']['Homey_Bridge']['Total'] = homeyBridge;
    returnableString.push(homeyBridge + ' Homey Bridges');
  }

  if (showOtherDevices) {
    returnableObject['Devices']['Other'] = {};
    returnableObject['Devices']['Other']['Overview'] = other + ' Other devices';
    returnableObject['Devices']['Other']['Total'] = other;
    returnableString.push(other + ' Other devices');
  }

  if (showTotalDevices) {
    returnableObject['Devices']['Total'] = {};
    returnableObject['Devices']['Total']['Overview'] = allDevices + ' Total devices';
    returnableObject['Devices']['Total']['Total'] = allDevices;
    returnableString.push(allDevices + ' Total devices');
  }
}

if (setToDeviceTag) {
  let value = returnableString.join(tagSeparator);
  if (returnObject) value = JSON.stringify(returnableObject);

  await tag(tagName, value);
}
else {
  tag(tagName, null);
}

if (setToLogicVariable) {
  let value = returnableString.join(tagSeparator);
  if (returnObject) value = JSON.stringify(returnableObject);

  // If no variable ID specified, try to find it by name
  if (!variableID) {
    await Homey.logic.getVariables()
      .then(result => {
        const findVariable = Object.values(result).find(obj => obj.name === variableName);
        variableID = findVariable ? findVariable.id : '';
      });
  }

  if (variableID) await Homey.logic.updateVariable({ id: variableID, variable: {value} })
    .then(result => {
      if (result) log('Set variable: ' + result.name + ' (' + result.id + ')');
    })
    .catch(err => log(err.description));
  else {
    log('Failed to find variable: ' + variableName);
  }
}

if (returnObject) {
  // log(returnableObject);
  return JSON.stringify(returnableObject);
}
if (returnString) {
  // log(returnableString.join('\n'));
  return returnableString.join(stringSeparator);
}

return 'Overview script finished, without returning values';
