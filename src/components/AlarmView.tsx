import { View, Text, Switch, Pressable, StyleSheet } from "react-native";
import { Alarm } from "../models/alarm";
import { COLORS } from "../styles/colors";

export default function AlarmView({ alarm, embedded = false }: { alarm: Alarm, embedded?: boolean }) {
		const time = `${String(alarm.hour).padStart(2, "0")}:${String(alarm.minute).padStart(2, "0")}`;

		return (
			<View style={[
				styles.container,
				embedded && styles.embedded,
				!alarm.active && styles.containerOff,
			]}>
				<View style={styles.left}>
					<Text style={[styles.name, !alarm.active && styles.textOff]}>{alarm.name ? `${alarm.name}` : ""}</Text>
					<Text style={[styles.time, !alarm.active && styles.textOff]}>{time}</Text>

					<Text style={styles.subtitle} numberOfLines={1}>
						Mon to Fri, rings in{" "}
						<Text style={[styles.countdown, !alarm.active && styles.textOff]}>
							7h 32m
						</Text>
					</Text>
				</View>

				<View style={styles.right}>
					<Switch
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
			</View>
		);
}

const styles = StyleSheet.create({
	container: {
		width: "90%",
		alignSelf: "center",
		flexDirection: "row",
		alignItems: "stretch",
		justifyContent: "space-between",
		backgroundColor: COLORS.card,
		paddingVertical: 14,
		paddingHorizontal: 18,
		borderRadius: 22,
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