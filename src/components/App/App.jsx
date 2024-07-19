import React, { Component } from 'react'

import Search from '../Search'
import Header from '../Header'
import Card from '../Card'

import './App.css'

export default class App extends Component {
  render() {
    return (
      <div>
        <div className="movie">jjjj</div>
        <div className="apppp">
          <Search />
          <Header />
          <Card />
        </div>
      </div>
    )
  }
}
