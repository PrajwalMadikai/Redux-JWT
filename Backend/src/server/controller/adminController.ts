import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../modal/userModal'
dotenv.config()

const login=async(req:Request,res:Response):Promise<void>=>{
    try {
        const { email, password } = req.body;
    console.log('inside of admin login');
    
        
        if (!email || !password) {
           res.status(400).json({ message: 'Email and password are required' });
           return
        }
    
       
        const admin = await User.findOne({ email, isAdmin: true });
        if (!admin) {
           res.status(404).json({ message: 'Admin user not found' });
           return
        }
    
       
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
           res.status(401).json({ message: 'Invalid credentials' });
           return
        }
    
       
        const jwtSecret = process.env.jwt_token;
        
        if (!jwtSecret) {
          throw new Error('JWT_SECRET is not defined in environment variables');
        }
    
        const token = jwt.sign(
            { userId: admin._id, email: admin.email, isAdmin: true }, 
            jwtSecret,
           { expiresIn: '1h',}
        );
    
        res.status(200).json({
          message: 'Admin login successful',
          token,
        });
      } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
}

const users=async(req:Request,res:Response):Promise<void>=>{
    try {
        let fetchUsers=await User.find({isAdmin:false})

        if (!fetchUsers) {
            res.status(401).json({ message: 'Failed Fetching users' });
            return
         }

         res.status(200).json({message:'users fetched',users:fetchUsers})

    } catch (error) {
        console.log(error);
        
    }
}

const editGet=async(req:Request,res:Response):Promise<void>=>{
    let userId=req.params.id
         try {
              let user=await User.findOne({_id:userId})
              if(!user)
              {
                res.status(404).json({message:'no user is found'})
                return
              }

            res.status(200).json({message:'selected user edit',email:user.email})
            return
         } catch (error) {
            
         }
}
const editPost=async(req:Request,res:Response):Promise<void> =>{
    let userId=req.params.id
    const email=req.body.newEmail
    console.log('edited:',email)
    try {
     
         let user=await User.findByIdAndUpdate({_id:userId},{email:email})
         if(!user)
         {
            res.status(404).json({message:'no user is found'})
            return
         }
         res.status(200).json({message:'selected user edit',user})
            return

    } catch (error) {
        console.log(error);
    }
}
const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.id;

    try {
        
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

         
        await User.findByIdAndDelete(userId);

        res.status(200).json({ message: 'User deleted successfully', userId });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
const logout=async(req:Request,res:Response)=>{
    try {
        res.status(200).json({ message: 'Admin logout successfully' });
    } catch (error) {
        console.log(error);
        
    }
}

const createUser=async(req:Request,res:Response): Promise<void> =>{
    const {email,password,isAdmin}=req.body
    try {
         
         
        let user=await User.findOne({email})
        
        
        if(user)
        {
            res.status(404).json({message:'user already existis'})
            return
        }

        let hash=await bcrypt.hash(password,10)
        let newUser=new User({
            email,
            password:hash,
            isAdmin,
            isBlock:false
        })
        await newUser.save()
    
        
        res.status(200).json({message:'user created successfully',user:newUser})
        
        
    } catch (error) {
        console.log(error);
        
    }
}


export default {login,users,editPost,editGet,deleteUser,logout,createUser}