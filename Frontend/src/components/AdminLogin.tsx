import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setAdmin } from '../slices/adminSlice';
import { AppDispatch } from '../store/store';

interface TokenPayload{
  email:string|null;
  adminId:string|null
}
const AdminLogin: React.FC = () => {
  const dispatch=useDispatch<AppDispatch>()

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/admin/login', {
        email,
        password,
      });

      if (response.status === 200) {
          toast.success('Admin login successful!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          theme: 'dark',
        });
        const tokens=response.data.token
        let decodeToken=jwtDecode<TokenPayload>(tokens)
        dispatch(setAdmin({email:decodeToken.email,adminId:decodeToken.adminId}))
        console.log('admin redux:',decodeToken.email);
        
        if (response.data.token) {
          sessionStorage.setItem('adminToken', response.data.token);
        }
      
        navigate('/admin/dashboard')
        
      }
    } catch (error: any) {
      console.error('Login Error:', error);
      toast.error(
        error.response?.data?.message || 'Failed to login. Try again.',
        {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          theme: 'dark',
        }
      );
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4 text-center">Admin Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className={`w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
