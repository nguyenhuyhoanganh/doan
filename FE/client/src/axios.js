import axios, { HttpStatusCode } from 'axios'
import { toast } from 'react-toastify'
import {
  clearLocalStorage,
  getAccessTokenFromLocalStorage,
  setAcessTokenToLocalStorage,
  setProfileToLocalStorage
} from './utils/auth'
import path from './utils/path'
class Http {
  instance
  accessToken
  constructor() {
    this.accessToken = getAccessTokenFromLocalStorage()
    this.instance = axios.create({
      baseURL: process.env.REACT_APP_SERVER_URL,
      timeout: 10 * 1000,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
      }
    })

    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken) {
          config.headers.Authorization = `Bearer ${this.accessToken}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config
        if (url === `/${path.LOGIN}`|| url === `/${path.REGISTER}`) {
          const data = response.data
          this.accessToken = data?.data.access_token
          setAcessTokenToLocalStorage(this.accessToken)
          setProfileToLocalStorage(data?.data.user)
        }
        if (url === `/${path.LOGOUT}`) {
          this.accessToken = ''
          clearLocalStorage()
        }
        return response
      },
      (error) => {
        if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
          const message = error.response?.data.message || error.message
          toast.error(message)
        }
        if (error.response?.status === HttpStatusCode.Unauthorized) {
          clearLocalStorage()
        }
        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance

export default http