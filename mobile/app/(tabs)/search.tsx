import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Feather } from '@expo/vector-icons'

const TRENDING_TOPICS=[
  {topic:"#ReactNative",tweets:"125K"},
  {topic:"#TypeScript",tweets:"75K"},
  {topic:"#AI",tweets:"50K"},
  {topic:"#TechNews",tweets:"25K"},
]
const Search = () => {
  return (
    <SafeAreaView className='flex-1 bg-white'>
      {/* Header */}
      <View className='px-4 py-3 border-b border-gray-100'>
        <View className='flex-row items-center bg-gray-100 rounded-2xl px-3 py-2'>
          <Feather name="search" size={20} color="#657786"/>
          <TextInput
          placeholder='Trending Topics'
          className='flex-1 ml-3 text-base'
          placeholderTextColor="#657786"
          />
        </View>
      </View>

      <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
        <View className='p-4'>
          <View className='flex-row gap-2'>
          <Feather name='trending-up' size={18} className=''/>
          <Text className='text-xl font-bold text-gray-900 mb-4'>Trending topics</Text>
          </View>
          {TRENDING_TOPICS.map((item,index)=>(
            <TouchableOpacity key={index} className='py-3 border-b border-gray-100'>
              <Text className='text-gray-500 text-sm'>Trending in Technology</Text>
              <Text className='font-bold text-gray-900 text-lg'>{item.topic}</Text>
              <Text className='text-gray-500 text-sm'>🔥{item.tweets}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      
    </SafeAreaView>
  )
}

export default Search