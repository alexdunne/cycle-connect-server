import express from 'express';
import request from 'request'

const app = express();
const port = 8080;

const cycleConnectUrl = 'https://www.cycleconnect.co.uk/';
const bikeDataStartKey = "Operator.GetMapData.setConfig('StationsData',";
const bikeDataEndKey = ');';

// Middleware
app.use(function (req, res, next) {
  console.log('Incoming connection @', Date.now());
  next();
});

app.get('/available-bikes', (req, res) => {
  request(cycleConnectUrl, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const bikeData = getBikeData(body);
      const formattedData = formatBikeData(bikeData);
      const stationsWithBikes = extractStationAndBikeMap(formattedData);
      res.send(stationsWithBikes);
    } else {
      res.send(error, response.statusCode);
    }
  });
});

const getBikeData = (source) => {
  const start = source.indexOf(bikeDataStartKey);
  const end = source.indexOf(bikeDataEndKey, start) + bikeDataEndKey.length; // + length so that we get the data including the bikeDataEndKey

  if (start === -1 || end === -1)
  {
    return null;
  }

  return source.substring(start, end);
}

const formatBikeData = (data) => {
  const strippedData = stripDataKeys(data);
  return JSON.parse(strippedData);
}

const stripDataKeys = (data) => {
  const strippedData =  data.substring(bikeDataStartKey.length);
  return strippedData.substring(0, (strippedData.length) - bikeDataEndKey.length);
}

const extractStationAndBikeMap = (stations) => {
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

app.listen(port, () => {
  console.log('Server listening on port ' + port);
});