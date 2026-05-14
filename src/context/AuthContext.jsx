import { createContext, useContext, useState, useCallback } from "react"

const AuthContext = createContext({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  openLogin: () => {},
  closeLogin: () => {},
})

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)

  const openLogin = useCallback(() => setShowLoginModal(true), [])
  const closeLogin = useCallback(() => setShowLoginModal(false), [])

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, showLoginModal, openLogin, closeLogin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
