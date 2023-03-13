import http from '../utils/http'

const URL = 'songs'
const songApi = {
  getSongs(params) {
    return http.get(URL, {
      params
    })
  },
  getSongDetail(id) {
    return http.get(`${URL}/S{id}`)
  }
}

export default songApi
