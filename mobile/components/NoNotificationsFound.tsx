import { View, Text } from 'react-native'
import React from 'react'
import { Feather } from '@expo/vector-icons'

const NoNotificationsFound = () => {
  return (
    <View className='flex-1 items-center justify-centerpx-8' style={{minHeight: 400}}>
      <View className='items-center'>
        <Feather name='bell' size={80} color="#E1E8ED"/>
        <Text className='text-2xl font-semibold text-gray-500 mt-6 mb-3'>No notifications yet.</Text>
      </View>
    </View>
  )
}

export default NoNotificationsFound