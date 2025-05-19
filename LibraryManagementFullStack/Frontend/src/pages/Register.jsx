import React, { use, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { register, resetAuthSlice } from '../store/slices/authSlice';
import { toast } from 'react-toastify';
import BookWebLogo from "../assets/BookWebLogo.png";

const Register = () => {
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');

  const dispatch=useDispatch();

  const {loading,error,message,user,isAuthenticated } =useSelector((state)=>state.auth);

  const navigateTo=useNavigate();
  const handleLogin=(e)=>{
    e.preventDefault();
    const data=new FormData();
    data.append("name",name);
    data.append("email",email);
    data.append("password",password);
    dispatch(register(data));
  };

  useEffect(()=>{
    if(message){
      navigateTo(`/otp-verfication/${email}`);
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
    <div className='flex flex-col justify-center md:flex-row h-screen '>
      <div className='hidden w-full md:w-1/2 bg-black text-white md:flex flex-col justify-center items-center p-8 rounded-tr-[80px] rounded-br-[80px]'>
        <div className=' text-center h-[376px]'>
          <div className='flex justify-center '>
            <img className='mb-12 w-60' src={BookWebLogo} alt="sometitlesImage" />
          </div>
          <p className='text-gray-300 mb-12'>Already have Account? Sign in now </p>
          <Link className='border-2 rounded-lg font-semibold border-white py-2 px-8 hover:bg-white hover:text-black transition' to={'/login'}>Sign in</Link>
        </div>
      </div>
      <div className='w-full md:w-1/2 flex items-center justify-center bg-white p-8'></div>
    </div>
  )
}

export default Register