import { FlatList, Pressable, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Alarm } from '../models/alarm';
import AlarmView from '../components/AlarmView';
import { AlarmGroup } from '../models/alarmGroup';
import AlarmGroupView from '../components/AlarmGroupView';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Entry, isAlarmGroup } from '../models/entry';
import { COLORS } from '../styles/colors';

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

const entries: Entry[] = [alarm, alarmGroup, alarmGroup, alarmGroup];

export default function AlarmsScreen() {
	const insets = useSafeAreaInsets();

	return (
		<View style={[
			styles.container,
			{
				paddingBottom: insets.bottom,
			}
		]}>
			<StatusBar style="light" />

			<FlatList
				data={entries}
				keyExtractor={(entry) =>
					isAlarmGroup(entry) ? `group-${entry.id}` : `alarm-${entry.id}`
				}
				renderItem={({ item }) =>
					isAlarmGroup(item) ? (
						<AlarmGroupView group={item} />
					) : (
						<AlarmView alarm={item} />
					)
				}
				ItemSeparatorComponent={() => <View style={styles.separator} />}
				contentContainerStyle={styles.content}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: COLORS.background,
		height: "100%",
	},

	content: {
		paddingVertical: 16,
	},

	separator: {
		height: 12,
	},
});