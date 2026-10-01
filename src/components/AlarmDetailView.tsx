import { useMemo, useState } from "react";
import { View, Text, TextInput, Switch, Pressable, ScrollView, StyleSheet } from "react-native";
import { Alarm, WEEK } from "../models/alarm";
import { COLORS } from "../styles/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { clamp, formatDuration, msUntilNextRing, pad, summarizeDays } from "../utils/utils";

interface AlarmDetailViewProps {
	onSave?: (alarm: Alarm) => void;
	alarm?: Alarm;
	onDelete?: (tid: number) => void;
	onCancel?: () => void;
	onPickRingtone?: (current: string) => void;
}

type Weekday = Alarm["weekdays"][number];

export default function AlarmDetailView({ onSave, alarm, onDelete, onCancel: onCancle, onPickRingtone }: AlarmDetailViewProps) {
	const isEdit = alarm !== undefined;
	const now = new Date(Date.now())
	const insets = useSafeAreaInsets();

	const [hour, setHour] = useState(pad(alarm?.hour ?? now.getHours()));
	const [minute, setMinute] = useState(pad(alarm?.minute ?? now.getMinutes()));
	const [weekdays, setWeekdays] = useState<Weekday[]>(alarm?.weekdays ?? []);
	const [name, setName] = useState(alarm?.name ?? "");
	const [vibrate, setVibrate] = useState(alarm?.vibrate ?? true);
	const ringtone = alarm?.ringtone ?? "default";

	const h = clamp(parseInt(hour, 10) || 0, 0, 23);
	const m = clamp(parseInt(minute, 10) || 0, 0, 59);

	const ringsIn = useMemo(() => {
		const ms = msUntilNextRing(h, m, weekdays);
		return ms === null ? null : formatDuration(ms);
	}, [h, m, weekdays]);

	function toggleDay(day: Weekday) {
		setWeekdays((prev) =>
			prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
		);
	}

	const handleSave = () => {
		const newAlarm: Alarm = {
			id: alarm?.id ?? Date.now(), // TODO: use id generating here
			name: name.trim(),
			hour: h,
			minute: m,
			weekdays: WEEK.map((w) => w.day).filter((d) => weekdays.includes(d)),
			vibrate,
			ringtone,
			active: alarm?.active ?? true,
			scheduling: alarm?.scheduling ?? [],
			pauses: alarm?.pauses,
		};

		onSave!(newAlarm);
	};

	return (
		<View style={{
			...styles.container, 
			paddingBottom: insets.bottom,
		}}>
			<ScrollView
				style={styles.scroll}
				contentContainerStyle={styles.scrollContent}
				keyboardShouldPersistTaps="handled"
			>
				<View style={styles.timeRow}>
					<TextInput
						style={styles.timeInput}
						value={hour}
						onChangeText={(t) => setHour(t.replace(/\D/g, "").slice(0, 2))}
						onBlur={() => setHour(pad(h))}
						keyboardType="number-pad"
						maxLength={2}
						selectTextOnFocus
						accessibilityLabel="Hour"
					/>

					<Text style={styles.colon}>:</Text>

					<TextInput
						style={styles.timeInput}
						value={minute}
						onChangeText={(t) => setMinute(t.replace(/\D/g, "").slice(0, 2))}
						onBlur={() => setMinute(pad(m))}
						keyboardType="number-pad"
						maxLength={2}
						selectTextOnFocus
						accessibilityLabel="Minute"
					/>
				</View>

				{ringsIn && (
					<Text style={styles.ringsIn}>
						Will ring in <Text style={styles.ringsInValue}>{ringsIn}</Text>
					</Text>
				)}

				<View style={styles.card}>
					<Text style={styles.cardTitle}>Weekdays</Text>
					<Text style={styles.cardSubtitle}>{summarizeDays(weekdays)}</Text>

					<View style={styles.daysRow}>
						{WEEK.map(({ day, letter }) => {
							const selected = weekdays.includes(day);
							return (
								<Pressable
									key={day}
									onPress={() => toggleDay(day)}
									accessibilityRole="button"
									accessibilityLabel={day}
									accessibilityState={{ selected }}
									style={[styles.dayChip, selected && styles.dayChipSelected]}
								>
									<Text style={[styles.dayText, selected && styles.dayTextSelected]}>
										{letter}
									</Text>
								</Pressable>
							);
						})}
					</View>
				</View>

				<View style={styles.card}>
					<View style={styles.row}>
						<Text style={styles.rowLabel}>Label</Text>
						<TextInput
							style={styles.labelInput}
							value={name}
							onChangeText={setName}
							placeholder="Add label"
							placeholderTextColor={COLORS.textOff}
							maxLength={40}
							textAlign="right"
						/>
					</View>

					<View style={styles.divider} />

					<Pressable
						style={styles.row}
						onPress={() => onPickRingtone?.(ringtone)}
						accessibilityRole="button"
					>
						<Text style={styles.rowLabel}>Ringtone</Text>
						<Text style={styles.rowValue} numberOfLines={1}>
							{ringtone}
						</Text>
					</Pressable>

					<View style={styles.divider} />

					<View style={styles.row}>
						<Text style={styles.rowLabel}>Vibrate</Text>
						<Switch
							value={vibrate}
							onValueChange={setVibrate}
							trackColor={{ false: COLORS.trackOff, true: COLORS.accent }}
							thumbColor={vibrate ? COLORS.thumbOn : COLORS.textOff}
							ios_backgroundColor={COLORS.trackOff}
						/>
					</View>

					{ /* TODO: implement scheduling and alarm pause selection */ }

				</View>
			</ScrollView>

			<View style={styles.actions}>
				{isEdit && onDelete && (
					<Pressable
						onPress={() => onDelete(alarm.id)}
						style={({ pressed }) => [styles.textButton, pressed && styles.pressed]}
					>
						<Text style={[styles.textButtonLabel, { color: COLORS.danger }]}>
						Delete
						</Text>
					</Pressable>
				)}

				<View style={styles.spacer} />

				{onCancle && (
					<Pressable
						onPress={onCancle}
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
		backgroundColor: COLORS.background,
		height: "100%",
	},

	scroll: {
		width: "90%",
	},

	scrollContent: {
		paddingBottom: 24,
	},

	timeRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginTop: 8,
	},

	timeInput: {
		width: 120,
		height: 110,
		borderRadius: 24,
		backgroundColor: COLORS.card,
		color: COLORS.text,
		fontSize: 64,
		fontWeight: "600",
		textAlign: "center",
		fontVariant: ["tabular-nums"],
	},

	colon: {
		fontSize: 56,
		fontWeight: "600",
		color: COLORS.textMuted,
		marginHorizontal: 10,
		marginBottom: 6,
	},

	ringsIn: {
		textAlign: "center",
		marginTop: 14,
		marginBottom: 20,
		fontSize: 13,
		color: COLORS.textMuted,
	},

	ringsInValue: {
		color: COLORS.highlight,
		fontWeight: "600",
	},

	card: {
		backgroundColor: COLORS.card,
		borderRadius: 22,
		paddingHorizontal: 18,
		paddingVertical: 14,
		marginBottom: 12,
	},

	cardTitle: {
		fontSize: 15,
		fontWeight: "600",
		color: COLORS.text,
	},

	cardSubtitle: {
		marginTop: 2,
		fontSize: 11,
		color: COLORS.textMuted,
	},

	daysRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 14,
	},

	dayChip: {
		width: 38,
		height: 38,
		borderRadius: 19,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: COLORS.chip,
	},

	dayChipSelected: {
		backgroundColor: COLORS.accent,
	},

	dayText: {
		fontSize: 13,
		fontWeight: "600",
		color: COLORS.textMuted,
	},

	dayTextSelected: {
		color: COLORS.thumbOn,
	},

	row: {
		minHeight: 44,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},

	rowLabel: {
		fontSize: 15,
		fontWeight: "600",
		color: COLORS.text,
	},

	rowValue: {
		flexShrink: 1,
		marginLeft: 16,
		fontSize: 13,
		color: COLORS.accent,
	},

	labelInput: {
		flex: 1,
		marginLeft: 16,
		fontSize: 13,
		color: COLORS.accent,
		paddingVertical: 0,
	},

	divider: {
		height: StyleSheet.hairlineWidth,
		backgroundColor: COLORS.divider,
	},

	actions: {
		width: "90%",
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 16,
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

	saveLabel: {
		fontSize: 14,
		fontWeight: "700",
		color: COLORS.thumbOn,
	},

	pressed: {
		opacity: 0.6,
	},
});