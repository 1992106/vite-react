export const pending = (
  state,
  action,
  loading = 'requestLoading',
  requestId = 'currentRequestId'
) => {
  const { meta } = action
  if (state[loading] === 'idle') {
    state[loading] = 'pending'
    state[requestId] = meta.requestId
  }
}

export const rejected = (
  state,
  action,
  loading = 'requestLoading',
  requestId = 'currentRequestId'
) => {
  const { meta, error } = action
  if (state[loading] === 'pending' && state[requestId] === meta.requestId) {
    state[loading] = 'idle'
    state.error = error
    state[requestId] = undefined
  }
}

export const fulfilled = (
  state,
  action,
  cb = () => {},
  loading = 'requestLoading',
  requestId = 'currentRequestId'
) => {
  const { payload, meta } = action
  if (state[loading] === 'pending' && state[requestId] === meta.requestId) {
    state[loading] = 'idle'
    state[requestId] = undefined
    if (payload) {
      cb(payload)
    }
  }
}
