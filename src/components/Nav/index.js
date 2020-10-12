import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Nav extends Component {
  render() {
    return (
      <div>
        <nav className='navbar navbar-expand-md navbar-dark fixed-top'>
          <Link to='/'>
            <a
              style={{ fontSize: '32px' }}
              href=''
              className='navbar-brand col-sm-3 col-md-2 align-items-center'
            >
              Pokedex
            </a>
          </Link>
        </nav>
      </div>
    );
  }
}
