import { View, StyleSheet, Text } from "react-native";
import { useAlarms } from "../context/AlarmContext";
import { Alarm } from "../models/alarm";
import { useEffect, useMemo, useState } from "react";
import { isAlarmGroup } from "../models/entry";
import { formatDuration, msUntilNextRing, pad } from "../utils/utils";
import { COLORS } from "../styles/colors";

export default function NextAlarmView() {
	const { entries } = useAlarms();
	const [now, setNow] = useState(() => Date.now());
	
	const nextAlarm = useMemo<Alarm | null>(() => {
		const all: Alarm[] = entries.flatMap((e) =>
			isAlarmGroup(e) ? e.alarms : [e]
		);
	
		let closest: Alarm | null = null;
		let closestDelay = Infinity;
		
		for (const a of all) {
			const delay = msUntilNextRing(a.hour, a.minute, a.weekdays) ?? Infinity;
			if (delay < closestDelay) {
				closestDelay = delay;
				closest = a;
			}
		}
	
	  	return closest;
	}, [entries, now]);
	
	const nextAlarmDelay = useMemo<number>(() => {
		if (!nextAlarm) return -1;
		return (
			msUntilNextRing(nextAlarm.hour, nextAlarm.minute, nextAlarm.weekdays) ?? -1
		);
	}, [nextAlarm, now]);

	useEffect(() => {
		const id = setInterval(() => setNow(Date.now()), 1000);
		
		return () => clearInterval(id);
	}, []);

	if (!nextAlarm) {
		return (
			<View style={[
				styles.container,
				{
					padding: 30
				}
				]}>
					<Text style={[
						styles.ringsInLable,
						{
							color: COLORS.textMuted
						},
					]}>No Alarms scheduled</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Text style={styles.nextAlarmLable}>Next Alarm</Text>
			<Text style={styles.ringsInLable}>Rings in {formatDuration(nextAlarmDelay)}</Text>
			<Text style={styles.alarmLable}>{pad(nextAlarm?.hour ?? 0)}:{pad(nextAlarm?.minute ?? 0)} ({nextAlarm?.name})</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "90%",
		alignSelf: "center",
		backgroundColor: COLORS.cardAccent,
		borderRadius: 22,
		padding: 10,
		paddingInline: 20,
	},

	nextAlarmLable: {
		color: COLORS.textMuted,
		marginBottom: 5,
	},

	ringsInLable: {
		fontSize: 30,
		color: COLORS.text,
		fontWeight: "600",
		marginBottom: 5,
	},

	alarmLable: {
		color: COLORS.textMuted,
	},
});