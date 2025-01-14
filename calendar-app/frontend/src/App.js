import React, { useState } from 'react';
import Chat from './components/Chat';
import Calendar from './components/Calendar';
import EventForm from './components/EventForm';
import nlp from 'compromise';
import { addEvent } from './services/api';
import './App.css';

function App() {
  const [events, setEvents] = useState([]);

  const handleChatMessage = async (message) => {
    // Use compromise to parse the message
    const doc = nlp(message);
    const eventTitle = doc.match('#Verb+').out('text');
    const eventDate = doc.match('#Date').out('text');
    const eventTime = doc.match('#Time').out('text');
    const repeat = doc.match('every #Duration').out('text');

    // Valiate and parse date and time (without this, the date and time passed to the Date constructor is invalid)
    const parsedDate = new Date(eventDate);
    const parsedTime = eventTime ? eventTime : '00:00';
    const dateTime = new Date(`${parsedDate.toISOString().split('T')[0]}T${parsedTime}:00`);

    if (isNaN(dateTime.getTime())) {
      console.error('Invalid date or time:', eventDate, eventTime);
      return;
    }

    const event = {
      title: eventTitle,
      date: parsedDate.toISOString().split('T')[0],
      time: parsedTime,
      repeat: repeat,
    };

    console.log('Parsed event:', event);

    // Create the event using the Google Calendar API
    try {
      const response = await addEvent(event);
      setEvents([...events, response]);
      console.log('Event created:', response);
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>My Calendar App</h1>
      </header>
      <main>
        <Chat onMessage={handleChatMessage} />
        <EventForm />
        <Calendar events={events} />
      </main>
    </div>
  );
}

export default App;