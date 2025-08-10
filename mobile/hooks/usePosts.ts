import { postApi, useApiClient } from "@/utils/api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const usePosts = (username?:string) =>{
  const api = useApiClient()
  const queryClient = useQueryClient()

  const{
    data:postsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey:username ? ["userPosts",username]:["posts"],
    queryFn: () => {
  console.log("🔍 Fetching for username:", username);
  return username
    ? postApi.getUserPosts(api, username)
    : postApi.getPosts(api);
},
    select:(response)=>response?.data?.posts ?? [],
   enabled: username ? !!username : true
  })

  const likePostMutation = useMutation({
    mutationFn:(postId:string) =>postApi.likePost(api,postId),
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:["posts"]});
      if (username){
        queryClient.invalidateQueries({queryKey:["userPosts",username]})
      }
    }
  })

  const deletePostMutation = useMutation({
    mutationFn:(postId:string) => postApi.deletePost(api,postId),
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:["posts"]});
      if(username){
        queryClient.invalidateQueries({queryKey:["userPosts",username]})
      }
    },
    onError:(error)=>{
      console.error("Failed to delete post:",error)
    }
  })

  const checkIsLiked = (postLikes: string[], currentUser:any) =>{
    const isLiked = currentUser && postLikes.includes(currentUser._id)
    return isLiked
  }

  return {
    posts: postsData || [],
    isLoading,
    error,
    refetch,
    toggleLike:(postId:string) =>likePostMutation.mutate(postId),
    deletePost:(postId:string) =>deletePostMutation.mutate(postId),
    checkIsLiked
  }
}