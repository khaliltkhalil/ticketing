"use client";
import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children, initialCurrentUser }) {
  const [currentUser, setCurrentUser] = useState(initialCurrentUser);
  return (
    <AuthContext.Provider value={[currentUser, setCurrentUser]}>
      {children}
    </AuthContext.Provider>
  );
}
