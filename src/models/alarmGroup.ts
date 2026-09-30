import { Alarm } from "./alarm";

export interface AlarmGroup {
	id: number,
	name: string,
	alarms: Alarm[],
};