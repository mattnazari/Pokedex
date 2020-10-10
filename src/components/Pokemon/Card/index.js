import React, { Component } from 'react';
import { Img, Cards } from './style';
import loading from '../../../assets/graphics/loading.gif';

export default class Card extends Component {
  state = {
    name: '',
    pokemonImg: '',
    pokemonIndex: '',
    imgIsLoading: true,
    tooManyRequests: false,
  };

  componentDidMount() {
    const { name, url } = this.props;
    const pokemonIndex = url.split('/')[url.split('/').length - 2];
    const pokemonImg = `https://github.com/PokeAPI/sprites/blob/master/sprites/pokemon/${pokemonIndex}.png?raw=true`;

    this.setState({
      name,
      pokemonIndex,
      pokemonImg,
    });
  }

  render() {
    return (
      <div className='col-md-3 col-sm-6 mb-5'>
        <Cards className='card'>
          <h5 className='card-title m-2'>#{this.state.pokemonIndex}</h5>
          {this.state.imgIsLoading ? (
            <img
              src={loading}
              className='rounded card-img-top d-block mt-2 mb-2 mx-auto'
              style={{ width: '3em', height: '3em' }}
            ></img>
          ) : null}
          <Img
            className='card-img-top rounded mx-auto'
            onLoad={() => this.setState({ imgIsLoading: false })}
            onError={() => this.setState({ tooManyRequests: true })}
            src={this.state.pokemonImg}
            style={
              this.state.tooManyRequests
                ? { display: 'none' }
                : this.state.imgIsLoading
                ? null
                : { display: 'block' }
            }
          />
          {this.state.tooManyRequests ? (
            <h6 className='mx-auto'>
              <span className='badge badge-warning'>Too Many Requests!</span>
            </h6>
          ) : null}
          <div className='card-body mx-auto'>
            <div className='card-title'>
              {this.state.name
                .split(' ')
                .map(
                  (letter) =>
                    letter.charAt(0).toUpperCase() + letter.substring(1),
                )
                .join(' ')}
              {/* the code above just capitalizes the first letter, theres probably a shorter way of doing this but idk */}
            </div>
          </div>
        </Cards>
      </div>
    );
  }
}
