import React, { Component } from 'react'
import { Input } from 'antd'
import { debounce } from 'lodash'

import MovieServices from '../../services/movie-services'

export default class Search extends Component {
  movieServices = new MovieServices()
  state = {
    value: '',
  }

  onSearch = (value) => {
    this.setState({ value })
    this.props.onSearch(value)
  }

  render() {
    return (
      <div className="search">
        <Input placeholder="Type to search..." onChange={debounce((e) => this.onSearch(e.target.value), 800)} />
      </div>
    )
  }
}
