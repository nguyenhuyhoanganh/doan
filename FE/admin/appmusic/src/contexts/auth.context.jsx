import { createContext, useState } from 'react'
import { getAccessTokenFromLocalStorage, getProfileFromLocalStorage } from '../utils/auth'

const initialAuthContext = {
  isAuthenticated: getAccessTokenFromLocalStorage(),
  setIsAuthenticated: () => null,
  profile: getProfileFromLocalStorage(),
  setProfile: () => null
}

export const AuthContext = createContext(initialAuthContext)

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuthContext.isAuthenticated)
  const [profile, setProfile] = useState(initialAuthContext.profile)
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        profile,
        setProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
