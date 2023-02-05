import axios, { HttpStatusCode } from 'axios'
import { toast } from 'react-toastify'

const http = axios.create({
  baseURL: 'http://localhost:8080/api/',
  timeout: 10 * 1000,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
  }
})

http.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
      console.log(error)
      const message = error.response?.data.message || error.message
      toast.error(message)
    }
    return Promise.reject(error)
  }
)

export default http
