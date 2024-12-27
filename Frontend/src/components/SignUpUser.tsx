import axios, { AxiosRequestConfig } from 'axios';
import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignUpUser:React.FC=()=>{
 
   const [email,setEmail]=useState('')
   const [password,setPassword]=useState('')
   const navigate=useNavigate()
   const handleSubmit=async(e:React.FormEvent)=>{

    e.preventDefault()
    const formData={
      email,
      password
    }
    if (!email || !password) {
      toast.error("Please fill in both fields", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        theme: "dark",
      });
      return;
    }
    try {
      const config: AxiosRequestConfig = {

        headers: {
          'Content-Type': 'application/json',
        },
      };

      await axios.post('http://localhost:3000/signup',formData,config)


      toast.success("signuped successfully",{
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        theme: "dark",
      })
      navigate('/')
      setEmail('');
      setPassword('');
 
    } catch (error:any) {
       
      
       if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message , {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          theme: "dark",
        });
      } else {
        toast.error("An unexpected error occurred. Please try again later.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          theme: "dark",
        });
      }
    }
   }

  return (
    <div className='w-full h-full'>
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              
              onChange={(e)=>setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              
              onChange={(e)=>setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Sign up
          </button>
        </form>

        {/* Forgot Password and Sign Up Links */}
        <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
         <Link to='/'> <p className='text-md font-semibold'>Already have Account ?</p></Link>
           
          
           
        </div>
      </div>
    </div>
    </div>
  )
}
export default SignUpUser