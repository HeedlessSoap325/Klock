import { useEffect, useState } from "react";
import { Modal, View, Text, Pressable, FlatList, StyleSheet } from "react-native";
import { Ringtone } from "../../modules/alarm-module/src/AlarmModule.types";
import  AlarmModule from "../../modules/alarm-module/src/AlarmModule"
import { COLORS } from "../styles/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
  visible: boolean;
  ringtones: Ringtone[];
  value: string;
  onSelect: (uri: string) => void;
  onClose: () => void;
}

export default function RingtonePickerModal({
  visible,
  ringtones,
  value,
  onSelect,
  onClose,
}: Props) {
	const [selected, setSelected] = useState(value);
	const insets = useSafeAreaInsets();

	// start from the current value every time the sheet opens
	useEffect(() => {
		if (visible) setSelected(value);
	}, [visible, value]);
	
	// stop any preview when the sheet closes or unmounts
	useEffect(() => () => AlarmModule.stopPreview(), [visible]);

	const pick = (uri: string) => {
		setSelected(uri);
		AlarmModule.playPreview(uri);
	};

	return (
		<Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
			<Pressable style={styles.backdrop} onPress={onClose} />

			<View style={[
				styles.sheet,
				{
					marginBottom: insets.bottom,
				}
			]}>
				<View style={styles.handle} />
				<Text style={styles.title}>Ringtone</Text>

				<FlatList
					data={ringtones}
					keyExtractor={(r) => r.uri}
					style={styles.list}
					renderItem={({ item }) => {
						const isSelected = item.uri === selected;
						return (
						<Pressable
							onPress={() => pick(item.uri)}
							accessibilityRole="radio"
							accessibilityState={{ selected: isSelected }}
							style={({ pressed }) => [
							styles.row,
							isSelected && styles.rowSelected,
							pressed && styles.pressed,
							]}
						>
							<View style={[styles.radio, isSelected && styles.radioSelected]}>
								{isSelected && <View style={styles.radioDot} />}
							</View>
							<Text
								style={[styles.rowText, isSelected && styles.rowTextSelected]}
								numberOfLines={1}
							>
								{item.title}
							</Text>
						</Pressable>
						);
					}}
				/>

				<View style={styles.actions}>
					<Pressable onPress={onClose} style={styles.cancel}>
						<Text style={styles.cancelLabel}>Cancel</Text>
					</Pressable>
					<Pressable
						onPress={() => {
							onSelect(selected);
							onClose();
						}}
						style={({ pressed }) => [styles.done, pressed && styles.pressed]}
					>
						<Text style={styles.doneLabel}>Done</Text>
					</Pressable>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	backdrop: {
		flex: 1,
		backgroundColor: "transparent",
	},
	
	sheet: {
		maxHeight: "70%",
		backgroundColor: COLORS.card,
		borderTopLeftRadius: 28,
		borderTopRightRadius: 28,
		paddingHorizontal: 18,
		paddingTop: 10,
		paddingBottom: 24,
	},

	handle: {
		alignSelf: "center",
		width: 40,
		height: 4,
		borderRadius: 2,
		backgroundColor: COLORS.trackOff,
		marginBottom: 14,
	},

	title: {
		fontSize: 18,
		fontWeight: "700",
		color: COLORS.text,
		marginBottom: 8,
	},

	list: {
		flexGrow: 0,
	},

	row: {
		flexDirection: "row",
		alignItems: "center",
		minHeight: 48,
		paddingHorizontal: 12,
		borderRadius: 14,
	},

	rowSelected: {
		backgroundColor: COLORS.chip,
	},

	radio: {
		width: 20,
		height: 20,
		borderRadius: 10,
		borderWidth: 2,
		borderColor: COLORS.textOff,
		alignItems: "center",
		justifyContent: "center",
		marginRight: 14,
	},

	radioSelected: {
		borderColor: COLORS.accent,
	},

	radioDot: {
		width: 10,
		height: 10,
		borderRadius: 5,
		backgroundColor: COLORS.accent,
	},

	rowText: {
		flex: 1,
		fontSize: 15,
		color: COLORS.textMuted,
	},

	rowTextSelected: {
		color: COLORS.text,
		fontWeight: "600",
	},

	actions: {
		flexDirection: "row",
		justifyContent: "flex-end",
		alignItems: "center",
		marginTop: 14,
	},

	cancel: {
		paddingHorizontal: 14,
		paddingVertical: 12,
	},

	cancelLabel: {
		fontSize: 14,
		fontWeight: "600",
		color: COLORS.textMuted,
	},

	done: {
		marginLeft: 6,
		paddingHorizontal: 28,
		paddingVertical: 14,
		borderRadius: 18,
		backgroundColor: COLORS.accent,
	},

	doneLabel: {
		fontSize: 14,
		fontWeight: "700",
		color: COLORS.thumbOn,
	},

	pressed: {
		opacity: 0.6,
	},
});