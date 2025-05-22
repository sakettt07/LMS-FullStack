import React, { use, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { login, resetAuthSlice } from '../store/slices/authSlice';
import { toast } from 'react-toastify';
import BookWebLogo from "../assets/BookWebLogo.png";

const Login = () => {
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');

  const dispatch=useDispatch();

  const {loading,error,message,user,isAuthenticated } =useSelector((state)=>state.auth);

  const navigateTo=useNavigate();
  const handleLogin=(e)=>{
    e.preventDefault();
    const data=new FormData();
    data.append("email",email);
    data.append("password",password);
    dispatch(login(data));
  };

  useEffect(()=>{
    // if(message){
    //   dispatch(resetAuthSlice());
    //   navigateTo(`/dashboard`);
    // }
    if(error){
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  },[dispatch,isAuthenticated,error,loading]);

  if(isAuthenticated){
    return <Navigate to={'/'} />
  }
  return (
    <>
          <div className="flex flex-col justify-center md:flex-row h-screen">
            <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8 relative">
              <div className="max-w-sm w-full">
                <div className="flex justify-center mb-2">
                  <div className="rounded-full flex items-center justify-center">
                    <img src={BookWebLogo} alt="Logo" className="w-88 md:w-48" />
                  </div>
                </div>
                <h1 className="text-5xl font-medium text-center mb-12 md:mb-9">
                  Welcome Back !!
                </h1>
                <p className='text-gray-800 text-center mb-12'>Please enter your credentials to login</p>
                <form onSubmit={handleLogin}>
                  <div className='mb-2'>
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-black rounded-md py-3 px-4 focus:outline-none"
                    />
                  </div>
                  <div className='mb-2'>
                    <input
                      type="text"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full border border-black rounded-md py-3 px-4 focus:outline-none"
                    />
                  </div>
                  <Link to={"/password/forgot"} className='font-semibold rounded-md hover:text-blue-700 text-black cursor-pointer'>Forgot Password ?</Link>
                  <div className='block md:hidden font-semibold mt-1'>
                    <p>New to our platform?{" "}
                      <Link to={"/register"} className='text-sm text-gray-600 hover:underline'>Signup</Link>
                    </p>
                  </div>
                  <button
                    className="border-2 py-2 rounded-lg mt-5 border-black w-full font-semibold bg-black text-white hover:bg-white hover:text-black transition"
                    type="submit"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
            <div className="hidden w-full md:w-1/2 bg-black text-white md:flex flex-col items-center justify-center p-8 rounded-tl-[80px] rounded-bl-[80px]">
              <div className="text-center h-[400px]">
                <div className="flex justify-center mb-12">
                  <img
                    src={BookWebLogo}
                    alt="Logo"
                    className="mb-12 h-44 w-auto"
                  />
                </div>
                <p className="text-gray-300 mb-12">
                  New to our platform? Signup now
                </p>
                <Link
                  className="border-2 py-2 rounded-lg mt-5 border-white px-8 w-full font-semibold bg-black text-white hover:bg-white hover:text-black transition"
                  to="/register"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>

    </>
  )
}

export default Login