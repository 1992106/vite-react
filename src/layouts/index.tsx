import React from 'react'
import { RouteConfigComponentProps } from 'react-router-config'
import PropTypes from 'prop-types'
import { Layout } from 'antd'
import MyFooter from '@/src/layouts/Footer'

const LayoutComponent: React.FC<RouteConfigComponentProps> = () => {
  return (
    <Layout>
      <MyFooter />
    </Layout>
  )
}

LayoutComponent.propTypes = {
  route: PropTypes.shape({
    routes: PropTypes.any
  })
}

export default LayoutComponent
