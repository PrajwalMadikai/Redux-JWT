import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { clearUser } from '../slices/userSlice'
import { AppDispatch, RootState } from '../store/store'

export const HomeUser:React.FC = () => {
 
  const {email}=useSelector((state:RootState)=>state.user)
  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();
  const [profileImage,setImage]=useState<string|null>(null)

  const token = sessionStorage.getItem('token'); 
    useEffect(()=>{
        const fetchUser=async()=>{
          let response=await axios.get(`http://localhost:3000/user/${email}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
            },})
          const userImg=response.data.user.image
          
          setImage(userImg)
        }
        fetchUser()
    },[profileImage])

    const handleLogout = async () => {
      try {
          const token = sessionStorage.getItem('token');
          const res = await axios.get('http://localhost:3000/logout', {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          });
          if (res.status === 200) {
              sessionStorage.removeItem('token');
              dispatch(clearUser());
              toast.success('Logout successfully', {
                  position: 'top-right',
                  autoClose: 3000,
                  hideProgressBar: true,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: false,
                  theme: 'dark',
              });
              navigate('/');
          }
      } catch (err) {
          console.error(err);
          toast.error('Failed to logout. Please try again.', {
              position: 'top-right',
              autoClose: 3000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: false,
              theme: 'dark',
          });
      }
  };
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        const formData = new FormData();
        formData.append('image', file);
        const token = sessionStorage.getItem('token');

        try {
            const response = await axios.post(
                `http://localhost:3000/profile/${email}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                toast.success('Profile Picture updated', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: false,
                    theme: 'dark',
                });

                const imageFilename = response.data.userData.image; // Updated path from backend.
                setImage(imageFilename); // Set the image filename in the state.
            }
        } catch (error) {
            console.log(error);
        }
    }
};

  return (
    <div className="flex h-screen bg-gray-100 p-6">
      {/* Left Section */}
      <div className="flex flex-col items-center bg-white rounded-lg shadow-lg p-6 w-1/3 mr-6">
        {/* Profile Picture */}
        <div className="relative mb-4">
          <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center">
            {profileImage ? (
              <img
              src={`http://localhost:3000/uploads/${profileImage}`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-500 text-sm">Upload Image</span>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            name='image'
            onChange={handleFileChange}
            className="mt-2 block text-sm text-gray-600"
          />
        </div>

        {/* User Email */}
        <p className="text-lg font-semibold text-gray-800 mb-4">{email}</p>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Right Section */}
      <div className="flex flex-grow items-center justify-center bg-white rounded-lg shadow-lg">
        <div className="text-center bg-gray-100 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800">Welcome, {email}!</h2>
        </div>
      </div>
    </div>
  )
}
