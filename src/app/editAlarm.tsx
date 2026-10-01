import { router, useLocalSearchParams } from "expo-router";
import AlarmDetailView from "../components/AlarmDetailView";
import { useAlarms } from "../context/AlarmContext";
import { Entry, isAlarmGroup } from "../models/entry";
import { useMemo } from "react"
import { Alarm } from "../models/alarm";
import { Text, View } from "react-native";

function findAlarm(entries: Entry[], id: number): Alarm | undefined {
	for (const entry of entries) {
		if (isAlarmGroup(entry)) {
			const found = entry.alarms.find((a) => a.id === id);
			if (found) return found;
		} else if (entry.id === id) {
			return entry;
		}
	}
	
	return undefined;
}

export default function EditAlarmScreen() {
	const { alarm_id } = useLocalSearchParams<{ alarm_id: string }>();
	const { entries, updateAlarm, removeAlarm } = useAlarms();

	const alarm = useMemo(() => 
		findAlarm(entries, parseInt(alarm_id, 10)),
		[entries, alarm_id]
	);

	if (!alarm) return(
		<View>
			<Text>Alarm {alarm_id} was not found!</Text>
		</View>
	);

	function onUpdate(update: Alarm) {
		updateAlarm(parseInt(alarm_id, 10), update);
		router.back();
	}

	function onCancle() {
		router.back();
	}

	function onDelete(id: number) {
		removeAlarm(id);
		router.back();
	}

	return <AlarmDetailView alarm={alarm} onSave={onUpdate} onDelete={onDelete} onCancel={onCancle} />;
}