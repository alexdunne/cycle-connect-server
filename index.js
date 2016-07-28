import http from 'http';
import express from 'express';

const app = express();
const port = 8080;

app.get('/available-bikes', (req, res) => {

});

app.listen(port, () => {
  console.log('Server listening on port ' + port);
});