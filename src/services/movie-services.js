export default class MovieServices {
  _apiBase = 'https://api.themoviedb.org/3/search/movie?'
  _apiKey = 'api_key=e1202fb1e75c6382da098f4f4f170c5f'

  async getResource(url) {
    const res = await fetch(`${this._apiBase}${this._apiKey}${url}`)

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}` + `, received ${res.status}`)
    }
    return await res.json()
  }
  async getAllMovies() {
    const res = await this.getResource('&query=return')
    return res.results
  }
}
