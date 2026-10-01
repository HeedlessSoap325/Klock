import { useRouter } from "expo-router";
import AlarmDetailView from "../../components/AlarmDetailView";
import { Alarm } from "../../models/alarm";
import { useAlarms } from "../../context/AlarmContext";

export default function AddAlarmScreen() {
	const router = useRouter();
	const {addAlarm } = useAlarms();
	
	function onAddAlarm(alarm: Alarm) {
		addAlarm(alarm);
		router.dismiss();
	}

	return (
		<AlarmDetailView onSave={onAddAlarm} />
	);
}