import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PersistGate } from "redux-persist/integration/react";
import AdminLogin from "./components/AdminLogin";
import AdminProtectedRoute from "./components/AdminProtected";
import Dashboard from "./components/Dashboard";
import { HomeUser } from "./components/HomeUser";
import LoginUser from './components/LoginUser';
import SignUpUser from './components/SignUpUser';
import UserProtected from "./components/userProtected";
import { persistor, store } from "./store/store";


function App() {
   

  return (
    <>
    
    <BrowserRouter> 
    <ToastContainer theme='dark' />
    <Provider store={store}> 
    <PersistGate loading={null} persistor={persistor} >
     <Routes>
      <Route  path="/" element={<LoginUser/>} />
      <Route path="/signup" element={<SignUpUser/>} />
      <Route path="/home" element={<UserProtected><HomeUser/></UserProtected>} />
      <Route path="/admin/login" element={<AdminLogin/>} />
      <Route path="/admin/dashboard" element={<AdminProtectedRoute><Dashboard/></AdminProtectedRoute>} />
     </Routes>
    </PersistGate>
    </Provider>
    </BrowserRouter>  
    </>
  )
}

export default App
