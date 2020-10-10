import React, { Component } from 'react';
import axios from 'axios';

import Card from '../Card';

export default class List extends Component {
  state = {
    url: 'https://pokeapi.co/api/v2/pokemon/',
    pokemon: null,
  };

  async componentDidMount() {
    const res = await axios.get(this.state.url);
    this.setState({ pokemon: res.data['results'] });
  }

  render() {
    return (
      <div>
        {this.state.pokemon ? (
          <div className='row'>
            {this.state.pokemon.map((pokemon) => (
              <Card />
            ))}
          </div>
        ) : (
          <h1>Loading Pokemon</h1>
        )}
      </div>
    );
  }
}
