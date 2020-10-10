import React, { Component } from 'react';
import axios from 'axios';

export default class Pokemon extends Component {
  state = {
    name: 'null',
    pokemonIndex: '',
    pokemonImg: '',
    types: [],
    desc: '',
    stats: {
      hp: '',
      attack: '',
      defense: '',
      spAtk: '',
      spDef: '',
      speed: '',
    },
    abilities: '',
    height: '',
    weight: '',
    genderRatioMale: '',
    genderRatioFemale: '',
    eggGroup: '',
    hatchSteps: '',
    evs: '',
  };

  async componentDidMount() {
    const { pokemonIndex } = this.props.match.params;

    // these are the URLs for the pokemons information
    const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonIndex}/`;
    const pokemonSpeciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonIndex}/`;

    // GET pokemon information
    const pokemonRes = await axios.get(pokemonUrl);

    const name = pokemonRes.data.name;
    const pokemonImg = pokemonRes.data.sprites.front_default;

    // let allows me to change these accordingly
    let { hp, attack, defense, spAtk, spDef, speed } = '';

    pokemonRes.data.stats.map((stat) => {
      switch (stat.stat.name) {
        case 'hp':
          hp = stat['base_stat'];
          break;
        case 'attack':
          attack = stat['base_stat'];
          break;
        case 'defense':
          defense = stat['base_stat'];
          break;
        case 'special-attack':
          spAtk = stat['base_stat'];
          break;
        case 'special-defense':
          spDef = stat['base_stat'];
          break;
        case 'speed':
          speed = stat['base_stat'];
          break;
      }
    });

    // GET pokemon description which includes gender ratio, catch rate, egg groups, and hatch steps
    // .some lets me grab the english text only
    await axios.get(pokemonSpeciesUrl).then((res) => {
      let desc = '';
      res.data.flavor_text_entries.some((flavor) => {
        if (flavor.language.name === 'en') {
          desc = flavor.flavor_text;
          return;
        }
      });

      // changes base capture rate from 255 to 100 so its easier to read.
      const catchRate = Math.round((100 / 255) * res.data['capture_rate']);

      // had to look this up. the way they do gender rates is weird
      const femaleRate = res.data['gender_rate'];
      const genderRatioFemale = 12.5 * femaleRate;
      const genderRatioMale = 12.5 * (8 - femaleRate);

      // grabs egg groups
      const eggGroups = res.data['egg_groups'].map((group) => {
        return group.name
          .toLowerCase()
          .split('-')
          .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
          .join(' ');
      });

      // hatch counter, player must walk 255 x (hatch_counter + 1) for the egg to hatch
      const hatchSteps = 255 * (res.data['hatch_counter'] + 1);

      this.setState({
        desc,
        catchRate,
        genderRatioFemale,
        genderRatioMale,
        eggGroups,
        hatchSteps,
      });
    });

    // grabs pokemon types
    const types = pokemonRes.data.types.map((type) => type.type.name);

    // grabs abilities and capitalizes first letter
    const abilities = pokemonRes.data.abilities
      .map((ability) => {
        return ability.ability.name
          .toLowerCase()
          .split('-')
          .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
          .join(' ');
      })
      .join(', ');

    // filter only passes back the things i declare
    // join at the end seperates the evs and the name nicely
    const evs = pokemonRes.data.stats
      .filter((stat) => {
        if (stat.effort > 0) {
          return true;
        }
        return false;
      })
      .map((stat) => {
        return `${stat.effort} ${stat.stat.name
          .toLowerCase()
          .split('-')
          .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
          .join(' ')}`;
      })
      .join(', ');

    // convert decimeters into feet. 1 dm = 0.328084 ft.
    // after converting... + 0.0001 x 100) / 100 to round to 2 decimal places
    const height =
      Math.round((pokemonRes.data.height * 0.328084 + 0.0001) * 100) / 100;

    // convert hectograms to pounds. 1 hg = 0.220462 lbs
    const weight =
      Math.round((pokemonRes.data.weight * 0.220462 + 0.0001) * 100) / 100;

    this.setState({
      name,
      pokemonIndex,
      pokemonImg,
      types,
      stats: {
        hp,
        attack,
        defense,
        spAtk,
        spDef,
        speed,
      },
      abilities,
      height,
      weight,
      evs,
    });
  }

  render() {
    return (
      <div>
        <h1>{this.state.name}</h1>
      </div>
    );
  }
}
