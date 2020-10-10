import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import background from './assets/graphics/pattern.png';

import Nav from './components/Nav';
import Main from './components/Main';

function App() {
  return (
    <div className='App' style={{ background: `url(${background})` }}>
      <Nav />
      <div
        className='container'
        style={{
          backgroundColor: 'white',
          padding: '8em 3em 0 3em',
        }}
      >
        <Main />
      </div>
    </div>
  );
}

export default App;
