// filepath: my-calendar-app/frontend/src/components/Calendar.js
import React, { useEffect, useState } from 'react';
import { getEvents } from '../services/api';

function Calendar() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchEvents() {
      const events = await getEvents();
      setEvents(events);
    }
    fetchEvents();
  }, []);

  return (
    <div>
      <h2>Calendar</h2>
      <ul>
        {events.map((event, index) => (
          <li key={index}>
            {event.summary} - {new Date(event.start.dateTime).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Calendar;