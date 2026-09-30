import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';

import AlarmModule from '../../modules/alarm-module/src/AlarmModule';
import type { AlarmModuleAlarm, AlarmModuleNotification } from '../../modules/alarm-module/src/AlarmModule.types';

export default function App() {
  async function scheduleAlarmIn2Minutes() {
	const alarm: AlarmModuleAlarm = {
	  id: Date.now() % 2147483647,
	  triggerAt: Date.now() + 2 * 60 * 1000, // now + 2 Minutes
	  label: "Test 123",
	  group: "idk",
	};
  
	const notification: AlarmModuleNotification = {
	  id: alarm.id + 1,
	  delay: 1 * 60 * 1000, // 1 Minute
	  alarm: alarm,
	}
  
	await AlarmModule.scheduleAlarm(alarm);
	await AlarmModule.scheduleAlarmNotification(notification);
  }
  
  return (
	<View style={styles.container}>
	  <Button title='Schedule Alarm in 2 Minutes!' onPress={scheduleAlarmIn2Minutes} />
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
