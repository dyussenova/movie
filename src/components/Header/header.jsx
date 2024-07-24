import React, { Component } from 'react'

import './Header.css'

export default class Header extends Component {
  render() {
    return (
      <div className="header-container">
        <nav className="nav-links">
          <a href="#">Link 1</a>
          <a href="#">Link 2</a>
        </nav>
      </div>
    )
  }
}
