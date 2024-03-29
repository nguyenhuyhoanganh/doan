import http from '../utils/http'

const URL = 'songs'
const songApi = {
  getSongs(params) {
    return http.get(URL, {
      params
    })
  },
  getSongById(id) {
    return http.get(`${URL}/${id}`)
  },
  createSong(song) {
    return http.post(`${URL}/create`, song)
  },
  modifySong(id, song) {
    return http.put(`${URL}/modify/${id}`, song)
  },
  deleteSong(id) {
    return http.delete(`${URL}/delete/${id}`)
  },
  chart(top = 10) {
    return http.get(`${URL}/chart?top=${top}`)
  },
  statistics() {
    return http.get(`${URL}/statistics`)
  }
}

export default songApi
