import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLogin from "./components/AdminLogin";
import Dashboard from "./components/Dashboard";
import { HomeUser } from "./components/HomeUser";
import LoginUser from './components/LoginUser';
import SignUpUser from './components/SignUpUser';
import { store } from "./store/store";


function App() {
   

  return (
    <>
    
    <BrowserRouter> 
    <ToastContainer theme='dark' />
    <Provider store={store}> 
     <Routes>
      <Route  path="/" element={<LoginUser/>} />
      <Route path="/signup" element={<SignUpUser/>} />
      <Route path="/home" element={<HomeUser/>} />
      <Route path="/admin/login" element={<AdminLogin/>} />
      <Route path="/admin/dashboard" element={<Dashboard/>} />
     </Routes>
    </Provider>
    </BrowserRouter>  
    </>
  )
}

export default App
