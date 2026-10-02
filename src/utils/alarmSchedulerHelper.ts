import AsyncStorage from "@react-native-async-storage/async-storage";
import AlarmModule from "../../modules/alarm-module/src/AlarmModule";
import { AlarmModuleAlarm } from "../../modules/alarm-module/src/AlarmModule.types";
import { Alarm, TimeRange, WEEK } from "../models/alarm";
import { Entry, isAlarmGroup } from "../models/entry";

const LEDGER_KEY = "alarm-ledger";
const HORIZON_DAYS = 30;
const NOTIFICATION_DELAY = 5 * 60 * 1000;

interface LedgerItem {
	alarmId: number;
	nativeId: number; // id passed to the native module (notification uses nativeId + 1)
	triggerAt: number;
	sig: string; // label/group/ringtone/vibrate, so changes trigger a reschedule
}

interface Ledger {
	nextId: number;
	items: Record<string, LedgerItem>;
}

interface Desired {
	key: string;
	alarm: Alarm;
	triggerAt: number;
	sig: string;
	group: string;
}

async function loadLedger(): Promise<Ledger> {
	try {
		const raw = await AsyncStorage.getItem(LEDGER_KEY);
		if (raw) return JSON.parse(raw);
	} catch (e) {
		console.error(`Failed to load ledger: ${e}`);
	}
	return { nextId: 1, items: {} };
}

function inRanges(ts: number, ranges?: TimeRange[]): boolean {
	// Dates become strings after JSON.parse, so always wrap in new Date()
	return ranges?.some(
		(r) => ts >= new Date(r.start).getTime() && ts <= new Date(r.end).getTime()
	) ?? false;
}

function occurrences(a: Alarm, now: number, horizon: number): number[] {
	if (!a.active) return [];

	const out: number[] = [];

	for (let i = 0; i <= HORIZON_DAYS; i++) {
		// get the scheduled date of the alarm at the day in the future
		const d = new Date(now);
		d.setDate(d.getDate() + i);
		d.setHours(a.hour, a.minute, 0, 0);

		const t = d.getTime();

		if (t <= now || t > horizon) continue; // alarm in the past or too far in the future

		const name = WEEK[(d.getDay() + 6) % 7].day;
		if (a.weekdays.length > 0 && !a.weekdays.includes(name)) continue; // alarm not scheduled for that day
		if (a.scheduling?.length > 0 && !inRanges(t, a.scheduling)) continue; // alarm not scheduled for that day
		if (inRanges(t, a.pauses)) continue; // alarm is paused for that day

		out.push(t);
		if (a.weekdays.length === 0) break; // one-shot alarm: only the next ring
	}

	return out;
}

function flatten(entries: Entry[]): { alarm: Alarm; group: string }[] {
	return entries.flatMap((e) =>
		isAlarmGroup(e) ? e.alarms.map((alarm) => ({ alarm, group: e.name })) : [{ alarm: e, group: "" }]
	);
}

async function cancel(item: LedgerItem) {
	await AlarmModule.cancelAlarm(item.nativeId);
}

async function run(entries: Entry[], onOneShotFired: (alarmId: number) => void) {
	const now = Date.now();
	const horizon = now + HORIZON_DAYS * 24 * 60 * 60 * 1000;
	const ledger = await loadLedger();
	const all = flatten(entries);

	// 1. Drop ledger entries that are in the past; one-shot alarms that fired get deactivated
	const firedOneShots = new Set<number>();
	for (const [key, item] of Object.entries(ledger.items)) {
		if (item.triggerAt > now) continue;

		delete ledger.items[key];
		const a = all.find((x) => x.alarm.id === item.alarmId)?.alarm;

		if (a && a.active && a.weekdays.length === 0) firedOneShots.add(a.id);
	}

	// 2. Get desired state
	const desired = new Map<string, Desired>();
	for (const { alarm, group } of all) {
		if (firedOneShots.has(alarm.id)) continue;

		const sig = JSON.stringify([alarm.name, group, alarm.ringtone, alarm.vibrate]);
		for (const triggerAt of occurrences(alarm, now, horizon)) {
			const key = `${alarm.id}:${triggerAt}`;
			desired.set(key, { key, alarm, triggerAt, sig, group });
		}
	}

	// 3. Cancel what's no longer wanted (or the signature (settings like name, group, ringtone, vibrate) changed)
	for (const [key, item] of Object.entries(ledger.items)) {
		const d = desired.get(key);
		if (!d || d.sig !== item.sig) {
			await cancel(item);
			
			delete ledger.items[key];
		}
	}

	// 4. Schedule, to reach desired state
	for (const d of desired.values()) {
		if (ledger.items[d.key]) continue;

		const nativeId = ledger.nextId;
		ledger.nextId += 2; // reserve nativeId + 1 for the notification

		const moduleAlarm: AlarmModuleAlarm = {
			id: nativeId,
			triggerAt: d.triggerAt,
			label: d.alarm.name,
			group: d.group,
			ringtone: d.alarm.ringtone,
			vibrate: d.alarm.vibrate,
		};

		AlarmModule.scheduleAlarm(moduleAlarm);
		AlarmModule.scheduleAlarmNotification({
			id: nativeId + 1,
			delay: NOTIFICATION_DELAY,
			alarm: moduleAlarm,
		});

		ledger.items[d.key] = { alarmId: d.alarm.id, nativeId, triggerAt: d.triggerAt, sig: d.sig };
	}

	await AsyncStorage.setItem(LEDGER_KEY, JSON.stringify(ledger));

	firedOneShots.forEach(onOneShotFired);
}

// Serialize runs so two quick state changes can't corrupt the ledger
let queue: Promise<void> = Promise.resolve();

export function syncAlarms(entries: Entry[], onOneShotFired: (alarmId: number) => void) {
	queue = queue
		.then(() => run(entries, onOneShotFired))
		.catch((e) => console.error(`Alarm sync failed: ${e}`));
	return queue;
}

export async function dismissNext(alarm: Alarm, onOneShotFired: (alarmId: number) => void) {
	const now = Date.now();
	const horizon = now + HORIZON_DAYS * 24 * 60 * 60 * 1000;
	const occurences = occurrences(alarm, now, horizon);

	const nextTriggerAt = Math.min(...occurences);

	const ledger = await loadLedger();
	const key = `${alarm.id}:${nextTriggerAt}`;

	await cancel(ledger.items[key]);
	delete ledger.items[key];

	await AsyncStorage.setItem(LEDGER_KEY, JSON.stringify(ledger));

	if (alarm && alarm.active && alarm.weekdays.length === 0) {
		onOneShotFired(alarm.id);
	}
}

export async function getNextAlarmId(): Promise<number | null> {
	const ledger = await loadLedger();

	const scheduled = Object.keys(ledger.items).flatMap((e) =>
		({alarm_id: e.split(":")[0], triggerAt: e.split(":")[1]})
	);

	let closestTrigger = Infinity;
	let closestId = null;

	for (const {alarm_id, triggerAt} of scheduled) {
		if (parseInt(triggerAt, 10) < closestTrigger) {
			closestTrigger = parseInt(triggerAt, 10);
			closestId = parseInt(alarm_id, 10);
		}
	}

	return closestId
}

