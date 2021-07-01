import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Breadcrumb } from 'antd'
import './index.less'
import PropTypes from 'prop-types'

const BreadcrumbComponent = ({ routes }) => {
  const { pathname } = useLocation()
  const [breadcrumb, setBreadcrumb] = useState([])

  useEffect(() => {
    const bread = pathname
      .split('/')
      .slice(1)
      .reduce(
        (obj, cur) => {
          const target = obj.list.find(item => item.path === `/${cur}`) || {}
          return {
            list: target.children || [],
            items: [...obj.items, target.name]
          }
        },
        { list: routes, items: [] }
      )
    setBreadcrumb(bread.items)
  }, [pathname, routes])

  return (
    <Breadcrumb separator='>' className='headerBreadcrumb'>
      {breadcrumb.map((item, idx) => (
        <Breadcrumb.Item key={item + idx}>{item}</Breadcrumb.Item>
      ))}
    </Breadcrumb>
  )
}

BreadcrumbComponent.propTypes = {
  routes: PropTypes.array
}

export default BreadcrumbComponent
