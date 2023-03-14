import http from '../utils/http'

const URL = 'songs'
const songApi = {
  getSongs(params) {
    return http.get(URL, {
      params
    })
  },
  getSongById(id) {
    return http.get(`${URL}/S{id}`)
  }
}

export default songApi
