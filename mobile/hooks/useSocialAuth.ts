import { useState } from "react";
import { useSSO } from "@clerk/clerk-expo";
import { Alert } from "react-native";

export const useSocialAuth = () =>{
  const [isLoading, setIsLoading] = useState(false)
  const {startSSOFlow} =  useSSO()

  const handleSocialAuth = async(strategy:"oauth_google"|"oauth_apple")=>{
    setIsLoading(true)
    try {
      const {createdSessionId, setActive} = await startSSOFlow({strategy})
      if (createdSessionId && setActive){
        await setActive({session:createdSessionId})
      }
    } catch (err) {
      console.error("Error in Authentication.",err)
      const provider = strategy === "oauth_google" ? "Google":"Apple";
      Alert.alert("Error",`Failed to sign in with ${provider}. Please try again later.`)
    }finally{
      setIsLoading(false)
    }
  }
  return {isLoading, handleSocialAuth}
}