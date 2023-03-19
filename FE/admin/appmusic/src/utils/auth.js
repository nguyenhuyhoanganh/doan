export const setAcessTokenToLocalStorage = (access_token) => {
  localStorage.setItem('access_token', access_token)
}

export const setRefreshTokenToLocalStorage = (refresh_token) => {
  localStorage.setItem('refresh_token', refresh_token)
}

export const setProfileToLocalStorage = (profile) => {
  localStorage.setItem('profile', JSON.stringify(profile))
}

// create evet target
export const LocalStorageEventTarget = new EventTarget()

export const clearLocalStorage = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('profile')
  // create event
  const clearLocalStorageEvent = new Event('clear-local-strorage')
  // use event target dispatch event
  // component <App /> will listen event to clear access_token, refresh_token, profile in context
  LocalStorageEventTarget.dispatchEvent(clearLocalStorageEvent)
}

export const getAccessTokenFromLocalStorage = () => localStorage.getItem('access_token') || ''

export const getRefreshTokenFromLocalStorage = () => localStorage.getItem('refresh_token') || ''

export const getProfileFromLocalStorage = () => {
  const result = localStorage.getItem('profile')
  return result ? JSON.parse(result) : null
}
