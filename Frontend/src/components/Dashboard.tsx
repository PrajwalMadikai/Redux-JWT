import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { clearAdmin } from '../slices/adminSlice';
import { AppDispatch } from '../store/store';
type User = {
  id: string;
  email: string;
  image: string;
};

Modal.setAppElement('#root');

const Dashboard: React.FC = () => {

  const dispatch=useDispatch<AppDispatch>()

  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedUserId, setSelectedUser] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null);

  const [isCreatingUser, setIsCreatingUser] = useState<boolean>(false);
  const [newUserEmail, setNewUserEmail] = useState<string>('');
  const [newUserPassword, setNewUserPassword] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const token = sessionStorage.getItem('adminToken');

  useEffect(() => {
    const fetchUser = async () => {
      
      let response = await axios.get('http://localhost:3000/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const filterUsers: User[] = response.data.users.map((user: any) => ({
        id: user._id,
        email: user.email,
        image: user.image,
      }));
      setUsers(filterUsers);
    };
    fetchUser();
  }, [users]);

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = async (userId: string) => {
    try {
      setSelectedUser(userId);
      setIsEditing(true);
      let response = await axios.get(`http://localhost:3000/admin/edit/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
     
      setNewEmail(response.data.email);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handlesubmit:',newEmail);
    
    try {
      let res = await axios.post(
        `http://localhost:3000/admin/edit/${selectedUserId}`,
        { newEmail },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        setUsers((prevUsers) => {
            return prevUsers.map((user) =>
              user.id === selectedUserId ? { ...user, email: newEmail } : user
            );
          });
        setSelectedUser(null);
        setNewEmail('');
        setIsEditing(false);
        toast.success('Changes saved!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          theme: 'dark',
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openModal = (userId: string) => {
    setUserIdToDelete(userId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setUserIdToDelete(null);
  };

  const handleDeleteUser = async (userId: string | null) => {
    if (!userId) return;

    try {
      const res = await axios.delete(`http://localhost:3000/admin/delete/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId)); // Update state
        setIsModalOpen(false)
        toast.success('User deleted successfully!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          theme: 'dark',
        });
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete the user!', {
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

  const handleAdminLogout = async () => {
    try {
      let res = await axios.post('http://localhost:3000/admin/logout');
      if (res.status === 200) {
        dispatch(clearAdmin())
        sessionStorage.removeItem('adminToken');
        toast.success('Successfully logged out!', { autoClose: 3000 });
        navigate('/admin/login');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Failed to logout. Please try again.');
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:3000/admin/create',
        { email: newUserEmail, password: newUserPassword, isAdmin },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
       
        setIsCreatingUser(false);
        setNewUserEmail('');
        setNewUserPassword('');
        setIsAdmin(false);
        toast.success('User created successfully!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          theme: 'dark',
        });
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to create user!', {
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

  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <div className="w-1/4 bg-gray-800 text-white p-4 flex flex-col items-center">
        <h1 className="text-xl font-bold mb-6">Admin Dashboard</h1>
        <button className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition" onClick={handleAdminLogout}>
          Logout
        </button>
      </div>

      <div className="w-3/4 p-6">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Button to toggle user creation form */}
        <div className="mb-6">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            onClick={() => setIsCreatingUser(!isCreatingUser)}
          >
            {isCreatingUser ? 'Cancel' : 'Create User'}
          </button>
        </div>

        {/* Conditional Rendering of Create User Form */}
        {isCreatingUser && (
          <div className="mb-6 p-4 border border-gray-300 rounded">
            <h2 className="text-xl font-semibold mb-4">Create User</h2>
            <form onSubmit={handleCreateUser}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-semibold">Email</label>
                <input
                  type="email"
                  id="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-semibold">Password</label>
                <input
                  type="password"
                  id="password"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="isAdmin" className="block text-sm font-semibold">Is Admin</label>
                <input
                  type="checkbox"
                  id="isAdmin"
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                  className="w-4 h-4"
                />
              </div>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                type="submit"
              >
                Create User
              </button>
            </form>
          </div>
        )}

        {isEditing ? (
          <div className="mb-6 p-4 border border-gray-300 rounded">
            <h2 className="text-xl font-semibold mb-4">Edit User</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-semibold">Email</label>
                <input
                  type="email"
                  id="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded"
                />
              </div>
              <div className="space-x-4">
                <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" type="submit">
                  Save
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">Index</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Image</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
              {filteredUsers.map((user, index) => (
                    <tr key={index} className="even:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
                         
                        <td className="border border-gray-300 px-4 py-2 text-center">
                        {user.image ? (
                            <img src={`http://localhost:3000/uploads/${user.image}`} alt="User Image" className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                            <span>No Image</span>
                        )}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                        <button
                            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mr-2"
                            onClick={() => handleEdit(user.id)}
                        >
                            Edit
                        </button>
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            onClick={() => openModal(user.id)}
                        >
                            Delete
                        </button>
                        </td>
                    </tr>
                    ))}

              </tbody>
            </table>
          </div>
        )}

        {/* Modal for Delete Confirmation */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Confirm Delete"
          className="w-96 p-6 flex justify-center items-center bg-white rounded shadow-lg"
        >
          <h2 className="text-lg font-semibold mb-4">Are you sure you want to delete this user?</h2>
          <div className="space-x-4">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              onClick={() => handleDeleteUser(userIdToDelete)}
            >
              Yes
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={closeModal}
            >
              No
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Dashboard;
