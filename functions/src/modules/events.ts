import * as functions from 'firebase-functions';
import * as admin     from 'firebase-admin';

const createEvent = async (event) => {
  const uid = `strava:${event.data().owner_id}`;
  const user = await admin.firestore().collection('users').doc(uid).get();
  console.log(`${uid} => ${user.data().accessToken}`);

  return true;
};

export default createEvent;
