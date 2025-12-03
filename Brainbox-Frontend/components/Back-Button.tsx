import React from "react";
import { TouchableOpacity } from "react-native";
import { ChevronLeft } from "lucide-react-native";

type BackButtonProps = {
  onPress?: () => void;
  size?: number;
  color?: string;
  className?: string;
  accessibilityLabel?: string;
};

const BackButton: React.FC<BackButtonProps> = ({
  onPress,
  size = 28,
  color = "#000",
  className = "w-10 h-10 items-center justify-center",
  accessibilityLabel = "Back",
}) => {
  return (
    <TouchableOpacity onPress={onPress} className={className} activeOpacity={0.7} accessibilityLabel={accessibilityLabel}>
      <ChevronLeft size={size} color={color} />
    </TouchableOpacity>
  );
};

export default BackButton;
