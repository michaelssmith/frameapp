const rp = require('request-promise');
const https = require('https');
const debug = require('debug')('app:weatherLookup');
const weather = require('weather-js');

const agentOptions = {
  host: 'c2.dev.experiancs.co.uk',
  port: '443',
  path: '/',
  rejectUnauthorized: false,
};

const agent = new https.Agent(agentOptions);
const serviceUri = 'https://c2.dev.experiancs.co.uk/api/insurancevehicle/external';

async function getWeather() {
  var report;

  weather.find({ search: 'Ipswich, UK', degreeType: 'C' }, (err, result) => {
    if (err) {
      console.log(err);
    }

    report = result;
    //debug(result);
    //return result;
  });

  debug(report);
  return report;
}

async function getModels(manufacturer) {
  const options = {
    uri: `${serviceUri}/cars/manufacturersummaries`,
    method: 'GET',
    json: true,
    agent
  };

  try {
    const result = await rp(options);
    const mans = JSON.parse(result);

    for (let i = 0; i < mans.length; i += 1) {
      if (mans[i].Manufacturer === manufacturer) {
        const modelNames = new Array(mans[i].Models.length);

        for (let j = 0; j < mans[i].Models.length; j += 1) {
          const modName = mans[i].Models[j].Name;
          modelNames[j] = modName;
        }

        return modelNames;
      }
    }
  } catch (err) {
    debug(err);
  }

  return 0;
}

async function getTrims(manufacturer, model) {
  const options = {
    uri: `${serviceUri}/cars/trims/${manufacturer}/${model}`,
    method: 'GET',
    json: true,
    agent
  };

  try {
    const result = await rp(options);
    const trims = JSON.parse(result);

    const trimNames = new Array(trims.length);
    for (let i = 0; i < trims.length; i += 1) {
      trimNames[i] = [trims[i].AbiCode, trims[i].Description];
    }

    return trimNames;
  } catch (err) {
    debug(err);
  }

  return 0;
}

async function getVehicleByRegistration(registration) {
  const options = {
    uri: `${serviceUri}/vehicle/registration/${registration}`,
    method: 'GET',
    json: true,
    agent
  };

  try {
    const result = await rp(options);
    const cars = JSON.parse(result);
    if (cars.length > 0) {
      return (cars[0]);
    }
  } catch (err) {
    debug(err);
  }

  return 0;
}

module.exports = {
  getWeather,
  getModels,
  getTrims,
  getVehicleByRegistration
};
