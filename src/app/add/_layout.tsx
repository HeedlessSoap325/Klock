import { NativeTabs } from "expo-router/unstable-native-tabs";
import { COLORS } from "../../styles/colors";

export default function AddLayout() {
	return (
		<NativeTabs
			backgroundColor={COLORS.background}
			tintColor={COLORS.accent}
			iconColor={COLORS.textMuted}
			labelStyle={{ color: COLORS.textMuted }}
			indicatorColor={COLORS.chip}
			rippleColor={COLORS.accent}
		>
			<NativeTabs.Trigger name="alarm">
				<NativeTabs.Trigger.Label>Alarm</NativeTabs.Trigger.Label>
				<NativeTabs.Trigger.Icon sf="alarm.fill" md="alarm" />
			</NativeTabs.Trigger>
			<NativeTabs.Trigger name="alarmGroup">
				<NativeTabs.Trigger.Label>Group</NativeTabs.Trigger.Label>
				<NativeTabs.Trigger.Icon sf="folder.fill" md="folder" />
			</NativeTabs.Trigger>
		</NativeTabs>
	);
}