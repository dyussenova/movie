export default class MovieServices {
  _apiBase = 'https://api.themoviedb.org/3'
  _apiKey = 'e1202fb1e75c6382da098f4f4f170c5f'

  async getResource(url) {
    const res = await fetch(`${this._apiBase}${url}&api_key=${this._apiKey}`)

    if (!res.ok) {
      throw new Error(`Не удалось получить ресурс ${url}, статус ${res.status}`)
    }
    return await res.json()
  }
  async getGenres() {
    const res = await this.getResource('/genre/movie/list?')
    return res.genres.reduce((acc, genre) => {
      acc[genre.id] = genre.name
      return acc
    }, {})
  }

  async getAllMovies(page = 1) {
    const res = await this.getResource(`/search/movie?query=return&page=${page}`)
    return res
  }

  async searchMovies(query, page = 1) {
    const res = await this.getResource(`/search/movie?query=${query}&page=${page}`)
    return res
  }

  async createGuestSession() {
    const response = await fetch(`${this._apiBase}/authentication/guest_session/new?api_key=${this._apiKey}`, {
      method: 'GET',
      headers: {
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlMTIwMmZiMWU3NWM2MzgyZGEwOThmNGY0ZjE3MGM1ZiIsIm5iZiI6MTcyMTU4Njc4NS41MTEwMzEsInN1YiI6IjY2OWJhMzVmYTdmNDI5MGQ3NjA1ZDZlNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.XqvnAPtNxE-tHUPPmrbZzQIZTlFUQwOO-DZROQEnvYg',
      },
    })

    if (!response.ok) {
      throw new Error('Не удалось создать гостевую сессию')
    }

    const data = await response.json()
    return data.guest_session_id
  }

  async rateMovie(movieId, rating) {
    const res = await fetch(`${this._apiBase}/movie/${movieId}/rating?api_key=${this._apiKey}`, {
      method: 'POST',
      headers: {
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlMTIwMmZiMWU3NWM2MzgyZGEwOThmNGY0ZjE3MGM1ZiIsIm5iZiI6MTcyMTU4Njc4NS41MTEwMzEsInN1YiI6IjY2OWJhMzVmYTdmNDI5MGQ3NjA1ZDZlNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.XqvnAPtNxE-tHUPPmrbZzQIZTlFUQwOO-DZROQEnvYg',
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ value: rating }),
    })

    if (!res.ok) {
      throw new Error(`Не удалось поставить рейтинг фильму, статус ${res.status}`)
    }

    return await res.json()
  }

  async getRatedMovies(guestSessionId, page = 1) {
    const res = await fetch(
      `${this._apiBase}/guest_session/${guestSessionId}/rated/movies?language=en-US&page=${page}&sort_by=created_at.asc&api_key=${this._apiKey}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this._apiKey}`,
          Accept: 'application/json',
        },
      }
    )

    if (!res.ok) {
      throw new Error(`Не удалось получить оцененные фильмы, статус ${res.status}`)
    }

    const data = await res.json()

    return data
  }

  _transformMovies(movie, genres) {
    return {
      id: movie.id,
      title: movie.title,
      date: movie.release_date,
      overview: movie.overview,
      posterPath: movie.poster_path,
      average: movie.vote_average,
      genreNames: movie.genre_ids.map((id) => genres[id]),
    }
  }
}
