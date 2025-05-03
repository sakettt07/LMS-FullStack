import React, { useState,useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleSettingPopup } from '../store/slices/popupSlice';
import { IoSettings } from 'react-icons/io5';

const Header = () => {
    const dispatch = useDispatch();
    const{user} = useSelector(state => state.auth);
    const [currentDate,setCurrentDate]=useState("");
    const [currentTime,setCurrentTime]=useState("");

    useEffect(()=>{
        const updateDateTime = () => {
            const now = new Date();
            const hours=now.getHours() % 12 || 12;
            const minutes=now.getMinutes().toString().padStart(2,"0");
            //basically the above code will add a leading zero to the minutes if it is less than 10
            const amPm=now.getHours() < 12 ? "AM" : "PM";
            setCurrentTime(`${hours}:${minutes} ${amPm}`);

            const options={
                month:"short",
                day:"numeric",
                year:"numeric",
            }
            setCurrentDate(now.toLocaleDateString("en-US",options));
        };
        updateDateTime();
        const intervalId=setInterval(updateDateTime,1000);
        return () => clearInterval(intervalId);
    },[])

  return (
    <>
    <header className='absolute top-0 bg-white left-0 w-full  flex justify-between items-center px-6'>
        {/* left side */}
        <div className='flex items-center gap-2'>
            <img className='w-8 h-8' src="" alt="UserIcon" />
            <div className='flex flex-col'>
                <span className='text-sm font-medium sm:text-lg lg:text-xl sm:font-semibold'>UserNamee</span>
                <span className='text-sm font-medium sm:text-lg sm:font-semibold'>UserRole</span>
            </div>
        </div>
        {/* right side */}
        <div className='hidden md:flex items-center gap-3'>
            <div className='flex flex-col text-sm lg:text-base items-end font-semibold'>
                <span>{currentTime}</span>
                <span>{currentDate}</span>
            </div>
            <span className='bg-black h-14 w-[2px]' />
            {/* <img src="" alt="settingIcon" className='w-8 h-8' onClick={()=>toggleSettingPopup()} /> */}
            <IoSettings className='w-6 h-5 text-gray-500 cursor-pointer' onClick={()=>dispatch(toggleSettingPopup())} />

        </div>
    </header>
    </>
  )
}

export default Header