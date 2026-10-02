import { Pressable, Text, TextInput, View, StyleSheet } from "react-native";
import { AlarmGroup } from "../models/alarmGroup";
import { useState } from "react";
import { COLORS } from "../styles/colors";

interface AlarmGroupDetailViewProps {
	onSave?: (group: AlarmGroup) => void;
	group?: AlarmGroup;
	onDelete?: (id: number) => void;
	onCancel?: () => void;
}

export default function AlarmGroupDetail({ onSave, group, onDelete, onCancel } : AlarmGroupDetailViewProps) {
	const isEdit = group !== undefined;
	const [name, setName] = useState(group?.name ? group.name : "");

	function handleSave() {
		const alarmGroup: AlarmGroup = {
			id: Date.now(),
			name: name,
			alarms: group ? group.alarms : [],
		}
		onSave!(alarmGroup);
	}

	return (
		<View style={styles.container}>
			<TextInput
				style={styles.input}
				value={name}
				onChangeText={setName}
				placeholder="Group name"
				placeholderTextColor={COLORS.textOff}
				maxLength={30}
			/>

			<View style={styles.actions}>
				{isEdit && onDelete && (
					<Pressable
						onPress={() => onDelete(group.id)}
						style={({ pressed }) => [styles.textButton, pressed && styles.pressed]}
					>
						<Text style={[styles.textButtonLabel, { color: COLORS.danger }]}>
						Delete
						</Text>
					</Pressable>
				)}

				<View style={styles.spacer} />

				{onCancel && (
					<Pressable
						onPress={onCancel}
						style={({ pressed }) => [styles.textButton, pressed && styles.pressed]}
					>
						<Text style={[styles.textButtonLabel, { color: COLORS.textMuted }]}>
						Cancel
						</Text>
					</Pressable>
				)}

				<Pressable
					onPress={handleSave}
					style={({ pressed }) => [styles.saveButton, pressed && styles.pressed]}
				>
					<Text style={styles.saveLabel}>Save</Text>
				</Pressable>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { 
		flex: 1, 
		alignItems: "center", 
		paddingTop: 40, 
		backgroundColor: COLORS.background 
	},

	input: {
		width: "90%", 
		height: 56, 
		borderRadius: 22, 
		paddingHorizontal: 18,
		backgroundColor: COLORS.card, 
		color: COLORS.text, 
		fontSize: 15,
	},

	actions: { 
		width: "90%", 
		flexDirection: "row", 
		justifyContent: "flex-end", 
		marginTop: 16 
	},

	cancel: { 
		paddingHorizontal: 14, 
		paddingVertical: 12 
	},

	cancelLabel: { 
		fontSize: 14, 
		fontWeight: "600", 
		color: COLORS.textMuted 
	},
	save: { 
		marginLeft: 6, 
		paddingHorizontal: 28, 
		paddingVertical: 14, 
		borderRadius: 18, 
		backgroundColor: COLORS.accent 
	},

	saveLabel: { 
		fontSize: 14, 
		fontWeight: "700", 
		color: COLORS.thumbOn	
	},

	spacer: {
		flex: 1,
	},

	textButton: {
		paddingHorizontal: 14,
		paddingVertical: 12,
	},

	textButtonLabel: {
		fontSize: 14,
		fontWeight: "600",
	},

	saveButton: {
		marginLeft: 6,
		paddingHorizontal: 28,
		paddingVertical: 14,
		borderRadius: 18,
		backgroundColor: COLORS.accent,
	},

	pressed: {
		opacity: 0.6,
	},
});