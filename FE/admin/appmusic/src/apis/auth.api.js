import http from './../utils/http'

const authApi = {
  registerAccount(body) {
    return http.post('/register', body)
  },
  login(body) {
    return http.post('/login', body)
  },
  logout() {
    return http.post('/logout')
  },
  changePassword(body) {
    return http.post('/change-password', body)
  }
}

export default authApi
