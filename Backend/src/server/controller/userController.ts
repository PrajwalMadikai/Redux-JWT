import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { Request, Response } from 'express';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import User from '../modal/userModal';
dotenv.config()

export type userDetail = {
    email: string | undefined;
    password: string | undefined;
};
 
const uploadDir = process.env.NODE_ENV === 'production'
    ? path.join(__dirname, '..', 'uploads') // For production: dist/uploads
    : path.join(__dirname, '..', '..', 'uploads'); // For development: root/uploads

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

export const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

 
const signup =async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
 
        const oldUser = await User.findOne({ email });
        if (oldUser) {
              res.status(400).json({ message: 'User already exists', oldUser: true });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            password: hashPassword,
            isAdmin: false,
            isBlock: false,
            image:null
        });
        await newUser.save();

         res.status(201).json({ message: 'User created successfully', newUser: true });
    } catch (error) {
        console.error(error);
         res.status(500).json({ message: 'Server error during signup' });
    }
};

 
const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            // Ensure execution stops after sending the response
              res.status(400).json({ message: 'Email and password are required' });
              return
        }

        const userLogin = await User.findOne({ email });

        if (!userLogin) {
             res.status(404).json({ message: 'User not found', loginSuccess: false });
             return
        }

        const isMatch = await bcrypt.compare(password, userLogin.password);
        if (!isMatch) {
            
              res.status(401).json({ message: 'Invalid credentials', loginSuccess: false });
              return
        }

        const jwtSecret = process.env.jwt_token;
        if (!jwtSecret) {
            throw new Error('JWT secret key is not defined in environment variables.');
        }

        const token = jwt.sign(
            { email: userLogin.email, userId: userLogin._id },
            jwtSecret,
            { expiresIn: '1h' }
        );

     
          res.status(200).json({ message: 'Login successful', loginSuccess: true, token });
          return
    } catch (error) {
        console.error(error);
   
         res.status(500).json({ message: 'Server error during login' });
         return
    }
};

const logout = (req: Request, res: Response): void => {
    try {
        
        res.clearCookie('token'); //clearing cookie of JWT
        
        res.status(200).json({ message: 'Logout successful', logoutSuccess: true });
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ message: 'Server error during logout' });
    }
};

const upload = async (req: Request, res: Response): Promise<void> => {
    const  email = req.params.email;
    const file = req.file;

    console.log('email upload:',email);
    
    try {
       

        if (!file) {
            console.log('File not uploaded or missing in /profile');
            res.status(400).send({ message: 'No file uploaded' });
            return;
        }

        const imagePath = req.file?.filename;; // Store only the filename, not the full path.

        // Update the user's profile image in the database.
        const updatedUser = await User.updateOne(
            { email: email },
            { $set: { image: imagePath } } 
        );

        if (!updatedUser) {
            res.status(404).send({ message: 'User not found' });
            return;
        }
         
        res.status(200).send({
            message: 'Profile image updated successfully',
            userData: updatedUser, // Return the image filename.
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error updating profile image' });
    }
};


const user=async(req:Request,res:Response):Promise<void> =>{
    const email=req.params.email
    try {
        
        let user=await User.findOne({email:email})
        
        res.status(200).json({message:'user data fetched',user})
    } catch (error) {
        console.log(error);
        
    }
}
 

export default { signup, login ,logout,upload,user};
