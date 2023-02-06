import { createContext, useState } from 'react'
import { getAccessTokenFromLocalStorage, getProfileFromLocalStorage } from '../utils/auth'

const initialAppContext = {
  isAuthenticated: getAccessTokenFromLocalStorage(),
  setIsAuthenticated: () => null,
  profile: getProfileFromLocalStorage(),
  setProfile: () => null
}

export const AppContext = createContext(initialAppContext)

export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(initialAppContext.isAuthenticated)
  const [profile, setProfile] = useState(initialAppContext.profile)
  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        profile,
        setProfile
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
