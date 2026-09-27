import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';


import AlarmModule from './modules/alarm-module/src/AlarmModule';
import type { Alarm, AlarmNotification } from './modules/alarm-module/src/AlarmModule.types';

export default function App() {
  const alarm: Alarm = {
    id: 1,
    triggerAt: Date.now() + 2 * 60 * 1000, // now + 2 Minutes
    label: "Test 123",
    group: "idk",
  };

  const notification: AlarmNotification = {
    id: 2,
    delay: 1 * 60 * 1000, // 1 Minute
    alarm: alarm,
  }

  console.log("fiering in: ", alarm.triggerAt - notification.delay - Date.now(), "miliseconds");
  AlarmModule.scheduleAlarm(alarm);
  AlarmModule.scheduleAlarmNotification(notification);

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
