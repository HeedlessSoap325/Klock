import { FlatList, Pressable, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Alarm } from '../models/alarm';
import AlarmView from '../components/AlarmView';
import { AlarmGroup } from '../models/alarmGroup';
import AlarmGroupView from '../components/AlarmGroupView';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Entry, isAlarmGroup } from '../models/entry';
import { COLORS } from '../styles/colors';
import { Ionicons } from '@expo/vector-icons';
import { useAlarms } from '../context/AlarmContext';

export default function AlarmsScreen() {
	const insets = useSafeAreaInsets();

	const { entries } = useAlarms();

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

			<Pressable style={({pressed}) => [
				{
					...styles.addButton,
					bottom: insets.bottom + styles.addButton.bottom,
					opacity: pressed ? 0.8 : 1,
					transform: pressed ? "scale(0.95)" : "",
				}
			]}>
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