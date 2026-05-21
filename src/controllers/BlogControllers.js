import { deleteImg, uploadImg } from "../config/cloudinary.js";
import Blog from "../models/BlogSchema.js";


const CreateBlog =async (req,res) => {
    try {
        console.log('req.user---->',req.user)
 console.log(req.body);
 const {title,content} = req.body

if(req.file){
const check = await uploadImg(req.file)
 const data1 = { title, content, image:check.image,author:req.user._id,public_id:check.public_id };
    const blog= new Blog(data1);
    const data = await blog.save();
    return res.status(201).json({status:true,message:'blog created',data})
}else{
    return res.status(400).json({status:false,message:'image is required'})
}


        
    } catch (error) {
        return res.status(400).json({status:false,message:error.message})
    }
 
 
 
}


const DeleteBlog=async (req, res)=>{
  const {id} = req.params
  try{
const findd = await Blog.findById(id)
if(findd == null){
    return res.status(404).json({status:false,message:'blog not found'})
}
 const dltImg =  await deleteImg(findd.public_id)
 console.log('dlt--->',dltImg);
    const blog = await Blog.findByIdAndDelete(id)
    console.log('result in deleting data-->' , blog);
    
    if(blog == null){
        return res.status(404).json({status:false,message:'blog not found'})
    }
 return res.status(200).json({status:false,message:'SUCCESSFULLY DELETEED'})

  }catch(error){
    return res.status(400).json({status:false,message:error.message})
  }
}

export  {CreateBlog,DeleteBlog}