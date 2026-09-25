import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';


import AlarmModule from './modules/alarm-module/src/AlarmModule';
import type { } from './modules/alarm-module/src/AlarmModule.types';

export default function App() {
  AlarmModule.scheduleAlarm(1, new Date(2026, 9, 25, 23, 40).getMilliseconds(), "Test 123");

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
