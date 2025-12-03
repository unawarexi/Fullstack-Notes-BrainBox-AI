import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="notes-screen" />
      
    </Stack>
  );
};

export default Layout;
