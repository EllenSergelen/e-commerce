import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Routes, Route, Navigate } from 'react-router-dom';
import Add from './pages/Add';
import List from './pages/List';
import Orders from './pages/Orders';
import Login from './components/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = '$'

const App = () => {

  const [token, setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):'');

  useEffect(()=>{
    localStorage.setItem('token', token)
  },[token])

return (
  <div className='bg-gray-50 min-h-screen'>
    <ToastContainer />

    {token && (
      <>
        <Navbar setToken={setToken} />
        <hr />
      </>
    )}

    <div className='flex w-full'>
      {token && <Sidebar />}

      <div className='w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-base'>
        <Routes>

          {/* Login route */}
          <Route
            path="/"
            element={
              token ? <Navigate to="/add" /> : <Login setToken={setToken} />
            }
          />

          {/* Protected routes */}
          <Route
            path="/add"
            element={token ? <Add token={token} /> : <Navigate to="/" />}
          />

          <Route
            path="/list"
            element={token ? <List token={token} /> : <Navigate to="/" />}
          />

          <Route
            path="/orders"
            element={token ? <Orders token={token} /> : <Navigate to="/" />}
          />

        </Routes>
      </div>
    </div>
  </div>
);

}

export default App;