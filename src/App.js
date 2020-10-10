import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Nav from './components/Nav';
import Main from './components/Main';

function App() {
  return (
    <div className='App'>
      <Nav />
      <div className='container'>
        <Main />
      </div>
    </div>
  );
}

export default App;
