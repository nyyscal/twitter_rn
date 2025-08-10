import { View, Text, ActivityIndicator, ScrollView, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import SignOutButton from '@/components/SignOutButton'
import { Feather } from '@expo/vector-icons'
import { format } from 'date-fns'
import { usePosts } from '@/hooks/usePosts'
import PostsList from '@/components/PostsList'
import { useProfile } from '@/hooks/useProfile'
import EditProfileModal from '@/components/EditProfileModal'


const ProfileScreen = () => {
  const {currentUser, isLoading} = useCurrentUser()

  const insets = useSafeAreaInsets()

  const {posts:userPosts,refetch:refetchPosts,isLoading:isRefetching} = usePosts(currentUser?.username)

  const {
    isEditModalVisible,
    openEditModal,
    closeEditModal,
    formData,
    saveProfile,
    updateFormField,
    isUpdating,
    refetch: refetchProfile,
  } = useProfile();

  if(isLoading || !currentUser?.username){
    return(
      <View className='flex-1 bg-white items-center justify-center'>
        <ActivityIndicator size="large" color="#1DA1F2"/>
      </View>
    )
  }
  return (
    <SafeAreaView className='flex-1 bg-white' edges={["top"]}>
      {/* Header */}
      <View className='flex-row items-center justify-between px-4 py-3 border-b border-gray-100'>
        <View>
          <Text className='text-xl font-bold text-gray-900'>
            {currentUser.firstName} {currentUser.lastName}
          </Text>
          <Text className='text-gray-500 text-sm'>{userPosts.length} Posts</Text>
        </View>
        <SignOutButton/>
      </View>

      <ScrollView className='flex-1' contentContainerStyle={{paddingBottom:100+insets.bottom}} showsVerticalScrollIndicator={false}>
     
          <Image source={{uri: currentUser.bannerImage ||"data:image/png;base64,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" }}
          className='w-full h-48' resizeMode='cover'/>

        <View className='px-4 pb-4 border-b border-gray-100'>
        <View className='flex-row justify-between items-end -mt-16 mb-4'>
          <Image source={{uri:currentUser.profilePicture}} className='size-32 rounded-full border-4 border-white'/>
        <TouchableOpacity className='border border-gray-300 px-6 py-2 rounded-full' onPress={openEditModal}>
          <Text className='font-semibold text-gray-900'>Edit Profile</Text>
        </TouchableOpacity>
        </View>
        <View className='mb-4'>
          <View className='flex-row items-center mb-1'>
            <Text className='text-xl font-bold text-gray-900 mr-1'>
              {currentUser.firstName} {currentUser.lastName}
            </Text>
            <Feather name='check-circle' size={20} color="#1DA1F2" />
          </View>
          <Text className='text-gray-500 mb-2'>@{currentUser.username}</Text>
          <Text className='text-gray-900 mb-3'>{currentUser.bio}</Text>
          <View className='flex-row items-center mb-2'>
            <Feather name="map-pin" size={16} color="#657786"/>
            <Text className='text-gray-500 ml-2'>{currentUser.location}</Text>
          </View>
          <View className='flex-row items-center mb-3'>
            <Feather name='calendar' size={16} color="#657786"/>
            <Text className='text-gray-500 ml-2'>Joined {format(new Date(currentUser.createdAt), "MMM yyy")}</Text>
          </View>

          <View className='flex-row'>
            <TouchableOpacity className='mr-6'>
              <Text className='text-gray-900'>
                <Text className='font-bold'>{currentUser.following?.length}</Text>
                <Text className='text-gray-500'>Following</Text>
              </Text>
            </TouchableOpacity>
            <TouchableOpacity >
              <Text className='text-gray-900'>
              <Text className='font-bold'>{currentUser.followers?.length}</Text>
              <Text className='text-gray-500'>Followers</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        </View>
        <PostsList username={currentUser?.username}/>
      </ScrollView>
      <EditProfileModal isVisible={isEditModalVisible} onClose={closeEditModal}
      formData={formData}
      saveProfile={saveProfile}
      updateFormField={updateFormField}
      isUpdating={isUpdating}/>
    </SafeAreaView>
  )
}

export default ProfileScreen