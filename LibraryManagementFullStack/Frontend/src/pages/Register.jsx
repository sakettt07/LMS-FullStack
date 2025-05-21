import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { register, resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import BookWebLogo from "../assets/BookWebLogo.png";
import { FaInfoCircle } from "react-icons/fa";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const dispatch = useDispatch();
  const { loading, error, message, user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const navigateTo = useNavigate();

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", name);
    data.append("email", email);
    data.append("password", password);
    if (avatar) data.append("avatar", avatar);
    dispatch(register(data));
  };

  useEffect(() => {
    if (message) {
      navigateTo(`/otp-verfication/${email}`);
    }
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, isAuthenticated, error, loading]);

  if (isAuthenticated) return <Navigate to="/" />;

  return (
    <div className="flex flex-col justify-center md:flex-row h-screen">
      {/* Left Side */}
      <div className="hidden w-full md:w-1/2 bg-black text-white md:flex flex-col justify-center items-center p-8 rounded-tr-[80px] rounded-br-[80px]">
        <div className="text-center h-[376px]">
          <div className="flex justify-center">
            <img className="mb-12 w-60" src={BookWebLogo} alt="sometitlesImage" />
          </div>
          <p className="text-gray-300 mb-12">Already have Account? Sign in now</p>
          <Link
            className="border-2 rounded-lg font-semibold border-white py-2 px-8 hover:bg-white hover:text-black transition"
            to={"/login"}
          >
            Sign in
          </Link>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-sm">
          <div className="flex justify-center mb-12">
            <div className="flex flex-col-reverse sm:flex-row items-center justify-center gap-5">
              <h3 className="text-5xl text-black">Signup</h3>
              <img className="h-auto w-24 object-cover" src={BookWebLogo} alt="logo" />
            </div>
          </div>
          <p className="text-gray-800 text-center mb-12">Please provide your information to Signin</p>
          <form onSubmit={handleRegister} encType="multipart/form-data">
            <div className="mb-2">
              <input
                type="text"
                placeholder="FullName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"
              />
            </div>
              <h2 className="text-red-600 flex items-center gap-2 justify-center mb-2"><FaInfoCircle /> Please enter correct email to receieve an OTP</h2>
            <div className="mb-2">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"
              />
            </div>
            <div className="mb-2">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Avatar Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="w-full px-4 py-2 border border-black rounded-md"
              />
              {avatarPreview && (
                <img
                  src={avatarPreview}
                  alt="Avatar Preview"
                  className="mt-2 w-20 h-20 object-cover rounded-full"
                />
              )}
            </div>
            <div className="block md:hidden font-semibold mt-5 flex items-center justify-center gap-3">
              <p>Already have Account?</p>
              <Link to={"/login"} className="text-blue-500 text-sm hover:underline">
                Sign in
              </Link>
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-2 mt-4 rounded-md hover:bg-gray-800"
            >
              SignUp
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
