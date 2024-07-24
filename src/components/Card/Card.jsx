import React, { Component } from 'react'

import MovieServices from '../../services/movie-services'

import './Card.css'

export default class Card extends Component {
  movieServices = new MovieServices()

  state = {
    movies: [],
  }

  componentDidMount() {
    this.dataMovies()
  }

  dataMovies() {
    this.movieServices.getAllMovies().then((movies) => {
      this.setState({
        movies: movies.slice(0, 6),
      })
    })
  }

  render() {
    const { movies } = this.state

    return (
      <div className="movies-container">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <div className="movie-image">
              <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt="Movie Poster" />
            </div>
            <div className="movie-info">
              <h2>{movie.title}</h2>
              <p>{movie.release_date}</p>
              <p className="movie-description">{movie.overview}</p>
            </div>
          </div>
        ))}
      </div>
    )
  }
}
