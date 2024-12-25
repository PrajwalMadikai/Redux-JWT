 import express from 'express'
import multer from 'multer'
import userController, { storage } from '../controller/userController'
import authMiddleware from '../middleware/authMiddleware'
 const router=express.Router()
 const upload=multer({storage})

 router.post('/signup',userController.signup) 
 router.post('/login',userController.login) 
 router.get('/logout',authMiddleware,userController.logout) 
 router.get('/user/:email',authMiddleware,userController.user) 
 router.post('/profile/:email',authMiddleware,upload.single('image'),userController.upload) 

 export default router;