import http from '../utils/http'

const URL = 'songs'
const songApi = {
  getSongs(params) {
    return http.get(URL, {
      params
    })
  },
  getSongBySlug(slug) {
    return http.get(`${URL}/${slug}`)
  }
}

export default songApi
