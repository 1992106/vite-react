import { combineReducers, configureStore } from '@reduxjs/toolkit'
import logger from 'redux-logger'
// import { routesReducer } from './routes'
// import { userReducer } from './user'
// import { dictReducer } from './dict'

const rootReducer = combineReducers({
  // routes: routesReducer,
  // user: userReducer,
  // dict: dictReducer
})

// 生产环境的中间件
let middleware = []

if (import.meta.env.DEV) {
  // 开发环境的中间件
  middleware = [...middleware, ...[logger]]
}

export default configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(middleware)
  },
  devTools: true
})
