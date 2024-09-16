import React, { Component } from 'react'
import { Pagination, Tabs } from 'antd'

import MovieServices from '../../services/movie-services'
import Search from '../Search'
import Card from '../Card'
import Noconnect from '../ Noconnect'
import Spinner from '../Spinner/Spinner'
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
      await Promise.all([this.loadGenres(), this.createGuestSession()])
      this.loadMovies()
      this.loadRatedMovies()
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
      const { searchQuery, page } = this.state
      const res = searchQuery
        ? await this.movieServices.searchMovies(searchQuery, page)
        : await this.movieServices.getAllMovies(page)

      this.setState({
        movies: res.results.map((movie) => this.movieServices._transformMovies(movie, this.state.genres)),
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
        ratedMovies: res.results.map((movie) => this.movieServices._transformMovies(movie, this.state.genres)),
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
    this.setState({ pageRated })
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
      await this.movieServices.rateMovie(movieId, rating)
      const updatedMovies = movies.map((movie) => (movie.id === movieId ? { ...movie, rating } : movie))
      const updatedRatedMovies = ratedMovies.some((movie) => movie.id === movieId)
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

    const tabItems = [
      {
        label: 'Search',
        key: '1',
        children: (
          <>
            <Search onSearch={this.handleSearch} />
            <div className="movies-container">
              {loading ? <Spinner /> : null}
              {movies.length > 0 ? (
                <Card movies={movies} cropText={this.cropText} genres={genres} onRate={this.handleRate} />
              ) : (
                !loading && <NoResultsMessage />
              )}
              {movies.length > 0 && !loading && (
                <div className="pagination-conteiner">
                  <Pagination
                    current={page}
                    total={totalResults}
                    onChange={this.onPageChange}
                    className="pagination-page"
                  />
                </div>
              )}
            </div>
          </>
        ),
      },
      {
        label: 'Rated',
        key: '2',
        children: (
          <div className="movies-container">
            <Card movies={ratedMovies} cropText={this.cropText} onRate={this.handleRate} />
            <div className="pagination-conteiner">
              <Pagination
                current={pageRated}
                total={totalRated}
                onChange={this.onPageRated}
                className="pagination-page"
              />
            </div>
          </div>
        ),
      },
    ]

    return (
      <div>
        <Noconnect isOnline={isOnline} />
        <div className="apppp">
          <Tabs className="header-container" activeKey={activeTab} onChange={this.handleTabChange} items={tabItems} />
        </div>
      </div>
    )
  }
}

const NoResultsMessage = () => (
  <div className="no-results">
    <p>No movies found.</p>
  </div>
)
