// Define your exported module types here.
export interface Alarm {
	id: number,
	triggerAt: number,
	label: string,
	group: string,
}

export interface AlarmNotification {
	id: number,
	delay: number,
	alarm: Alarm,
}