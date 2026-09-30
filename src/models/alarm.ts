type Weekday = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

interface TimeRange {
	start: Date,
	end: Date,
};

export interface Alarm {
	id: number,
	hour: number,
	minute: number,
	weekdays: Weekday[],
	scheduling: TimeRange[],
	pauses?: TimeRange[],
	name: string,
	vibrate: boolean,
	ringtone: string,
	active: boolean,
};