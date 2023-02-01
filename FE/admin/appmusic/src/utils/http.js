import axios from 'axios'

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
  }
}

const http = new Http().instance

export default http
