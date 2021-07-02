import React from 'react'
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config'
import PropTypes from 'prop-types'
import { DatePicker } from 'antd'

const Test: React.FC<RouteConfigComponentProps> = ({ route }) => {
  return (
    <>
      <DatePicker />
      <div>hello word</div>
      {renderRoutes(route?.routes)}
    </>
  )
}

Test.propTypes = {
  route: PropTypes.shape({
    routes: PropTypes.any
  })
}

export default Test
