import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import FashionBuddy from './fashion_buddy/FashionBuddy'
import { ToastContainer } from 'react-toastify';
// FIXED: Corrected path for React Toastify CSS bundle
import 'react-toastify/dist/ReactToastify.css' 

export const backendUrl = "https://e-commerce-tqol.onrender.com";

const App = () => {
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <ToastContainer />
      <Navbar />
      <SearchBar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/collection' element={<Collection />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        {/* Note: Ensure your context handles 'productId' as a string token since Astra DB does not use Mongoose ObjectIds */}
        <Route path='/product/:productId' element={<Product />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/login' element={<Login />} />
        <Route path='/place-order' element={<PlaceOrder />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/verify' element={<Orders />} />
        <Route path='/fashion-buddy' element={<FashionBuddy />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App