import * as express from 'express';

const app = express();

app.get('/strava', (req, res) => {
  const response = { 'hub.challenge': req.query['hub.challenge'] }

  return res.status(200).json(response);
});

app.post('/strava', (req, res) => {
  console.log(req.body);
  console.log(req.query);
  console.log(req.params);

  return res.status(200).json({ method: 'post', body: req.body });
});

export default app;
