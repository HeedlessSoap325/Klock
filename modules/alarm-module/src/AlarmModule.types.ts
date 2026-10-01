// Define your exported module types here.
export interface AlarmModuleAlarm {
	id: number,
	triggerAt: number,
	label: string,
	group: string,
	ringtone: String,
	vibrate: boolean,
}

export interface AlarmModuleNotification {
	id: number,
	delay: number,
	alarm: AlarmModuleAlarm,
}


export interface Ringtone {
  title: string;
  uri: string; // "default" or content://media/...
}