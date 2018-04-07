"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const express = require("express");
const app = express();
app.get('/strava/webhook', (req, res) => {
    const response = { 'hub.challenge': req.query['hub.challenge'] };
    return res.status(200).json(response);
});
app.post('/strava/webhook', (req, res) => {
    console.log(req.body);
    console.log(req.query);
    console.log(req.params);
    return res.status(200).json({ method: 'post', body: req.body });
});
exports.api = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map