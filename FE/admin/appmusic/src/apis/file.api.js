import axios from 'axios'
import { toast } from 'react-toastify'

const http = axios.create({
  baseURL: 'http://localhost:8080/api/',
  timeout: 100 * 1000,
  headers: {
    'Content-Type': 'multipart/form-data',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
  }
})

http.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
)

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data.message || error.message
    toast.error(message)
    return Promise.reject(error)
  }
)

const URL = 'files'
const fileApi = {
  uploadFile(file) {
    const formData = new FormData()
    formData.append('file', file)
    return http.post(`${URL}/upload?storageOption=LOCAL`, formData)
  }
}

export default fileApi
