import React, { Component } from 'react';
import axios from 'axios';

const badgeColors = {
  normal: 'A8A878',
  fire: 'F08030',
  water: '6890F0',
  electric: 'F8D030',
  grass: '78C850',
  ice: '98D8D8',
  fighting: 'C03028',
  poison: 'A040A0',
  ground: 'E0C068',
  flying: 'A890F0',
  psychic: 'F85888',
  bug: 'A8B820',
  rock: 'B8A038',
  ghost: '705898',
  dragon: '7038F8',
  dark: '705848',
  steel: 'B8B8D0',
  fairy: 'EE99AC',
};

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
      <div className='col'>
        <div className='card'>
          <div className='card-header'>
            {/****************************************************************** HEADER */}
            <div className='row'>
              <div className='col-5'>
                <h5>#{this.state.pokemonIndex}</h5>
              </div>
              <div className='col-7'>
                <div className='float-right'>
                  {this.state.types.map((type) => (
                    <span
                      key={type}
                      className='badge badge-pill badge-primary mr-1 p-2'
                      style={{
                        backgroundColor: `#${badgeColors[type]}`,
                        color: 'white',
                      }}
                    >
                      {type
                        .toLowerCase()
                        .split('-')
                        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                        .join(' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            {/****************************************************************** HEADER */}

            {/****************************************************************** POKEMON IMAGE & NAME */}
            <div className='col-md-3 mx-auto'>
              <img
                className='card-img-top rounded mx-auto mt-2'
                src={this.state.pokemonImg}
              />
              <h4 style={{ textAlign: 'center' }}>
                {this.state.name
                  .toLowerCase()
                  .split('-')
                  .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                  .join(' ')}
              </h4>
            </div>
            {/****************************************************************** POKEMON IMAGE & NAME */}

            {/****************************************************************** POKEMON STATS AND DESCRIPTION */}
            <div className='card-body'>
              <div className='row align-items-center'>
                <div className='col-md-9 mx-auto'>
                  <div className='row align-items-center'>
                    <div className='col-23 col-md-3'>HP</div>
                    <div className='col-12 col-md-9'>
                      <div className='progress'>
                        <div
                          className='progress-bar'
                          role='progressBar'
                          style={{ width: `${this.state.stats.hp}%` }}
                          area-valuenow='25'
                          area-valuemin='0'
                          area-valuemax='100'
                        >
                          <small>{this.state.stats.hp}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='row align-items-center'>
                    <div className='col-23 col-md-3'>Attack</div>
                    <div className='col-12 col-md-9'>
                      <div className='progress'>
                        <div
                          className='progress-bar'
                          role='progressBar'
                          style={{ width: `${this.state.stats.attack}%` }}
                          area-valuenow='25'
                          area-valuemin='0'
                          area-valuemax='100'
                        >
                          <small>{this.state.stats.attack}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='row align-items-center'>
                    <div className='col-23 col-md-3'>Defense</div>
                    <div className='col-12 col-md-9'>
                      <div className='progress'>
                        <div
                          className='progress-bar'
                          role='progressBar'
                          style={{ width: `${this.state.stats.defense}%` }}
                          area-valuenow='25'
                          area-valuemin='0'
                          area-valuemax='100'
                        >
                          <small>{this.state.stats.defense}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='row align-items-center'>
                    <div className='col-23 col-md-3'>Sp.Atk</div>
                    <div className='col-12 col-md-9'>
                      <div className='progress'>
                        <div
                          className='progress-bar'
                          role='progressBar'
                          style={{ width: `${this.state.stats.spAtk}%` }}
                          area-valuenow='25'
                          area-valuemin='0'
                          area-valuemax='100'
                        >
                          <small>{this.state.stats.spAtk}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='row align-items-center'>
                    <div className='col-23 col-md-3'>Sp.Def</div>
                    <div className='col-12 col-md-9'>
                      <div className='progress'>
                        <div
                          className='progress-bar'
                          role='progressBar'
                          style={{ width: `${this.state.stats.spDef}%` }}
                          area-valuenow='25'
                          area-valuemin='0'
                          area-valuemax='100'
                        >
                          <small>{this.state.stats.spDef}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='row align-items-center'>
                    <div className='col-23 col-md-3'>Speed</div>
                    <div className='col-12 col-md-9'>
                      <div className='progress'>
                        <div
                          className='progress-bar'
                          role='progressBar'
                          style={{ width: `${this.state.stats.speed}%` }}
                          area-valuenow='25'
                          area-valuemin='0'
                          area-valuemax='100'
                        >
                          <small>{this.state.stats.speed}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='row mt-1 mx-auto'>
                  <div className='col'>
                    <p className='p-2'>{this.state.desc}</p>
                  </div>
                </div>
              </div>
            </div>
            {/****************************************************************** POKEMON STATS AND DESCRIPTION */}
            <hr />

            {/****************************************************************** POKEMON PROFILE */}
            <div className='card-body'>
              <h5 class='card-title text-center'>Profile</h5>

              {/****************************************************************** POKEMON PROFILE LEFT SIDE*/}
              <div className='row'>
                <div className='col-md-6'>
                  <div className='row'>
                    <div className='col-6'>
                      <h6 className='float-right'>Height:</h6>
                    </div>
                    <div className='col-6'>
                      <h6 className='float-left'>{this.state.height} ft.</h6>
                    </div>
                    <div className='col-6'>
                      <h6 className='float-right'>Weight:</h6>
                    </div>
                    <div className='col-6'>
                      <h6 className='float-left'>{this.state.weight} lbs</h6>
                    </div>
                    <div className='col-6'>
                      <h6 className='float-right'>Catch Rate:</h6>
                    </div>
                    <div className='col-6'>
                      <h6 className='float-left'>{this.state.catchRate}%</h6>
                    </div>
                    <div className='col-6'>
                      <h6 className='float-right'>Gender Ratio:</h6>
                    </div>
                    <div className='col-6'>
                      <div class='progress'>
                        <div
                          class='progress-bar'
                          role='progressbar'
                          style={{
                            width: `${this.state.genderRatioFemale}%`,
                            backgroundColor: '#FF6BCE',
                          }}
                          aria-valuenow='15'
                          aria-valuemin='0'
                          aria-valuemax='100'
                        >
                          <small>{this.state.genderRatioFemale}%</small>
                        </div>
                        <div
                          class='progress-bar'
                          role='progressbar'
                          style={{
                            width: `${this.state.genderRatioMale}%`,
                            backgroundColor: '#3F73DC',
                          }}
                          aria-valuenow='30'
                          aria-valuemin='0'
                          aria-valuemax='100'
                        >
                          <small>{this.state.genderRatioMale}%</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/****************************************************************** POKEMON PROFILE LEFT SIDE*/}

                {/****************************************************************** POKEMON PROFILE RIGHT SIDE*/}
                <div className='col-md-6'>
                  <div className='row'>
                    <div className='col-6'>
                      <h6 className='float-right'>Abilities:</h6>
                    </div>
                    <div className='col-6'>
                      <h6 className='float-left'>{this.state.abilities}</h6>
                    </div>
                    <div className='col-6'>
                      <h6 className='float-right'>EVs:</h6>
                    </div>
                    <div className='col-6'>
                      <h6 className='float-left'>{this.state.evs}</h6>
                    </div>
                    <div className='col-6'>
                      <h6 className='float-right'>Egg Groups:</h6>
                    </div>
                    <div className='col-6'>
                      <h6 className='float-left'>{this.state.eggGroups} </h6>
                    </div>
                    <div className='col-6'>
                      <h6 className='float-right'>Hatch Steps:</h6>
                    </div>
                    <div className='col-6'>
                      <h6 className='float-left'>{this.state.hatchSteps}</h6>
                    </div>
                  </div>
                </div>
                {/****************************************************************** POKEMON PROFILE RIGHT SIDE*/}
              </div>
            </div>
            {/****************************************************************** POKEMON PROFILE */}
          </div>
        </div>
      </div>
    );
  }
}
