export const setAcessTokenToLocalStorage = (access_token) => {
  localStorage.setItem('access_token', access_token)
}

export const setRefreshTokenToLocalStorage = (refresh_token) => {
  localStorage.setItem('refresh_token', refresh_token)
}

export const setProfileToLocalStorage = (profile) => {
  localStorage.setItem('profile', JSON.stringify(profile))
}
export const clearLocalStorage = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('profile')
}

export const getAccessTokenFromLocalStorage = () => localStorage.getItem('access_token') || ''

export const getRefreshTokenFromLocalStorage = () => localStorage.getItem('refresh_token') || ''

export const getProfileFromLocalStorage = () => {
  const result = localStorage.getItem('profile')
  return result ? JSON.parse(result) : null
}
