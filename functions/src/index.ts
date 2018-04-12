import * as functions from 'firebase-functions';

import oauth    from './modules/oauth';
import webhooks from './modules/webhooks';

exports.webhooks = functions.https.onRequest(webhooks);
exports.oauth    = functions.https.onRequest(oauth);
