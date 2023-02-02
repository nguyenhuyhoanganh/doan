import axios, { HttpStatusCode } from 'axios'
import { toast } from 'react-toastify'

class Http {
  instance
  constructor() {
    this.instance = axios.create({
      baseURL: 'http://localhost:8080/api/',
      timeout: 10 * 1000,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
      }
    })
    this.instance.interceptors.response.use(
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
  }
}

const http = new Http().instance

export default http
