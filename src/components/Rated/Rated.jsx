import React from 'react'
import { Tabs } from 'antd'

import Card from '../Card'

import './Rated.css'

const Rated = ({ ratedMovies, cropText, onRate }) => {
  return (
    <Tabs
      className="header-container"
      defaultActiveKey="1"
      items={[
        {
          label: 'Search',
          key: '1',
        },
        {
          label: 'Rated',
          key: '2',
          children: (
            <div className="rated-tab">
              <Card movies={ratedMovies} cropText={cropText} onRate={onRate} />
            </div>
          ),
        },
      ]}
    />
  )
}

export default Rated
