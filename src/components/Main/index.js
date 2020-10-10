import React, { Component } from 'react';
import List from '../Pokemon/List';

export default class Main extends Component {
  render() {
    return (
      <div className='row'>
        <div className='col'>
          <List />
        </div>
      </div>
    );
  }
}
