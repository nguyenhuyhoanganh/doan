import http from '../utils/http'

const URL = 'composers'
const composerApi = {
  getComposers(params) {
    return http.get(URL, {
      params
    })
  },
  getComposerBySlug(slug) {
    return http.get(`${URL}/${slug}`)
  }
}

export default composerApi
