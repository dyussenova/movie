import React from 'react'
import { Pagination, Tabs } from 'antd'
import PropTypes from 'prop-types'

import Card from '../Card'
import Search from '../Search'
import Spinner from '../Spinner/Spinner'
import { GenresConsumer } from '../../genres-context'

import './Rated.css'

const Rated = ({
  activeTab,
  onTabChange,
  movies,
  loading,
  totalResults,
  page,
  onPageChange,
  ratedMovies,
  pageRated,
  totalRated,
  cropText,
  onRate,
  NoResultsMessage,
  onSearch,
  onPageRated,
}) => {
  const tabItems = [
    {
      label: 'Search',
      key: '1',
      children: (
        <>
          <Search onSearch={onSearch} />
          <div className="movies-container">
            {loading ? (
              <Spinner />
            ) : movies.length > 0 ? (
              <GenresConsumer>
                {(genres) => <Card movies={movies} cropText={cropText} genres={genres} onRate={onRate} />}
              </GenresConsumer>
            ) : (
              !loading && <NoResultsMessage />
            )}
            {movies.length > 0 && !loading && (
              <div className="pagination-container">
                <Pagination
                  current={page}
                  total={totalResults}
                  onChange={onPageChange}
                  className="pagination-page"
                  showSizeChanger={false}
                  defaultPageSize={20}
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
          <GenresConsumer>
            {(genres) => <Card movies={ratedMovies} cropText={cropText} genres={genres} onRate={onRate} />}
          </GenresConsumer>
          <div className="pagination-container">
            <Pagination
              current={pageRated}
              total={totalRated}
              onChange={onPageRated}
              pageSize={20}
              className="pagination-page"
            />
          </div>
        </div>
      ),
    },
  ]

  return <Tabs className="header-container" activeKey={activeTab} onChange={onTabChange} items={tabItems} />
}

Rated.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
  movies: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  totalResults: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  ratedMovies: PropTypes.array.isRequired,
  pageRated: PropTypes.number.isRequired,
  totalRated: PropTypes.number.isRequired,
  cropText: PropTypes.func.isRequired,
  onRate: PropTypes.func.isRequired,
  NoResultsMessage: PropTypes.elementType.isRequired,
  onSearch: PropTypes.func.isRequired,
  onPageRated: PropTypes.func.isRequired,
}

export default Rated
