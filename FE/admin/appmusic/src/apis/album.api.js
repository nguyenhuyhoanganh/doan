import http from '../utils/http'

const URL = 'albums'
const albumApi = {
  getAlbums(params) {
    return http.get(URL, {
      params
    })
  },
  getAlbumById(id) {
    return http.get(`${URL}/${id}`)
  }
}

export default albumApi
