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
  }
}

export default composerApi
