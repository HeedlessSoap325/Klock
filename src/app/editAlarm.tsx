import { router, useLocalSearchParams } from "expo-router";
import AlarmDetailView from "../components/AlarmDetailView";
import { useAlarms } from "../context/AlarmContext";
import { Entry, isAlarmGroup } from "../models/entry";
import { useMemo } from "react"
import { Alarm } from "../models/alarm";
import { Text, View } from "react-native";
import { AlarmGroup } from "../models/alarmGroup";

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

function findGroup(entries: Entry[], alarm: Alarm | undefined) : AlarmGroup | undefined {
	if (!alarm) return undefined;

	for (const group of entries.filter(isAlarmGroup)) {
		for (const alm of group.alarms) {
			if (alm.id === alarm.id) return group
		}
	}

	return undefined
}

export default function EditAlarmScreen() {
	const { alarm_id } = useLocalSearchParams<{ alarm_id: string }>();
	const { entries, updateAlarm, removeAlarm, updateAlarmGroup, addAlarm } = useAlarms();

	const alarm = useMemo(() => 
		findAlarm(entries, parseInt(alarm_id, 10)),
		[entries, alarm_id]
	);

	const group = useMemo(() => 
		findGroup(entries, alarm),
		[entries, alarm_id]
	);

	if (!alarm) return(
		<View>
			<Text>Alarm {alarm_id} was not found!</Text>
		</View>
	);

	function onUpdate(update: Alarm, group_id: number | null) {
		const id = update.id;
	  
		if (group_id !== null) {
			if (group && group.id === group_id) {
				// stays in the same group
				updateAlarm(id, update);
			} else {
				// moves into a different group (from another group or from standalone)
				const newGroup = entries.filter(isAlarmGroup).find((g) => g.id === group_id);
				if (!newGroup) return; // check BEFORE removing, otherwise the alarm is lost
		
				removeAlarm(id);
				updateAlarmGroup(group_id, { alarms: [...newGroup.alarms, update] });
			}
		} else {
			if (group) {
				// removed from its group, becomes standalone
				removeAlarm(id);
				addAlarm(update);
			} else {
				// standalone stays standalone
				updateAlarm(id, update);
			}
		}
	  
		router.back();
	}

	function onCancle() {
		router.back();
	}

	function onDelete(id: number) {
		removeAlarm(id);
		router.back();
	}

	return <AlarmDetailView groupId={group?.id ?? null} alarm={alarm} onSave={onUpdate} onDelete={onDelete} onCancel={onCancle} />;
}