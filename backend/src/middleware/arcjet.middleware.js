import {aj} from "../config/arcjet.js"

export const arcjetMiddleware = async(req,res,next)=>{
  try {
    const decision = await aj.protect(req,{
      requrested:1. //each request consume 1 token
    })
    //handle denied requests
    if(decision.isDenied()){
      if(decision.reason.isRateLimit()){
        return res.status(429).json({
          error: "Too Many Request",
          message: "Rate limit exceeded. Please try again later."
        });
      }
        else if(decision.reason.isBot()){
          return res.status(403).json({
            error:"Bot access denied!",
            message:"Automated request are not allwoed."    
          })
        }else{
          return res.status(403).json({
            error:"Forbidden",
            message:"Access denied by security policy."
          })
        }
      }
        //check spoofed bots
        if(decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())){
          return res.status(403).json({
            error: "Spoofed bot detected.",
            message:"Malicious bot acitvity detected.",
          })
      }
      next()
    } catch (error) {
    console.log("Arcjet middleware error:",error)
    //allow request to continue if Arcjet fails
    next()
  }
}
