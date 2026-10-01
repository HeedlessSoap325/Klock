import { View, Text, Switch, Pressable, StyleSheet, TouchableOpacity } from "react-native";
import { Alarm } from "../models/alarm";
import { COLORS } from "../styles/colors";
import { formatDuration, msUntilNextRing, summarizeDays } from "../utils/utils";

export default function AlarmView({ alarm, embedded = false, onClick, onToggle }: { alarm: Alarm, embedded?: boolean, onClick: (alarm_id: number) => void, onToggle: (alarm_id: number, value: boolean) => void }) {
		const time = `${String(alarm.hour).padStart(2, "0")}:${String(alarm.minute).padStart(2, "0")}`;
		const nextRing = alarm.active ? msUntilNextRing(alarm.hour, alarm.minute, alarm.weekdays) : null;

		return (
			
			<View style={[
				styles.container,
				embedded && styles.embedded,
				!alarm.active && styles.containerOff,
			]}>
				<TouchableOpacity style={styles.touch} onPress={() => onClick(alarm.id)}>
					<View style={styles.left}>
						<Text style={[styles.name, !alarm.active && styles.textOff]}>{alarm.name ? `${alarm.name}` : ""}</Text>
						<Text style={[styles.time, !alarm.active && styles.textOff]}>{time}</Text>

						<Text style={styles.subtitle} numberOfLines={1}>
							{summarizeDays(alarm.weekdays)}{ nextRing && ", rings in"} {" "}
							
							{nextRing && (
								<Text style={[styles.countdown, !alarm.active && styles.textOff]}>
									{formatDuration(nextRing)}
								</Text>
							)}
						</Text>
					</View>

					<View style={styles.right}>
						<Switch
							onValueChange={(v) => onToggle(alarm.id, v)}
							value={alarm.active}
							trackColor={{ false: COLORS.trackOff, true: COLORS.accent }}
							thumbColor={alarm.active ? COLORS.thumbOn : COLORS.textOff}
							ios_backgroundColor={COLORS.trackOff}
						/>

						<Pressable
							hitSlop={8}
							style={({ pressed }) => ( pressed && alarm.active) && styles.pressed}
						>
							<Text style={alarm.active ? styles.skip : styles.skipOff}>Skip next</Text>
						</Pressable>
					</View>
				</TouchableOpacity>
			</View>
		);
}

const styles = StyleSheet.create({
	container: {
		width: "90%",
		alignSelf: "center",
		backgroundColor: COLORS.card,
		borderRadius: 22,
	},

	touch: {
		width: "100%",
		flexDirection: "row",
		alignItems: "stretch",
		justifyContent: "space-between",
		paddingVertical: 14,
		paddingHorizontal: 18,
	},

	embedded: {
		width: "100%",
		backgroundColor: "transparent",
		paddingHorizontal: 0,
		borderRadius: 0,
	},

	containerOff: {
		opacity: 0.85,
	},

	left: {
		flex: 1,
		justifyContent: "center",
		marginRight: 12,
	},

	right: {
		alignItems: "flex-end",
		justifyContent: "space-between",
	},

	name: {
		fontSize: 20,
		marginBottom: 10,
		fontWeight: "600",
		color: COLORS.text,
		fontVariant: ["tabular-nums"],
	},

	time: {
		fontSize: 28,
		fontWeight: "600",
		color: COLORS.text,
		fontVariant: ["tabular-nums"],
	},

	subtitle: {
		marginTop: 4,
		fontSize: 11,
		color: COLORS.textMuted,
	},

	countdown: {
		color: COLORS.highlight,
	},

	textOff: {
		color: COLORS.textOff,
	},

	skip: {
		fontSize: 14,
		fontWeight: "600",
		color: COLORS.accent,
	},

	skipOff: {
		fontSize: 14,
		fontWeight: "600",
		color: COLORS.textOff,
	},

	pressed: {
		opacity: 0.6,
	},
});