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
  },
  createCategory(category) {
    return http.post(`${URL}/create`, category)
  },
  modifyCategory(id, category) {
    return http.put(`${URL}/modify/${id}`, category)
  },
  deleteCategory(id) {
    return http.delete(`${URL}/delete/${id}`)
  }
}

export default categoryApi
