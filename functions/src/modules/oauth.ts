import * as functions   from 'firebase-functions';
import * as admin       from 'firebase-admin';
import * as express     from 'express';
import * as crypto      from 'crypto';
import axios            from 'axios';
import * as querystring from 'querystring';

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: 'biketastic-x23',
    clientEmail: (process.env.CREDENTIAL_CLIENT_EMAIL || functions.config().credential.client_email),
    privateKey: (process.env.CREDENTIAL_PRIVATE_KEY || functions.config().credential.private_key).replace(/\\n/g, '\n')
  }),
  databaseURL: 'https://biketastic-x23.firebaseio.com'
});

const app = express();

const OAUTH_REDIRECT_URI = 'https://us-central1-biketastic-x23.cloudfunctions.net/oauth/callback';
const OAUTH_SCOPES = 'view_private';

app.get('/token', async (req, res) => {
  const params = {
    client_id: process.env.STRAVA_CLIENT_ID || functions.config().strava.client_id,
    redirect_uri: OAUTH_REDIRECT_URI,
    response_type: 'code',
    scope: OAUTH_SCOPES,
    state: crypto.randomBytes(20).toString('hex')
  };
  const authorizationUri = 'https://www.strava.com/oauth/authorize?' + querystring.stringify(params);

  res.redirect(authorizationUri);
});

app.get('/callback', async (req, res) => {
  const params = {
    client_id: process.env.STRAVA_CLIENT_ID || functions.config().strava.client_id,
    client_secret: process.env.STRAVA_CLIENT_SECRET || functions.config().strava.client_secret,
    code: req.query.code,
  };

  const response = await axios.post('https://www.strava.com/oauth/token', querystring.stringify(params));
  const athlete = response.data.athlete;
  const accessToken = response.data.access_token;
  const stravaUserID = athlete.id;
  const photoURL = athlete.profile;
  const email = athlete.email;
  const displayName = athlete.firstname + ' ' + athlete.lastname;

  const firebaseToken = await createFirebaseAccount(stravaUserID, displayName, photoURL, email, accessToken);

  return res.status(200).json({ token: firebaseToken });
});

function createFirebaseAccount(stravaUserID, displayName, photoURL, email, accessToken) {
  const uid = `strava:${stravaUserID}`;

  const databaseTask = admin.firestore().collection('users').doc(uid).set({ accessToken });

  const userCreationTask = admin.auth().updateUser(uid, {
    displayName: displayName,
    photoURL: photoURL,
    email: email,
  }).catch((error) => {
    if (error.code === 'auth/user-not-found') {
      return admin.auth().createUser({
        uid: uid,
        displayName: displayName,
        photoURL: photoURL,
        email: email,
      });
    }
    throw error;
  });

  return Promise.all([userCreationTask, databaseTask]).then(() => {
    return admin.auth().createCustomToken(uid);
  }).then((token) => {
    return token;
  });
}

export default app;
