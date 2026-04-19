import axios from "axios";
import { createContext, useEffect, useState } from "react";
import server_endpoint from "../endpoint"

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);
  const endpoint=server_endpoint.server_endpoint;
  
  useEffect(() => {
    axios.get(`${endpoint}/auth`,{withCredentials:true})
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};