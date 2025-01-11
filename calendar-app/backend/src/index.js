// filepath: my-calendar-app/frontend/src/index.js
const express = require('express');
const cors = require('cors');
const { getAuthUrl, getAccessToken, oAuth2Client } = require('./auth');
const { google } = require('googleapis');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.get('/auth', (req, res) => {
  const url = getAuthUrl();
  res.redirect(url);
});

app.get('/auth/callback', async (req, res) => {
  const code = req.query.code;
  const tokens = await getAccessToken(code);
  res.send('Authentication successful! You can close this tab.');
});

app.get('/events', async (req, res) => {
  const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
  const events = await calendar.events.list({
    calendarId: 'primary',
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  });
  res.json(events.data.items);
});

app.post('/events', async (req, res) => {
  const { title, date, time } = req.body;
  const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
  const event = {
    summary: title,
    start: {
      dateTime: new Date(`${date}T${time}:00`).toISOString(),
      timeZone: 'America/Los_Angeles',
    },
    end: {
      dateTime: new Date(`${date}T${time}:00`).toISOString(),
      timeZone: 'America/Los_Angeles',
    },
  };
  const response = await calendar.events.insert({
    calendarId: 'primary',
    resource: event,
  });
  res.json(response.data);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});