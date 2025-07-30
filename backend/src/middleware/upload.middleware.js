// multer is a middleware for handling multipart/form-data which is primarily for the fiel uploads

import multer from "multer"

const storage = multer.memoryStorage()

const fileFilter= (req,file,cb)=>{
  if (file.mimeType.startsWith("image/")){
    cb(null,true) //Accept files
  }else{
    cb(new Error("Only image files are allowed!"),false) //Reject files
  }
}

const upload = multer({
  storage:storage,
  fileFilter: fileFilter,
  limits: {fileSize: 5*1024*1024}  
})

export default upload