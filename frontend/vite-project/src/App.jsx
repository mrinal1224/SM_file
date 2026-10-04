import './App.css'
import { useEffect } from 'react'
import Login from './pages/Login.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignUp from './pages/SignUp'
import Landing from './pages/Landing'
import Home from './pages/Home'
import { AuthProvider } from './context/AuthContext'
import PublicRoute from './components/PublicRoute'
import ProtectedRoute from './components/ProtectedRoute'
import Profile from './pages/Profile'
import socket from './socket.js'


function App() {

  // SOCKET.IO STEP 2: START THE CLIENT CONNECTION
  //
  // We keep the socket connection at the App level so it is not recreated
  // every time the user changes from Home to Profile or another route.
  useEffect(() => {

    // These functions run when Socket.IO tells us that the connection
    // has been established or disconnected.
    const handleConnect = () => {
      console.log('Socket connected:', socket.id)

      // SOCKET.IO STEP 3: SEND OUR FIRST CUSTOM EVENT
      //
      // "hello" is our own event name. The second argument is the data
      // that will travel from this browser to the server.
      socket.emit('hello', 'Hello from the client!')
    }

    const handleDisconnect = () => {
      console.log('Socket disconnected')
    }

    // Listen for the custom event that the server sends back.
    const handleHelloResponse = (message) => {
      console.log('Server says:', message)
    }

    // Register listeners BEFORE calling connect().
    // This way we are already listening when the first connection succeeds.
    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)
    socket.on('hello-response', handleHelloResponse)

    // socket.js uses autoConnect: false, so importing the socket does not
    // connect automatically. React explicitly starts the connection here.
    socket.connect()

    // React runs this cleanup when App unmounts.
    // First remove our listeners so they cannot be registered multiple times,
    // then close the realtime connection.
    return () => {
      socket.off('connect', handleConnect)
      socket.off('disconnect', handleDisconnect)
      socket.off('hello-response', handleHelloResponse)
      socket.disconnect()
    }
  }, [])


  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<PublicRoute><Landing /></PublicRoute>} />
            <Route path='/login' element={<PublicRoute><Login /></PublicRoute>} />
            <Route path='/signup' element={<PublicRoute><SignUp /></PublicRoute>} />
            <Route path='/home' element={<ProtectedRoute><Home /></ProtectedRoute>} />

            <Route path='/profile/:username' element={<ProtectedRoute><Profile /></ProtectedRoute>} />




          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
