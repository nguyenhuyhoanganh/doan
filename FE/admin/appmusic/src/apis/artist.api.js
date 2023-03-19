import http from '../utils/http'

const URL = 'artists'
const artistApi = {
  getArtists(params) {
    return http.get(URL, {
      params
    })
  },
  getArtistBySlug(slug) {
    return http.get(`${URL}/${slug}`)
  }
}

export default artistApi
