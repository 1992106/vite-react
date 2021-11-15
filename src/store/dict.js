import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { formatOptions } from '@/src/utils'
import { selectFactoryList } from '@/services/orderManagement'
import { getListSelects, getSelects } from '@/services/baseData'

// 获取加工厂
export const fetchFactory = createAsyncThunk('dict/factory', async () => {
  const res = await selectFactoryList()
  return formatOptions(res?.data || [], 'factoryName', 'factoryId')
})

// 获取单个枚举值
export const fetchEnum = createAsyncThunk('dict/enum', async (params) => {
  const res = await getSelects(params)
  return formatOptions(res?.data || [], 'enumName', 'id')
})

// 获取多个枚举值
export const fetchEnumList = createAsyncThunk('dict/enumList', async (params) => {
  const res = await getListSelects(params)
  return (res?.data || []).map((val) => {
    return {
      ...val,
      items: formatOptions(val?.items, 'enumName', 'id')
    }
  })
})

export const dictSlice = createSlice({
  name: 'dict',
  initialState: {
    factoryOptions: []
  },
  extraReducers: {
    [fetchFactory.fulfilled]: (state, action) => {
      state.factoryOptions = action.payload
    }
  }
})

// useSelector
export const selectDict = (state) => state.dict

export const dictReducer = dictSlice.reducer
