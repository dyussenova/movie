import React, { Component } from 'react'
import { Alert } from 'antd'

import './Noconnect.css'
export default class Noconnect extends Component {
  render() {
    const { isOnline, errorMessage } = this.props
    return (
      <>
        {!isOnline && (
          <div className="noOnline">
            <Alert message="Ошибка" description="Нет подключения к Интернету" type="error" />
          </div>
        )}
        {errorMessage && (
          <div className="error-message">
            <Alert message="Ошибка" description={errorMessage} type="error" />
          </div>
        )}
      </>
    )
  }
}
