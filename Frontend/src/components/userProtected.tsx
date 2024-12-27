import { ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { RootState } from '../store/store'

type userProtected={
    children:ReactNode
}
export default function UserProtected({children}:userProtected) {

   const {email}=useSelector((state:RootState)=>state.user)

  if(!email)
  {
    return <Navigate to='/'/>
  }else{
    return children
  }
}
