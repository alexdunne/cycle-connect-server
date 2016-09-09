var twilio = require('twilio');
var request = require('request');

var cycleConnectUrl = 'https://www.cycleconnect.co.uk/';
var bikeDataStartKey = "Operator.GetMapData.setConfig('StationsData',";
var bikeDataEndKey = ');';

exports.handler = function (event, context, callback) {
  var client = new twilio.RestClient(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  var responseTemplate = '<?xml version="1.0" encoding="UTF-8"?><Response></Response>';

  request(cycleConnectUrl, (error, response, body) => {
    var bikeData = getBikeData(body);
    var formattedData = formatBikeData(bikeData);
    var stationsWithBikes = extractStationAndBikeMap(formattedData);

    var stationWhitelist = ['Becketts Park', 'Train Station'];
    var smsMessage = prettifyStationsWithBikes(stationsWithBikes, stationWhitelist);

    var smsOptions = { 
      to: process.env.TO_PHONE_NUMBER, 
      from: process.env.FROM_PHONE_NUMBER, 
      body: smsMessage 
    };

    client.sendSms(smsOptions, function(error, message) {
      if (error) {
        console.log(error);
      }

      callback(null, responseTemplate);
    });
  });  
};

function getBikeData(source) {
  var start = source.indexOf(bikeDataStartKey);
  var end = source.indexOf(bikeDataEndKey, start) + bikeDataEndKey.length; // + length so that we get the data including the bikeDataEndKey

  if (start === -1 || end === -1) {
    return null;
  }

  return source.substring(start, end);
}

function formatBikeData(data) {
  return JSON.parse(stripDataKeys(data));
}

function stripDataKeys(data) {
  var strippedData =  data.substring(bikeDataStartKey.length);
  return strippedData.substring(0, (strippedData.length) - bikeDataEndKey.length);
}

function extractStationAndBikeMap(stations) {
  return stations.map((station) => {
    return {
      id: station.LocationID,
      name: station.Name,
      totalBikeSlots: station.TotalLocks,
      bikesAvailable: station.TotalAvailableBikes,
      location: {
        latitude: station.Latitude,
        longitude: station.Longitude,
      }
    }
  });
};

/*
 Reduce the array of stations into a list (string with returns) to be displayed by the text
 stationsWithBikes - Array of stations
 stationWhitelist - Array of station names to display. If empty/null show all.
*/
function prettifyStationsWithBikes(stationsWithBikes, stationWhitelist) {
  return stationsWithBikes.reduce(function(list, station) {
    /* 
      If there is a whitelist which has items, check if the current station is in the list. 
      If the station is not in the list then ignore it
    */
    if (stationWhitelist && stationWhitelist.length > 0 && stationWhitelist.indexOf(station.name) === -1) {
      return list;
    }

    return list += (station.name + ': ' + station.bikesAvailable + '/' + station.totalBikeSlots) + '\n';
  }, '');
}
