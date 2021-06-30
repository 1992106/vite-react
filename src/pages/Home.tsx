import React, { FC } from 'react'
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config'
import PropTypes from 'prop-types'
import { DatePicker } from 'antd'

const Home: FC<RouteConfigComponentProps> = ({ route }) => {
  return (
    <>
      <DatePicker />
      <div>hello word</div>
      {renderRoutes(route?.routes)}
    </>
  )
}

Home.propTypes = {
  route: PropTypes.any
}

export default Home
