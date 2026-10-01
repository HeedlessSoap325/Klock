import { router, useLocalSearchParams } from "expo-router";
import { useAlarms } from "../context/AlarmContext";
import { isAlarmGroup } from "../models/entry";
import { useMemo } from "react"
import { Text, View } from "react-native";
import { AlarmGroup } from "../models/alarmGroup";
import AlarmGroupDetail from "../components/AlarmGroupDetailView";

export default function EditAlarmScreen() {
	const { alarm_group_id } = useLocalSearchParams<{ alarm_group_id: string }>();
	const { entries, updateAlarmGroup, removeAlarmGroup } = useAlarms();

	const alarmGroup = useMemo(() =>
		entries.filter(isAlarmGroup)
			.find((g) => g.id === parseInt(alarm_group_id, 10)),
		[entries, alarm_group_id]
	);

	if (!alarmGroup) return(
		<View>
			<Text>Alarm group {alarm_group_id} was not found!</Text>
		</View>
	);

	function onUpdate(update: AlarmGroup) {
		updateAlarmGroup(parseInt(alarm_group_id, 10), update);
		router.back();
	}

	function onCancle() {
		router.back();
	}

	function onDelete(id: number) {
		removeAlarmGroup(id);
		router.back();
	}

	return <AlarmGroupDetail group={alarmGroup} onSave={onUpdate} onCancel={onCancle} onDelete={onDelete} />
}