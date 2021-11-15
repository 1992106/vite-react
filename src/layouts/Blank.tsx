import React from 'react'
import PropTypes from 'prop-types'
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config'

const BlankComponent: React.FC<RouteConfigComponentProps> = ({ route }) => {
  const routes = route?.routes || []
  return <>{renderRoutes(routes)}</>
}

BlankComponent.propTypes = {
  route: PropTypes.shape({
    routes: PropTypes.any
  })
}

export default BlankComponent
