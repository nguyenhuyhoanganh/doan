export const setAcessTokenToLocalStorage = (access_token) => {
  localStorage.setItem('access_token', access_token)
}

export const setRefreshTokenToLocalStorage = (refresh_token) => {
  localStorage.setItem('refresh_token', refresh_token)
}

export const clearLocalStorage = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}

export const getAccessTokenFromLocalStorage = () => localStorage.getItem('access_token') || ''

export const getRefreshTokenFromLocalStorage = () => localStorage.getItem('refresh_token') || ''
