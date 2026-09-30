// Define your exported module types here.
export interface AlarmModuleAlarm {
	id: number,
	triggerAt: number,
	label: string,
	group: string,
}

export interface AlarmModuleNotification {
	id: number,
	delay: number,
	alarm: AlarmModuleAlarm,
}