import mongoose, { Document, Schema } from "mongoose";

interface UsersType extends Document{
    email:string,
    password:string,
    isAdmin:boolean,
    isBlock:boolean,
    image:string
}
const UserSchema:Schema<UsersType>=new Schema({
    email:{
        type:String
    },
    password:{
        type:String
    },
    isAdmin:{
        type:Boolean
    },
    isBlock:{
        type:Boolean
    },
    image:{
        type:String
    }
})

const User=mongoose.model<UsersType>('users',UserSchema)
export default User