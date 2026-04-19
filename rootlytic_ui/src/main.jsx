import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {BrowserRouter} from "react-router-dom"
import App from './App.jsx'
import { AuthProvider } from './AuthHandler/AuthContext.jsx'
import { Provider } from './components/ui/provider'

createRoot(document.getElementById('root')).render(
  <Provider>
    <AuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </AuthProvider>
  </Provider>
)
