import axios, {Axios, AxiosInstance} from "axios"
import {useAuth, useClerk} from "@clerk/clerk-expo"

const API_BASE_URL = "https://twitter-rn-backend.vercel.app/api" 
//  const API_BASE_URL = "http://192.168.1.19:5001/api"

export const createApiClient = (getToken:() => Promise<string|null>):AxiosInstance =>{
  const api = axios.create({baseURL:API_BASE_URL})
  api.interceptors.request.use(async(config)=>{
    const token = await getToken()
    // console.log("Bearer Token: ",token)
    if(token){
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })
  return api
}

export const useApiClient = ():AxiosInstance=>{
  const {getToken} = useAuth()
  return createApiClient(getToken)
}

export const userApi = {
  syncUser:(api:AxiosInstance) =>api.post("/users/sync"),
  getcurrentUser:(api:AxiosInstance) =>api.post("/users/me"),
  updateProfile:(api:AxiosInstance, data:any) =>api.post("/users/profile",data),
}