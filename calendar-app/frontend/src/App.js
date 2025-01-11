import React from 'react';
import Calendar from './components/Calendar';
import EventForm from './components/EventForm';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>My Calendar App</h1>
      </header>
      <main>
        <EventForm />
        <Calendar />
      </main>
    </div>
  );
}

export default App;