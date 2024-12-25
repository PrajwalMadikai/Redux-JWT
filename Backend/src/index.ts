import cors from 'cors';
import express from 'express';
import path from 'path';
import connectDB from './server/database/connectDb';
import adminRoute from './server/route/admin';
import userRoute from './server/route/user';
const app = express();

connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors({
  origin: 'http://localhost:5713',   
  credentials: true,  // Allow credentials (cookies, authorization headers)
}));

 

// app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/', userRoute);
app.use('/admin',adminRoute)

app.listen(3000, () => {
  console.log(`Server running at http://localhost:3000`);
});
