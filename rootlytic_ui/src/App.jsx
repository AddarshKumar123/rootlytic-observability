import { useState } from 'react'
import {Routes,Route} from "react-router-dom"
import './App.css'
import LandingPage from './components/LandingPage'
import Dashboard from './components/Dashboard'
import ServicesPage from './components/ServicesPage'
import IntegrationPage from './components/IntegrationPage'
import { Login, Signup } from './components/Auth'
function App() {

  return (
    <>
    
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path='/' element={<LandingPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/:id/services" element={<ServicesPage/>} />
      <Route path="/integration" element={<IntegrationPage />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/login' element={<Login />} />
    </Routes>
    </>
  )
}

export default App
