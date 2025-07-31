export const protectRoute = async(req,res,next)=>{
  if(!req.auth().isAuthenticated){
    //clerk middleware will set req.auth() if the user is authenticated from server.js file
    return res.status(401).json({message:"Unauthorized - you must be logged in to access this route."})
  }
  next()
}