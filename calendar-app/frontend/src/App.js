import React, { useState } from 'react';
import Chat from './components/Chat';
import Calendar from './components/Calendar';
import EventForm from './components/EventForm';
import nlp from 'compromise';
import { format, addDays, addWeeks, parse } from 'date-fns';
import { addEvent } from './services/api';
import './App.css';

const getNextDate = (day) => {
  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = new Date();
  const todayDayIndex = today.getDay();
  const targetDayIndex = daysOfWeek.indexOf(day.toLowerCase());

  let daysUntilNextOccurrence = targetDayIndex - todayDayIndex;
  if (daysUntilNextOccurrence <= 0) {
    daysUntilNextOccurrence += 7;
  }

  const nextOccurrence = new Date(today);
  nextOccurrence.setDate(today.getDate() + daysUntilNextOccurrence);
  return nextOccurrence;
};

// Without this, it only accepts "XX:XX" format for time, and 00:00 - 23:59
const parseTime = (timeStr) => {
  let hours, minutes;
  const timeMatch = timeStr.match(/(\d+)(?::(\d+))?\s*(am|pm)?/i);
  if (timeMatch) {
    hours = Number(timeMatch[1]);
    minutes = Number(timeMatch[2]) || 0;
    const amPm = timeMatch[3];

    if (amPm && amPm.toLowerCase() === 'pm' && hours < 12) {
      hours += 12;
    }
    if (amPm && amPm.toLowerCase() === 'am' && hours === 12) {
      hours = 0;
    }
  } else {
    console.error('Invalid time format:', timeStr);
    return null;
  }

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

const handleChatMessage = async (message) => {
  // Use compromise to parse the message
  const doc = nlp(message);
  const eventTitle = doc.match('#Verb+').out('text');

  // Match and parse the date
  const eventDay = doc.match('#WeekDay').out('text') || doc.match('#WeekDayShort').out('text');
  const eventDate = doc.match('#Date').out('text');
  const tomorrow = doc.match('tomorrow').out('text');
  const inDays = doc.match('in #Cardinal day?').out('text');
  const inWeeks = doc.match('in #Cardinal week?').out('text');
  const specificDate = doc.match('on the #Ordinal').out('text');
  const specificMonthDate = doc.match('on #Month #Ordinal').out('text');
  let parsedDate;
  if (eventDay) {
    const fullDay = {mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday',
      thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday'
    }[eventDay.toLowerCase().slice(0, 3)];
    parsedDate = getNextDate(fullDay);
  } else if (tomorrow) {
    parsedDate = addDays(new Date(), 1);
  } else if (inDays) {
    const days = parseInt(inDays.match(/\d+/)[0], 10);
    parsedDate = addDays(new Date(), days);
  } else if (inWeeks) {
    const weeks = parseInt(inWeeks.match(/\d+/)[0], 10);
    parsedDate = addWeeks(new Date(), weeks);
  } else if (specificDate) {
    const day = parseInt(specificDate.match(/\d+/)[0], 10);
    const today = new Date();
    parsedDate = new Date(today.getFullYear(), today.getMonth(), day);
    if (parsedDate < today) {
      parsedDate.setMonth(parsedDate.getMonth() + 1);
    }
  } else if (specificMonthDate) {
    const [month, day] = specificMonthDate.match(/\w+/g);
    parsedDate = parse(`${day} ${month}`, 'd MMMM', new Date());
    if (parsedDate < new Date()) {
      parsedDate.setFullYear(parsedDate.getFullYear() + 1);
    }
  } else if (eventDate && !eventDate.match(/^\d{1,2}(:\d{2})?\s*(am|pm)?$/i)) { // Ensure eventDate is not a time
    parsedDate = new Date(eventDate);
  } else {
    parsedDate = new Date();
  }

  // Match and parse the time
  let eventTime = doc.match('#Time').out('text') || doc.match('#Cardinal #Time').out('text');
  const amPm = doc.match('(am|pm)').out('text');
  if (amPm) {
    eventTime += ` ${amPm}`;
  }
  const parsedTime = eventTime ? parseTime(eventTime) : '00:00';

  // Match and parse text for repeating events
  const repeat = doc.match('every #Duration').out('text');

  // Valiate and parse datetime (without this, the date and time passed to the Date constructor is invalid)
  const [hours, minutes] = parsedTime.split(':').map(Number);
  parsedDate.setHours(hours);
  parsedDate.setMinutes(minutes);
  parsedDate.setSeconds(0);
  parsedDate.setMilliseconds(0);

  if (isNaN(parsedDate.getTime())) {
    console.error('Invalid date or time:', eventDate, eventTime);
    return;
  }

  const event = {
    title: eventTitle,
    date: format(parsedDate, 'yyyy-MM-dd'),
    time: parsedTime,
    repeat: repeat,
  };

  return event;

  /*
  // Create the event using the Google Calendar API
  try {
    const response = await addEvent(event);
    setEvents([...events, response]);
    console.log('Event created:', response);
  } catch (error) {
    console.error('Error creating event:', error);
  }
  */
};

function App() {
  const [events, setEvents] = useState([]);

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

export { handleChatMessage };
export default App;