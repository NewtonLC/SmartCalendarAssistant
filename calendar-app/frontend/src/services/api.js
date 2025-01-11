// filepath: my-calendar-app/frontend/src/services/api.js
const API_URL = 'http://localhost:5000';

export async function authenticate() {
  const response = await fetch(`${API_URL}/auth`);
  return response.json();
}

export async function getEvents() {
  const response = await fetch(`${API_URL}/events`);
  return response.json();
}

export async function addEvent(event) {
  const response = await fetch(`${API_URL}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  });
  return response.json();
}