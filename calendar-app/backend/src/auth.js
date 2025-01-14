// filepath: calendar-app/backend/src/auth.js
const { OAuth2Client } = require('google-auth-library');
const fs = require('fs');
const path = require('path');

// REMOVE THESE TWO STRINGS WHEN COMMITTING/PUSHING, ADD THEM BACK FROM GOOGLE OAUTH WHEN TESTING LOCALLY
const CLIENT_ID = '';
const CLIENT_SECRET = '';
const REDIRECT_URI = 'http://localhost:5000/auth/callback';

const TOKEN_PATH = path.join(__dirname, 'token.json');

const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

function getAuthUrl() {
  const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events'
  ];

  const url = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });

  return url;
}

async function getAccessToken(code) {
  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
  return tokens;
}

function loadSavedCredentialsIfExist() {
  try {
    const content = fs.readFileSync(TOKEN_PATH);
    const credentials = JSON.parse(content);
    oAuth2Client.setCredentials(credentials);
    return true;
  } catch (err) {
    return false;
  }
}

module.exports = {
  getAuthUrl,
  getAccessToken,
  loadSavedCredentialsIfExist,
  oAuth2Client,
};