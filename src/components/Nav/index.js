import React, { Component } from 'react';

export default class Nav extends Component {
  render() {
    return (
      <div>
        <nav className='navbar navbar-expand-md navbar-dark fixed-top'>
          <a
            style={{ fontSize: '32px' }}
            href=''
            className='navbar-brand col-sm-3 col-md-2 align-items-center'
          >
            Pokedex
          </a>
        </nav>
      </div>
    );
  }
}
