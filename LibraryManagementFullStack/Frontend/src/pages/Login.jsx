import React, { use, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { login, resetAuthSlice } from '../store/slices/authSlice';
import { toast } from 'react-toastify';

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
    <div className='flex flex-col justify-center md:flex-row h-screen bg-black'>
      <div>
        <div>
          <div>
            <img src="" alt="sometitlesImage" />
          </div>
          <p>Already have Account? Sign in now </p>
          <Link to={'/login'}>Sign in</Link>
        </div>
      </div>
    </div>
  )
}

export default Login