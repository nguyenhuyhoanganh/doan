import http from '../utils/http'

const URL = 'categories'
const categoryApi = {
  getCategories(params) {
    return http.get(URL, {
      params
    })
  },
  getCategoryBySlug(slug) {
    return http.get(`${URL}/${slug}`)
  }
}

export default categoryApi
