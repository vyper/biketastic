import * as functions from 'firebase-functions';
import * as admin     from 'firebase-admin';
import * as express   from 'express';
import * as BigQuery  from '@google-cloud/bigquery';
import * as crypto    from 'crypto';
import axios          from 'axios';

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

  const uid = `strava:${event.owner_id}`;
  const user = await admin.firestore().collection('users').doc(uid).get();
  const accessToken = user.data().accessToken;

  const response = await axios.get(
    `https://www.strava.com/api/v3/activities/${event.object_id}`,
    { headers: { 'Authorization': `Bearer ${accessToken}` } }
   );

  if (response.data.start_latlng === null)
    delete response.data['start_latlng'];
  if (response.data.end_latlng === null)
    delete response.data['end_latlng'];
  if (response.data.photos.primary !== null) {
    response.data.photos.primary.urls['s600'] = response.data.photos.primary.urls['600'];
    delete response.data.photos.primary.urls['600'];
    response.data.photos.primary.urls['s100'] = response.data.photos.primary.urls['100'];
    delete response.data.photos.primary.urls['100'];
  }
  response.data.start_date       = response.data.start_date.replace('T', ' ').replace(/Z$/, '');
  response.data.start_date_local = response.data.start_date_local.replace('T', ' ').replace(/Z$/, '');
  for (const lap of response.data.laps) {
    lap.start_date       = lap.start_date.replace('T', ' ').replace(/Z$/, '');
    lap.start_date_local = lap.start_date_local.replace('T', ' ').replace(/Z$/, '');
  }
  for (const segment_effort of response.data.segment_efforts) {
    segment_effort.start_date       = segment_effort.start_date.replace('T', ' ').replace(/Z$/, '');
    segment_effort.start_date_local = segment_effort.start_date_local.replace('T', ' ').replace(/Z$/, '');
  }

  const config = functions.config();
  const datasetName = config.bigquery.dataset;
  const tableName = config.bigquery.table;
  const bigquery = new BigQuery();

  try {
    const dataset = await bigquery.dataset(datasetName);
    const table = await dataset.table(tableName);
    const row = {
      insertId: crypto.randomBytes(20).toString('hex'),
      json: response.data
    };
    await table.insert(row, { raw: true });
  } catch (err) {
    console.error(`[BIGQUERY] ${JSON.stringify(err)}`);
    return res.status(500).json({ success: false, message: err })
  }

  return res.status(200).json({ success: true });
});

export default app;
