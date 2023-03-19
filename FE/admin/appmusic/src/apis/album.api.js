import http from '../utils/http'

const URL = 'albums'
const albumApi = {
  getAlbums(params) {
    return http.get(URL, {
      params
    })
  },
  getAlbumBySlug(slug) {
    return http.get(`${URL}/${slug}`)
  }
}

export default albumApi
