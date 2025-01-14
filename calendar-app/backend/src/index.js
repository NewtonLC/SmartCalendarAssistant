const express = require('express');
const cors = require('cors');
const { getAuthUrl, getAccessToken, loadSavedCredentialsIfExist, oAuth2Client } = require('./auth');
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
  if (!loadSavedCredentialsIfExist()) {
    return res.status(401).send('Authentication required');
  }
  const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
  try {
    const events = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });
    res.json(events.data.items);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).send('Error fetching events');
  }
});

app.post('/events', async (req, res) => {
  if (!loadSavedCredentialsIfExist()) {
    return res.status(401).send('Authentication required');
  }
  const { title, date, time, repeat } = req.body;
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
    recurrence: repeat ? [`RRULE:FREQ=WEEKLY;BYDAY=${repeat}`] : [],
  };
  try {
    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).send('Error creating event');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});