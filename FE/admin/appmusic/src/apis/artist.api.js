import http from '../utils/http'

const URL = 'artists'
const artistApi = {
  getArtists(params) {
    return http.get(URL, {
      params
    })
  },
  getArtistById(id) {
    return http.get(`${URL}/${id}`)
  },
  createArtist(artist) {
    return http.post(`${URL}/create`, artist)
  },
  modifyArtist(id, artist) {
    return http.put(`${URL}/modify/${id}`, artist)
  },
  deleteArtist(id) {
    return http.delete(`${URL}/delete/${id}`)
  }
}

export default artistApi
