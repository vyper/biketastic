import * as admin     from 'firebase-admin';
import * as express   from 'express';

const app = express();

app.get('/strava', (req, res) => {
  const response = { 'hub.challenge': req.query['hub.challenge'] }

  return res.status(200).json(response);
});

app.post('/strava', async (req, res) => {
  const event = req.body;
  console.log('[STRAVA] Event ' + event.aspect_type + ': ' + event.object_type + ' (' + event.object_id + ') for ' + event.owner_id + ' (updates: ' + JSON.stringify(event.updates) + ' @ ' + event.event_time);
  await admin.firestore().collection('events').add(event);

  if (event.object_type !== 'activity') {
    console.log('[FINISHED] Object type is not activity');
    return res.status(200).json({ success: true, bigquery: false });
  }

  return res.status(200).json({ success: true });
});

export default app;
