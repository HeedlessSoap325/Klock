import { useRouter } from "expo-router";
import AlarmDetailView from "../../components/AlarmDetailView";
import { Alarm } from "../../models/alarm";
import { useAlarms } from "../../context/AlarmContext";
import { isAlarmGroup } from "../../models/entry";

export default function AddAlarmScreen() {
	const router = useRouter();
	const { entries, addAlarm, updateAlarmGroup } = useAlarms();
	
	function onAddAlarm(alarm: Alarm, group_id: number | null) {
		if (group_id) {
			const group = entries.filter(isAlarmGroup).find((g) => g.id === group_id);
			if (!group) {
				addAlarm(alarm);
			} else {
				updateAlarmGroup(group_id, {alarms: [...group.alarms, alarm]})
			}
		} else {
			addAlarm(alarm);
		}
		
		router.dismiss();
	}

	return (
		<AlarmDetailView groupId={null} onSave={onAddAlarm} />
	);
}