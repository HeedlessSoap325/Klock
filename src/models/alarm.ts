export type Weekday = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

export const WEEK: { day: Weekday; letter: string; short: string }[] = [
	{ day: "Monday", letter: "M", short: "Mon" },
	{ day: "Tuesday", letter: "T", short: "Tue" },
	{ day: "Wednesday", letter: "W", short: "Wed" },
	{ day: "Thursday", letter: "T", short: "Thu" },
	{ day: "Friday", letter: "F", short: "Fri" },
	{ day: "Saturday", letter: "S", short: "Sat" },
	{ day: "Sunday", letter: "S", short: "Sun" },
];

export interface TimeRange {
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