import React, { Component } from 'react'

import MovieServices from '../../services/movie-services'
import Noconnect from '../ Noconnect'
import Rated from '../Rated/Rated'
import { MovieServicesProvider } from '../movie-services-context'
import { GenresProvider } from '../genres-contex.js/genres-context'
import './App.css'

export default class App extends Component {
  movieServices = new MovieServices()

  state = {
    isOnline: navigator.onLine,
    searchQuery: '',
    movies: [],
    loading: true,
    page: 1,
    totalResults: 0,
    genres: {},
    guestSessionId: null,
    ratedMovies: [],
    activeTab: '1',
    pageRated: 1,
    totalRated: 0,
  }

  async componentDidMount() {
    window.addEventListener('online', this.networkOnLine)
    window.addEventListener('offline', this.networkOffLine)

    try {
      await this.loadGenres()
      const guestSessionId = localStorage.getItem('guestSessionId')

      if (guestSessionId) {
        this.setState({ guestSessionId }, () => {
          this.loadRatedMovies()
        })
      } else {
        const newGuestSessionId = await this.createGuestSession()
        this.setState({ guestSessionId: newGuestSessionId, ratedMovies: [] }, () => {
          this.loadRatedMovies()
        })
      }

      this.loadMovies()
    } catch (error) {
      console.error('Ошибка при инициализации данных:', error)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.searchQuery !== this.state.searchQuery || prevState.page !== this.state.page) {
      this.loadMovies()
    }
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.networkOnLine)
    window.removeEventListener('offline', this.networkOffLine)
  }

  networkOnLine = () => {
    this.setState({ isOnline: true })
  }

  networkOffLine = () => {
    this.setState({ isOnline: false })
  }

  handleSearch = (query) => {
    this.setState({ searchQuery: query, page: 1, activeTab: '1' })
  }

  loadGenres = async () => {
    if (Object.keys(this.state.genres).length > 0) return
    try {
      const genres = await this.movieServices.getGenres()
      this.setState({ genres })
    } catch (error) {
      console.error('Ошибка при получении жанров:', error)
    }
  }

  createGuestSession = async () => {
    try {
      const guestSessionId = await this.movieServices.createGuestSession()
      this.setState({ guestSessionId })
    } catch (error) {
      console.error('Ошибка при создании гостевой сессии:', error)
    }
  }

  loadMovies = async () => {
    this.setState({ loading: true })
    try {
      const { searchQuery, page, ratedMovies } = this.state
      const res = searchQuery
        ? await this.movieServices.searchMovies(searchQuery, page)
        : await this.movieServices.getAllMovies(page)

      const moviesWithRatings = res.results.map((movie) => {
        const ratedMovie = ratedMovies.find((rated) => rated.id === movie.id)
        return this.movieServices._transformMovies(movie, this.state.genres, ratedMovie ? ratedMovie.rating : 0)
      })

      this.setState({
        movies: moviesWithRatings,
        loading: false,
        totalResults: res.total_results,
      })
    } catch (error) {
      console.error('Ошибка при получении фильмов:', error)
      this.setState({ loading: false })
    }
  }

  loadRatedMovies = async () => {
    const { guestSessionId, pageRated } = this.state

    if (!guestSessionId) return

    try {
      const res = await this.movieServices.getRatedMovies(guestSessionId, pageRated)
      this.setState({
        ratedMovies: res.results.map((movie) => ({
          ...this.movieServices._transformMovies(movie, this.state.genres),
          rating: movie.rating || 0,
        })),
        totalRated: res.total_results,
      })
    } catch (error) {
      console.error('Ошибка при получении оцененных фильмов:', error)
    }
  }

  onPageChange = (page) => {
    this.setState({ page })
  }

  onPageRated = (pageRated) => {
    this.setState({ pageRated }, () => {
      this.loadRatedMovies()
    })
  }

  cropText = (text) => {
    const maxLength = 160
    if (text.length >= maxLength) {
      let lastText = text.lastIndexOf(' ', maxLength)
      return text.slice(0, lastText > 0 ? lastText : maxLength) + '...'
    }
    return text
  }

  handleRate = async (movieId, rating) => {
    const { guestSessionId, movies, ratedMovies } = this.state

    if (!guestSessionId) {
      console.error('Гостевая сессия не создана')
      return
    }

    try {
      await this.movieServices.rateMovie(guestSessionId, movieId, rating)

      const updatedMovies = movies.map((movie) => (movie.id === movieId ? { ...movie, rating } : movie))
      const isRated = ratedMovies.some((movie) => movie.id === movieId)

      const updatedRatedMovies = isRated
        ? ratedMovies.map((movie) => (movie.id === movieId ? { ...movie, rating } : movie))
        : [...ratedMovies, { ...updatedMovies.find((movie) => movie.id === movieId), rating }]

      this.setState({ movies: updatedMovies, ratedMovies: updatedRatedMovies })
    } catch (error) {
      console.error('Ошибка при постановке рейтинга:', error)
    }
  }

  handleTabChange = (key) => {
    this.setState({ activeTab: key })
  }

  render() {
    const { isOnline, movies, loading, page, totalResults, genres, ratedMovies, activeTab, pageRated, totalRated } =
      this.state

    return (
      <MovieServicesProvider value={this.movieServices}>
        <GenresProvider value={genres}>
          <div className="apppp">
            <Noconnect isOnline={isOnline} />
            <Rated
              activeTab={activeTab}
              onTabChange={this.handleTabChange}
              movies={movies}
              loading={loading}
              totalResults={totalResults}
              page={page}
              onPageChange={this.onPageChange}
              ratedMovies={ratedMovies}
              pageRated={pageRated}
              totalRated={totalRated}
              cropText={this.cropText}
              onRate={this.handleRate}
              NoResultsMessage={NoResultsMessage}
              onSearch={this.handleSearch}
              onPageRated={this.onPageRated}
            />
          </div>
        </GenresProvider>
      </MovieServicesProvider>
    )
  }
}

const NoResultsMessage = () => (
  <div className="no-results">
    <p>No movies found.</p>
  </div>
)
