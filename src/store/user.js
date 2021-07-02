import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import request from '@/utils/request'
import { GET_USER_INFO } from '@/graphql/user'

// 获取用户
export const fetchUser = createAsyncThunk('fetchUser', async () => {
  const { data } = await request({ query: GET_USER_INFO }, 'mars')
  return data?.profile || {}
})

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    userInfo: {}
  },
  reducers: {
    logout: state => {
      state.userInfo = {}
    }
  },
  extraReducers: {
    [fetchUser.fulfilled]: (state, action) => {
      state.userInfo = action.payload
    }
  }
})

// useSelector
export const selectUser = state => state.user.userInfo

export const userReducer = userSlice.reducer
