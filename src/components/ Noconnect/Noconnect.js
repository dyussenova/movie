import React, { Component } from 'react'
import { Alert } from 'antd'

import './Noconnect.css'
export default class Noconnect extends Component {
  render() {
    const { isOnline } = this.props
    return (
      !isOnline && (
        <div className="noOnline">
          <Alert message="Error " description="No Internet Connection" type="error" />
        </div>
      )
    )
  }
}
