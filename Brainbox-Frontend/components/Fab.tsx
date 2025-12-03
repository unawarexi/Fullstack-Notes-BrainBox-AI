import React from "react";
import { View, TouchableOpacity, Platform, StyleSheet } from "react-native";
import { Plus } from "lucide-react-native";

type Props = {
  onPress?: () => void;
  rightOffset?: number; // optional customization
};

const Fab: React.FC<Props> = ({ onPress, rightOffset = 24 }) => {
  const isIOS = Platform.OS === "ios";

  return (
    <View style={[styles.container, { bottom: isIOS ? 128 : 96, right: rightOffset }]}>
      <TouchableOpacity
        onPress={onPress}
        style={styles.fab}
        activeOpacity={0.8}
      >
        <Plus size={20} color="#fff" strokeWidth={2.5} />
      </TouchableOpacity>
    </View>
  );
};

export default Fab;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
  },
  fab: {
    width: 56,
    height: 56,
    backgroundColor: "#111827",
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});