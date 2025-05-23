import React, { useEffect, useState } from 'react';
import BookWebLogo from "../assets/BookWebLogo.png";
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, resetAuthSlice } from '../store/slices/authSlice';
import { toast } from 'react-toastify';
import { Navigate,Link } from 'react-router-dom';


const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const dispatch = useDispatch();

  const { loading, error, message, user, isAuthenticated } = useSelector((state) => state.auth);
  const handleForgotPassword=(e)=>{
    e.preventDefault();
    dispatch(forgotPassword(email));
  }
  useEffect(()=>{
    if(message){
      toast.success(message);
      dispatch(resetAuthSlice());
    }
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
      <title>Forgot Password - BookWorm Library</title>
      <div className="flex flex-col justify-center md:flex-row h-screen">
        <div className="hidden w-full md:w-1/2 bg-black text-white md:flex flex-col items-center justify-center p-8 rounded-tr-[80px] rounded-br-[80px]">
          <div className="text-center h-[450px]">
            <div className="flex justify-center mb-12">
              <img
                src={BookWebLogo}
                alt="Logo"
                className="mb-12 h-44 w-auto"
              />
            </div>
            <h3 className="text-gray-300 mb-12 max-w-[320px] mx-auto text-3xl font-medium leading-10">
              "Your premium digital library for borrowing and reading books"
            </h3>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8">
          <Link
            className="border-2 border-black rounded-3xl font-bold w-52 py-2 px-4 fixed top-10 -left-28 hover:bg-black hover:text-white transition duration-300 text-end"
            to="/login"
          >
            Back
          </Link>
          <div className="w-full max-w-sm">
            <div className="flex justify-center mb-3">
              <div className="rounded-full flex items-center justify-center">
                <img src={BookWebLogo} alt="Logo" className="md:h-44 w-60 md:w-60" />
              </div>
            </div>
            <h1 className="md:text-4xl text-5xl font-medium text-center mb-2">
              Forgot Password
            </h1>
            <p className="text-gray-800 text-center mb-8">
              Please enter your email
            </p>
            <form onSubmit={handleForgotPassword}>
              <div className="mb-2">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-black rounded-md py-3 px-4 focus:outline-none"
                />
              </div>
              <button
                className="border-2 py-2 cursor-pointer rounded-lg mt-5 border-black w-full font-semibold bg-black text-white hover:bg-white hover:text-black transition"
                type="submit"
                disabled={loading ? true : false}
              >
                Reset Password
              </button>
              <p className="text-gray-800 text-xl text-center mt-5">
                Remembered your password?{" "}
                <Link to="/login" className="font-semibold text-black">
                  Sign In
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default ForgotPassword