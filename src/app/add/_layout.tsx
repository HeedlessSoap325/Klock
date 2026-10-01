import { NativeTabs } from "expo-router/unstable-native-tabs";

export default function AddLayout() {
  return (
    <NativeTabs>
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