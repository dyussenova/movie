import React, { Component } from 'react'
import { Flex, Spin } from 'antd'

import './Spinner.css'
export default class Spinner extends Component {
  render() {
    return (
      <Flex align="center" gap="middle" className="spin">
        <Spin size="large" align="center" />
      </Flex>
    )
  }
}
