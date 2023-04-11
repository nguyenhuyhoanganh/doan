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
  },
  createAlbum(album) {
    return http.post(`${URL}/create`, album)
  },
  modifyAlbum(id, album) {
    return http.put(`${URL}/modify/${id}`, album)
  },
  deleteAlbum(id) {
    return http.delete(`${URL}/delete/${id}`)
  }
}

export default albumApi
