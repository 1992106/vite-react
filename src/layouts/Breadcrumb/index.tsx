import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom'
import { Breadcrumb } from 'antd'
import './index.less'

interface BreadcrumbProps {
  routes?: any[]
}

const BreadcrumbComponent: React.FC<BreadcrumbProps> = ({ routes = [] }) => {
  const { pathname } = useLocation()
  const [breadcrumb, setBreadcrumb] = useState<string[]>([])

  useEffect(() => {
    const bread = pathname
      .split('/')
      .slice(1)
      .reduce(
        (obj: { list: any[]; items: string[] }, cur) => {
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
    <Breadcrumb separator='>' className='my-breadcrumb'>
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
