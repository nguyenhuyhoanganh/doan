import http from '../utils/http'

const URL = 'roles'
const roleApi = {
  getRoles(params) {
    return http.get(URL, {
      params
    })
  },
  getRoleById(id) {
    return http.get(`${URL}/${id}`)
  }
}

export default roleApi
