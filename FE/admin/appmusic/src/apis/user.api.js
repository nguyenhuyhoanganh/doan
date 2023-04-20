import http from '../utils/http'

const URL = 'users'
const userApi = {
  getUsers(params) {
    return http.get(URL, {
      params
    })
  },
  getUserById(id) {
    return http.get(`${URL}/${id}`)
  },
  modifyUser(id, user) {
    return http.put(`${URL}/modify/${id}`, user)
  },
  deleteUser(id) {
    return http.delete(`${URL}/delete/${id}`)
  }
}

export default userApi
