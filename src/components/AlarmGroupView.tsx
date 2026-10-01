import { useState } from "react";
import { View, Text, Switch, Pressable, StyleSheet } from "react-native";
import { AlarmGroup } from "../models/alarmGroup";
import AlarmView from "./AlarmView";
import { COLORS } from "../styles/colors";

interface Props {
	group: AlarmGroup;
	/** Called when the user flips the group switch. Parent should update every alarm in the group. */
	onToggleGroup?: (active: boolean) => void;
	onClickAlarm: (alarm_id: number) => void;
	onToggleAlarm: (alarm_id: number, value: boolean) => void;
}

export default function AlarmGroupView({ group, onToggleGroup, onClickAlarm, onToggleAlarm }: Props) {
	// A group is active if at least one of its alarms is active.
	const isActive = group.alarms.some((alarm) => alarm.active);
	const [expanded, setExpanded] = useState(isActive);

	const count = group.alarms.length;
	const countLabel = `${count} alarm${count === 1 ? "" : "s"}${isActive ? "" : ", off"}`;

	return (
		<View style={[styles.container, !isActive && styles.containerOff]}>
		<View style={styles.header}>
			<Pressable
			style={styles.headerPress}
			onPress={() => setExpanded((e) => !e)}
			accessibilityRole="button"
			accessibilityState={{ expanded }}
			>
			<View style={{
					width: 10,
					height: 10,
					borderRadius: 5,
					marginRight: 12,
					backgroundColor: COLORS.accent,
					opacity: isActive ? 1 : 0.5,
				}}
				/>

			<View style={expanded ? styles.titleInline : styles.titleStacked}>
				<Text style={[styles.name, !isActive && styles.textOff]}>
				{group.name}
				</Text>
				<Text
				style={[
					styles.count,
					expanded ? styles.countInline : styles.countStacked,
					!isActive && !expanded && styles.countOffCollapsed,
				]}
				>
				{countLabel}
				</Text>
			</View>

			<View style={[styles.chevron, expanded ? styles.chevronUp : styles.chevronDown]} />
			</Pressable>

			<Switch
			value={isActive}
			onValueChange={onToggleGroup}
			trackColor={{ false: COLORS.trackOff, true: COLORS.accent }}
			thumbColor={isActive ? COLORS.thumbOn : COLORS.textOff}
			ios_backgroundColor={COLORS.trackOff}
			/>
		</View>

		{expanded &&
			group.alarms.map((alarm) => (
			<View key={alarm.id}>
				<View style={styles.divider} />
				<AlarmView alarm={alarm} onClick={onClickAlarm} onToggle={onToggleAlarm} embedded />
			</View>
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "90%",
		alignSelf: "center",
		backgroundColor: COLORS.card,
		borderRadius: 22,
		paddingHorizontal: 18,
		paddingTop: 10,
		paddingBottom: 4,
	},

	containerOff: {
	  	backgroundColor: COLORS.cardOff,
	},

	header: {
		flexDirection: "row",
		alignItems: "center",
		minHeight: 40,
	},

	headerPress: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		marginRight: 12,
	},

	titleInline: {
		flex: 1,
		flexDirection: "row",
		alignItems: "baseline",
	},
	
	titleStacked: {
	  	flex: 1,
	},

	name: {
		fontSize: 15,
		fontWeight: "600",
		color: COLORS.text,
	},

	count: {
		fontSize: 11,
		color: COLORS.textMuted,
	},

	countInline: {
	  	marginLeft: 8,
	},

	countStacked: {
	  	marginTop: 2,
	},

	countOffCollapsed: {
	  	color: COLORS.accent,
	},

	textOff: {
	  	color: COLORS.textOff,
	},

	chevron: {
		width: 8,
		height: 8,
		borderRightWidth: 2,
		borderBottomWidth: 2,
		borderColor: COLORS.textMuted,
		marginRight: 6,
	},

	chevronDown: {
		transform: [{ rotate: "45deg" }],
	},

	chevronUp: {
	  	transform: [{ rotate: "-135deg" }],
	},

	divider: {
		height: StyleSheet.hairlineWidth,
		backgroundColor: COLORS.divider,
	}
});