import express from "express";
import { addUser, allUsers, deleteUser, getUser, loginUser, logout, updateUser, UserProfile } from "../controllers/AuthControllers.js";

import { userCheck } from "../middlewares/Authmiddle.js";
import { adminMiddlware, userMiddlware } from "../middlewares/Adminmiddle.js";

const authroute = express.Router()



authroute.post('/user',addUser)
authroute.post('/login',loginUser)
authroute.get('/logout',logout)
authroute.get('/getuser',userCheck,allUsers)
authroute.get('/user/:id',userCheck,getUser)
authroute.put('/user/:id',updateUser)
authroute.delete('/user/:id',deleteUser)   
authroute.get('/user-profile',userCheck,UserProfile)  

// authroute.getuSER('/user',addUser)


export default authroute