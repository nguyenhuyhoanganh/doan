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
  }
}

export default artistApi
