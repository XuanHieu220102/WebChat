import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './component/Login'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import ChatRoom from './component/ChartRoom'
import AuthProvider from './component/Context/AuthProvider'
import AppProvider from './component/Context/AppProvider'
import AddRoomModal from './component/Modal/AddRoomModal'
import InviteMemberModal from './component/Modal/InviteMemberModal'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Routes>
            <Route Component={Login} path='/login' />
            <Route Component={ChatRoom} path='/' />
          </Routes>
          <AddRoomModal/>
          <InviteMemberModal/>
        </AppProvider>
      </AuthProvider>


    </BrowserRouter>
  )
}

export default App
