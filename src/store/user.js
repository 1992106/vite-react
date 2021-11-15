import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { pending, rejected, fulfilled } from './utils'
import { login, wxCpQrLogin } from '@/services/user'
import { getAccessStorage, removeAccessStorage, setAccessStorage } from '@/utils/accessStorage'
import setting from '@/src/config'

// 登录
export const fetchLogin = createAsyncThunk(
  'user/login',
  async (params, { getState, requestId }) => {
    const { requestLoading, currentRequestId } = getState().user
    if (requestLoading !== 'pending' || requestId !== currentRequestId) {
      return
    }
    const res = await login(params)
    return res?.data || {}
  }
)

// 企业微信登录
export const fetchWXLogin = createAsyncThunk(
  'user/wxLogin',
  async (params, { getState, requestId }) => {
    const { requestLoading, currentRequestId } = getState().user
    if (requestLoading !== 'pending' || requestId !== currentRequestId) {
      return
    }
    const res = await wxCpQrLogin(params)
    return res?.data || {}
  }
)

// 本地存储用户信息
const localUserInfo = getAccessStorage(setting.user_name)

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    userInfo: localUserInfo ? JSON.parse(localUserInfo) : {},
    requestLoading: 'idle',
    currentRequestId: undefined,
    error: null
  },
  reducers: {
    logout: (state) => {
      state.userInfo = {}
      removeAccessStorage(setting.token_name)
      removeAccessStorage(setting.user_name)
    }
  },
  extraReducers: {
    [fetchLogin.pending]: pending,
    [fetchLogin.fulfilled]: (state, action) => {
      fulfilled(state, action, (payload) => {
        const { token, userInfo = {} } = payload
        state.userInfo = userInfo
        setAccessStorage(setting.token_name, token)
        setAccessStorage(setting.user_name, JSON.stringify(userInfo))
      })
    },
    [fetchLogin.rejected]: rejected,
    [fetchWXLogin.pending]: pending,
    [fetchWXLogin.fulfilled]: (state, action) => {
      fulfilled(state, action, (payload) => {
        const { token, userInfo = {} } = payload
        state.userInfo = userInfo
        setAccessStorage(setting.token_name, token)
        setAccessStorage(setting.user_name, JSON.stringify(userInfo))
      })
    },
    [fetchWXLogin.rejected]: rejected
  }
})

// useDispatch
export const { logout } = userSlice.actions

// useSelector
export const selectUser = (state) => state.user

export const userReducer = userSlice.reducer
