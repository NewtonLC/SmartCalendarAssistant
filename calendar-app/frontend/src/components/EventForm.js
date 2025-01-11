// filepath: my-calendar-app/frontend/src/components/EventForm.js
import React, { useState } from 'react';
import { addEvent } from '../services/api';

function EventForm() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const event = { title, date, time };
    await addEvent(event);
    // Clear the form
    setTitle('');
    setDate('');
    setTime('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Schedule an Event</h2>
      <div>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label>Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div>
        <label>Time:</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>
      <button type="submit">Add Event</button>
    </form>
  );
}

export default EventForm;