import React from "react";
import { View, TextInput, Platform, TouchableOpacity } from "react-native";
import { Search } from "lucide-react-native";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

const SearchInput: React.FC<Props> = ({ value, onChangeText, placeholder = "Search notes..." }) => {
  const isIOS = Platform.OS === "ios";

  return (
    <View className={`flex-row items-center rounded-2xl px-4 ${isIOS ? "py-4" : "py-1"} mb-6 border-[1px] border-slate-300 focus:bg-white focus:border-gray-300 focus:border-2 focus:shadow-md `}>
      <Search size={20} color="#999" />
      <TextInput
        className="flex-1 ml-3 text-base text-gray-900"
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#999"
      />
    </View>
  );
};

export default SearchInput;
