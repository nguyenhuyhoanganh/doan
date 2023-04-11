import http from '../utils/http'

const URL = 'composers'
const composerApi = {
  getComposers(params) {
    return http.get(URL, {
      params
    })
  },
  getComposerById(id) {
    return http.get(`${URL}/${id}`)
  },
  createComposer(composer) {
    return http.post(`${URL}/create`, composer)
  },
  modifyComposer(id, composer) {
    return http.put(`${URL}/modify/${id}`, composer)
  },
  deleteComposer(id) {
    return http.delete(`${URL}/delete/${id}`)
  }
}

export default composerApi
