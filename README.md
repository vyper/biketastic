# biketastic

## Configure

```
firebase --project biketastic-x23 functions:config:set \
          strava.client_id="${STRAVA_CLIENT_ID}" \
          strava.client_secret="${STRAVA_CLIENT_SECRET}" \
          credential.client_email="${CREDENTIAL_CLIENT_EMAIL}" \
          credential.private_key="${CREDENTIAL_PRIVATE_KEY}"
```
