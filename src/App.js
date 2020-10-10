import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';
import Nav from './components/Nav';
import Main from './components/Main';
import Pokemon from './components/Pokemon';

import background from './assets/graphics/pattern.png';

class App extends Component {
  render() {
    return (
      <Router>
        <div className='App' style={{ background: `url(${background})` }}>
          <Nav />
          <div
            className='container'
            style={{
              backgroundColor: 'white',
              padding: '8em 3em 0 3em',
            }}
          >
            <Switch>
              <Route exact path='/' component={Main} />
              <Route exact path='/pokemon/:pokemonIndex' component={Pokemon} />
            </Switch>
            <Main />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
