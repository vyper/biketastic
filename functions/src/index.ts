import * as functions from 'firebase-functions';
import * as admin     from 'firebase-admin';

import oauth       from './modules/oauth';
import webhooks    from './modules/webhooks';
import createEvent from './modules/events';

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: 'biketastic-x23',
    clientEmail: (functions.config().credential.client_email),
    privateKey: (functions.config().credential.private_key).replace(/\\n/g, '\n')
  }),
  databaseURL: 'https://biketastic-x23.firebaseio.com'
});

exports.webhooks = functions.https.onRequest(webhooks);
exports.oauth    = functions.https.onRequest(oauth);

exports.createEvent = functions.firestore
  .document('events/{eventId}')
  .onWrite(event => createEvent);
