import { Text, View, TouchableOpacity } from 'react-native'
import React from 'react'

const SocialButtons = () => {
  return (
    <View className="absolute left-0 right-0 bottom-20 px-6 pb-6">
      <View className="flex-1 h-[1px] bg-gray-300 my-10" />
      <Text className="text-gray-400 text-center text-sm mb-6">Continue With Accounts</Text>
      <View className="flex-row justify-between gap-4">
        <TouchableOpacity className="flex-1 bg-[#F5C5C5] rounded-2xl py-4 mr-2 items-center justify-center">
          <Text className="text-[#E85D5D] text-center font-semibold tracking-widest">GOOGLE</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-1 bg-[#C5D7E8] rounded-2xl py-4 ml-2 items-center justify-center">
          <Text className="text-[#5D8FBD] text-center font-semibold tracking-widest">FACEBOOK</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default SocialButtons
