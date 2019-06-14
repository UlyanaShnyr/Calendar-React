import React, { Component } from 'react';
import './App.css';
import Calendar from './Components/Calendar/';


class App extends Component {
  onDayClick = (e, day) => {
    alert("You choice " + day);
  }
  render() {
    return (
      <div className="App" >
        <Calendar onDayClick={(e, day) => { this.onDayClick(e, day) }} />
      </div>
    );
  }
}

export default App;
