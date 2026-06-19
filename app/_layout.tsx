// src/app/_layout.tsx
import { Stack } from 'expo-router';
import { View, Text } from 'react-native';

export default function Layout() {
  return (
    <View style={{ flex: 1, backgroundColor: '#0D0D0D' }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0D0D0D' },
        }}
      />
    </View>
  );
}
