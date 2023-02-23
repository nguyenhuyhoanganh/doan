import path from '../constants/path'
import http from './../utils/http'

export const registerAccount = (body) => http.post(path.register, body)

export const login = (body) => http.post(path.login, body)

export const logout = () => http.post(path.logout)
