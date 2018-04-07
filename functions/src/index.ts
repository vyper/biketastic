import * as functions from 'firebase-functions';

import webhooks from './modules/webhooks';

exports.webhooks = functions.https.onRequest(webhooks);
