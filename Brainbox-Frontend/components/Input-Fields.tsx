import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { Eye, EyeOff } from "lucide-react-native";

type InputFieldProps = {
  icon?: React.ComponentType<{ size?: number; color?: string }>;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void; // added to support react-hook-form Controller
  secureTextEntry?: boolean;
  keyboardType?: any;
  autoCapitalize?: "none" | "words" | "sentences" | "characters";
  containerClassName?: string;
  inputClassName?: string;
  showToggle?: boolean; // show eye toggle for password
};

const InputField: React.FC<InputFieldProps> = ({
  icon: Icon,
  placeholder,
  value,
  onChangeText,
  onBlur,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "none",
  containerClassName = "flex-row items-center rounded-2xl px-4 py-4 bg-slate-100 border-transparent",
  inputClassName = "flex-1 ml-3 text-base text-gray-900",
  showToggle = false,
}) => {
  const [showPassword, setShowPassword] = useState(!secureTextEntry);

  return (
    <View className={containerClassName}>
      {Icon ? <Icon size={22} color="#666" /> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur} // forwarded
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        className={inputClassName}
        secureTextEntry={secureTextEntry && !showPassword}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
      {showToggle && secureTextEntry && (
        <TouchableOpacity onPress={() => setShowPassword((s) => !s)}>
          {showPassword ? <Eye size={20} color="#999" /> : <EyeOff size={20} color="#999" />}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default InputField;
