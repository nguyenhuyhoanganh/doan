import http from './../utils/http'

export const registerAccount = (body) => http.post('register', body)
