import { Pressable, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Alarm } from '../models/alarm';
import AlarmView from '../components/AlarmView';
import { AlarmGroup } from '../models/alarmGroup';
import AlarmGroupView from '../components/AlarmGroupView';

const alarm: Alarm = {
	id: 1,
	name: "SCHOOL",
	hour: 6,
	minute: 30,
	active: true,
	weekdays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
	scheduling: [],
	pauses: undefined,
	vibrate: true,
	ringtone: "default",
}

const alarmGroup: AlarmGroup = {
	id: 2, 
	name: "WORK",
	alarms: [
		{...alarm, id: 2},
		{...alarm, id: 3, active: false}
	]
}

export default function AlarmsScreen() {
	return (
		<View style={styles.container}>
			<StatusBar style="light" />

			<AlarmView alarm={alarm} />
			<AlarmGroupView group={alarmGroup}/>
		</View>
	);
}

const styles = StyleSheet.create({
  container: {
	flex: 1,
	backgroundColor: '#141a2d',
	alignItems: "center",
	gap: 15,
  },
});
