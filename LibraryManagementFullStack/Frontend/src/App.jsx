import React, { use } from 'react'
import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import ForgotPassword from './pages/ForgotPassword';
import Otp from './pages/Otp';
import Register from './pages/Register';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import {ToastContainer} from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from './store/slices/authSlice';

const App = () => {
  const {user,isAuthenticated} =useSelector((state),state.auth)

  const dispatch=useDispatch();

  useEffect(()=>{
    dispatch(getUser());
  },[])
  return <Router>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/otp-verfication/:email' element={<Otp />} />
      <Route path='/password/forgot' element={<ForgotPassword />} />
      <Route path='/password/reset/:token' element={<ResetPassword />} />
    </Routes>
    <ToastContainer theme='dark' />
  </Router>
}

export default App