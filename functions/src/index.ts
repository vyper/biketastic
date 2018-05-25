import * as functions from 'firebase-functions';
import * as admin     from 'firebase-admin';

import oauth       from './modules/oauth';
import webhooks    from './modules/webhooks';
import createEvent from './modules/events';

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.GCLOUD_PROJECT,
    clientEmail: (functions.config().credential.client_email),
    privateKey: (functions.config().credential.private_key).replace(/\\n/g, '\n')
  }),
  databaseURL: `https://${process.env.GCLOUD_PROJECT}.firebaseio.com`
});

exports.oauth       = functions.https.onRequest(oauth);
exports.webhooks    = functions.https.onRequest(webhooks);
exports.createEvent = functions.firestore
  .document('events/{eventId}')
  .onCreate(event => createEvent(event, console));
