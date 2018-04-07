import * as functions from 'firebase-functions';
import * as express from 'express';
const app = express();

app.get('/strava/webhook', (req, res) => {
  const response = { 'hub.challenge': req.query['hub.challenge'] }

  return res.status(200).json(response);
});

app.post('/strava/webhook', (req, res) => {
  console.log(req.body);
  console.log(req.query);
  console.log(req.params);

  return res.status(200).json({ method: 'post', body: req.body });
});

exports.api = functions.https.onRequest(app);
