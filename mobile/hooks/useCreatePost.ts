import { useApiClient } from "@/utils/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import * as ImagePicker from "expo-image-picker"
import { useState } from "react"
import { Alert } from "react-native"


export const useCreatePost = () =>{

  const [content, setContent]= useState("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const api = useApiClient()
  const queryCLient = useQueryClient()

  const createPostMutation = useMutation({
   mutationFn: async (postData: { content: string; imageUri?: string }) => {
  try {
    const formData = new FormData();
    if (postData.content) formData.append("content", postData.content);

    console.log("Selected Image URI:", postData.imageUri);


    if (postData.imageUri) {
      const uriParts = postData.imageUri.split(".");
      const fileType = uriParts[uriParts.length - 1].toLowerCase();
      const mimeTypeMap: Record<string, string> = {
        png: "image/png",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        gif: "image/gif",
        webp: "image/webp",
      };
      const mimeType = mimeTypeMap[fileType] || "image/jpeg";

      formData.append("image", {
        uri: postData.imageUri,
        name: `image.${fileType}`,
        type: mimeType,
      } as any);
    }

    console.log("🚀 Submitting post to /posts");
    const res = await api.post("/posts", formData,{
      headers:{
        Accept: "application/json",
        "Content-Type":"multipart/form-data",
      }
    });
    console.log("✅ Post response:", res.data);
    return res;
  } catch (err: any) {
    console.error("❌ Error submitting post:", err?.message || err);
    if (err?.response) {
      console.error("🔎 Server responded with:", err.response.status, err.response.data);
    }
    throw err;
  }
},
      onSuccess:()=>{
        setContent("")
        setSelectedImage(null)
        queryCLient.invalidateQueries({queryKey:["posts"]})
        Alert.alert("Success","Post created succesfully!");
      },
      onError:(error)=>{
        console.log("Post error:",error.message)
        Alert.alert("Error","Failed to create post. Please try again.")
      }
  })

  const handleImagePicker = async(useCamera: boolean = false) =>{
    const permissionResult = useCamera ? await ImagePicker.requestCameraPermissionsAsync() : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if(permissionResult.status !== "granted"){
      const source = useCamera ? "camera": "photo library"
      Alert.alert("Permission needed",`Please grant permission to access your ${source}.`)
      return;
    }

    const pickerOptions = {
      allowsEditing: true,
      aspect: [16,9] as [number,number],
      quality: 0.8,
    }

    const result = useCamera ? await ImagePicker.launchCameraAsync(pickerOptions): await ImagePicker.launchImageLibraryAsync({
      ...pickerOptions, 
      mediaTypes:["images"]
    })
    if(!result.canceled) setSelectedImage(result.assets[0].uri)
  }

  const createPost = ()=>{
    if(!content.trim() && !selectedImage){
      Alert.alert("Empty Post","Please write something or add an image before posting.")
      return
    }

    const postData: {content:string, imageUri?:string}={
      content: content.trim(),
    }
    if(selectedImage) postData.imageUri= selectedImage
    createPostMutation.mutate(postData)

  }

  return {
    content,
    setContent,
    selectedImage, 
    isCreating: createPostMutation.isPending,
    pickImageFromGallery: ()=> handleImagePicker(false), takePhoto: ()=> handleImagePicker(true),
    removeImage:()=> setSelectedImage(null),
    createPost
  }
}