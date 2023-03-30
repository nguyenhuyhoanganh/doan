import http from '../utils/http'

const URL = 'categories'
const categoryApi = {
  getCategories(params) {
    return http.get(URL, {
      params
    })
  },
  getCategoryById(id) {
    return http.get(`${URL}/${id}`)
  }
}

export default categoryApi
