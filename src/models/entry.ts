import { Alarm } from "./alarm";
import { AlarmGroup } from "./alarmGroup";

export type Entry = Alarm | AlarmGroup;

export function isAlarmGroup(entry: Entry): entry is AlarmGroup {
	return "alarms" in entry;
}