import React from 'react'
import { format } from 'date-fns'
import { Rate } from 'antd'
import PropTypes from 'prop-types'

import poster from '../../assets/poster.png'

import './Card.css'

const Card = ({ movies = [], cropText, onRate }) => {
  const getBorderColor = (average) => {
    if (average <= 3) return '#E90000'
    if (average <= 5) return '#E97E00'
    if (average <= 7) return '#E9D100'
    return '#66E900'
  }

  return (
    <>
      {movies.length > 0 ? (
        movies.map(({ id, posterPath, title, date, overview, average = 0, genreNames = [], rating = 0 }) => {
          const formattedDate = isNaN(new Date(date).getTime())
            ? 'Unknown Date'
            : format(new Date(date), 'MMMM dd, yyyy')
          const genresList = genreNames.length > 0 ? genreNames : ['Unknown']

          return (
            <div key={id} className="movie-card">
              <div className="movie-image">
                <img src={posterPath ? `https://image.tmdb.org/t/p/w500/${posterPath}` : poster} alt="Movie Poster" />
              </div>
              <div className="movie-info">
                <div className="movie-average" style={{ borderColor: getBorderColor(average) }}>
                  {average.toFixed(1)}
                </div>
                <h2 className="movie-info__title">{title}</h2>
                <p className="movie-info__date">{formattedDate}</p>
                <div className="movie-genres">
                  {genresList.map((genre, id) => (
                    <span key={id} className="genre">
                      {genre}
                    </span>
                  ))}
                </div>
                <p className="movie-description">{cropText(overview)}</p>
                <div className="rate-wrapper">
                  <Rate count={10} value={rating} onChange={(value) => onRate(id, value)} />
                </div>
              </div>
            </div>
          )
        })
      ) : (
        <p>No movies available.</p>
      )}
    </>
  )
}

Card.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string,
      date: PropTypes.string.isRequired,
      overview: PropTypes.string.isRequired,
      average: PropTypes.number,
      genreNames: PropTypes.arrayOf(PropTypes.string),
      rating: PropTypes.number,
    })
  ).isRequired,
  cropText: PropTypes.func,
  onRate: PropTypes.func,
}

export default Card
