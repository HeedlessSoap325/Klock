import { WEEK, Weekday } from "../models/alarm";

export function pad(n: number): string {
	return String(n).padStart(2, "0")
}

export function clamp(n: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, n));
}

export function summarizeDays(days: Weekday[]): string {
	const short = WEEK.filter((w) => days.includes(w.day)).map((w) => w.short);
	if (short.length === 0) return "Once";
	if (short.length === 7) return "Every day";
	if (short.join() === "Mon,Tue,Wed,Thu,Fri") return "Mon to Fri";
	if (short.join() === "Sat,Sun") return "Weekend";
	return short.join(", ");
}

export function msUntilNextRing(hour: number, minute: number, days: Weekday[]): number | null {
	const now = new Date();
	for (let i = 0; i <= 7; i++) {
		const d = new Date(now);
		d.setDate(now.getDate() + i);
		d.setHours(hour, minute, 0, 0);

		if (d <= now) continue;

		const name = WEEK[(d.getDay() + 6) % 7].day; // getDay(): 0 = Sunday
		if (days.length === 0 || days.includes(name)) {
			return d.getTime() - now.getTime();
		}
	}

	return null;
}

export function formatDuration(ms: number): string {
	const totalMinutes = Math.round(ms / 60000);
	const d = Math.floor(totalMinutes / 1440);
	const h = Math.floor((totalMinutes % 1440) / 60);
	const m = totalMinutes % 60;
	if (d > 0) return `${d}d ${h}h`;
	if (h > 0) return `${h}h ${pad(m)}m`;
	return `${m}m`;
}