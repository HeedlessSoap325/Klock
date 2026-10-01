import { useRouter } from "expo-router";
import { useAlarms } from "../../context/AlarmContext";
import AlarmGroupDetail from "../../components/AlarmGroupDetailView";
import { AlarmGroup } from "../../models/alarmGroup";

export default function AddAlarmGroupScreen() {
	const router = useRouter();
	const { addAlarmGroup } = useAlarms();

	function onSave(group: AlarmGroup) {
		addAlarmGroup(group);
		router.dismiss();
	};

	return (
		<AlarmGroupDetail onSave={onSave} />
	);
}