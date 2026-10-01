import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Alarm } from '../models/alarm';
import { AlarmGroup } from '../models/alarmGroup';
import { Entry, isAlarmGroup } from '../models/entry';

interface AlarmContextType {
	entries: Entry[];
	loaded: boolean;
	addAlarmGroup: (group: AlarmGroup) => void;
	addAlarm: (alarm: Alarm) => void;
	updateAlarmGroup: (id: number, newGroup: AlarmGroup) => void;
	updateAlarm: (id: number, newAlarm: Alarm) => void;
	removeAlarmGroup: (id: number) => void;
	removeAlarm: (id: number) => void;
}

const AlarmContext = createContext<AlarmContextType | undefined>(undefined);

export function AlarmProvider({ children }: { children: ReactNode }) {
  	const [entries, setEntries] = useState<Entry[]>([]);
	const [loaded, setloaded] = useState<boolean>(false);

	function addAlarmGroup(group: AlarmGroup) {
		setEntries(prev =>
			[...prev, group]
		);
	}

	function addAlarm(alarm: Alarm) {
		setEntries(prev =>
			[...prev, alarm]
		);
	}

	function updateAlarmGroup(id: number, groupUpdate: Partial<AlarmGroup>) {
		setEntries(prev =>
			prev.map((v) =>
				v.id === id ? {...v, ...groupUpdate} : v
			)
		);
	}

	function updateAlarm(id: number, alarmUpdate: Partial<Alarm>) {
		setEntries((prev) =>
			prev.map((entry) => {
				if (isAlarmGroup(entry)) {
					return {
						...entry,
						alarms: entry.alarms.map((a) =>
						a.id === id ? { ...a, ...alarmUpdate } : a
						),
					};
				}

				return entry.id === id ? { ...entry, ...alarmUpdate } : entry;
			})
		);
	}

	function removeAlarmGroup(id: number) {
		setEntries(prev =>
			prev.filter((v) => !(isAlarmGroup(v) && v.id === id))
		);
	}

	function removeAlarm(id: number) {
		setEntries((prev) =>
			prev.flatMap((entry): Entry[] => {
				if (isAlarmGroup(entry)) {
					if (!entry.alarms.some((a) => a.id === id)) return [entry];
		
					const alarms = entry.alarms.filter((a) => a.id !== id);
					return [{ ...entry, alarms }];
				}
		
				return entry.id === id ? [] : [entry];
			})
		);
	}

	useEffect(() => {
		if (!loaded) return;

		async function save() {
			try {
				const storable = JSON.stringify(entries);
				await AsyncStorage.setItem("entries", storable);
			} catch (e) {
				console.error(`Failed to save entries: ${e}`);
			} finally {
				console.log("Entries saved");
			}
		}

		save();
	}, [entries]);

	useEffect(() => {
		async function load() {
			try {
				const stored = await AsyncStorage.getItem("entries");
				const setable = JSON.parse(stored ?? "[]");
				setEntries(setable);

				setloaded(true);
			} catch(e) {
				console.error(`Failed to load entries: ${e}`);
			} finally {
				console.log("Entries loaded");
			}
		}

		load();
	}, [])

	return (
		<AlarmContext.Provider value={{ entries, loaded, addAlarmGroup, addAlarm, updateAlarmGroup, updateAlarm, removeAlarmGroup, removeAlarm }}>
			{children}
		</AlarmContext.Provider>
	);
}

export function useAlarms() {
	const context = useContext(AlarmContext);
	if (!context) {
		throw new Error('useAlarms has to be used inside AlarmProvider');
	}
	return context;
}