import { FlatList, Pressable, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AlarmView from '../components/AlarmView';
import AlarmGroupView from '../components/AlarmGroupView';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { isAlarmGroup } from '../models/entry';
import { COLORS } from '../styles/colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAlarms } from '../context/AlarmContext';

export default function AlarmsScreen() {
	const insets = useSafeAreaInsets();
	const router = useRouter();

	const { entries, updateAlarm } = useAlarms();

	function onEditAlarm(alarm_id: number) {
		router.push(`/editAlarm?alarm_id=${encodeURIComponent(alarm_id)}`)
	}

	function onToggleAlarm(alarm_id: number, value: boolean) {
		updateAlarm(alarm_id, {active: value})
	}

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
						<AlarmGroupView group={item} onClickAlarm={onEditAlarm} onToggleAlarm={onToggleAlarm} />
					) : (
						<AlarmView alarm={item} onClick={onEditAlarm} onToggle={onToggleAlarm} />
					)
				}
				ItemSeparatorComponent={() => <View style={styles.separator} />}
				contentContainerStyle={styles.content}
			/>

			<Pressable style={({pressed}) => [
				{
					...styles.addButton,
					bottom: insets.bottom + styles.addButton.bottom,
					opacity: pressed ? 0.8 : 1,
					transform: pressed ? "scale(0.95)" : "",
				}
			]} onPress={() => router.push("/addAlarm")}>
				<Ionicons name="add" size={42} />
			</Pressable>
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

	addButton: {
		position: "absolute",
		bottom: 30,
		right: 30,
		padding: 10,
		backgroundColor: COLORS.accent,
		borderRadius: 16,
	},
});