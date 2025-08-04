import { commentApi, useApiClient } from "@/utils/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { Alert } from "react-native"

export const useComments =()=>{
  const [commentText,setCommentText] = useState("")
  const api = useApiClient()

  const queryClient = useQueryClient()

  const createCommentMutation = useMutation({
    mutationFn: async({postId,content}:{postId:string;content:string})=>{ 
      const response = await commentApi.createComment(api, postId, content)
      return response.data
    },
    onSuccess:()=>{
      setCommentText("")
      queryClient.invalidateQueries({queryKey:["posts"]})
    },
    onError:(error)=>{
      console.log("Error while commenting:",error.message)
      Alert.alert("Error","Failed to post comment.")
    },
  })

  const createComment = (postId:string) =>{
    if(!commentText.trim()){
      Alert.alert("Empty Comment","Please write something before posting.")
    }

    createCommentMutation.mutate({postId,content:commentText.trim()})
  }

  return {
    commentText,
    setCommentText,
    createComment,
    isCreatingComment: createCommentMutation.isPending,
  }
}