import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const {}=useSelector(state=>state.auth);
  return (
    <div>Register</div>
  )
}

export default Register