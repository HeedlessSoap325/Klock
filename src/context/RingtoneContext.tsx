import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Ringtone } from '../../modules/alarm-module/src/AlarmModule.types';
import  AlarmModule from "../../modules/alarm-module/src/AlarmModule"

interface RingtoneContextType {
	ringtones: Ringtone[];
}

const RingtoneContext = createContext<RingtoneContextType | undefined>(undefined);

export function RingtoneProvider({ children }: { children: ReactNode }) {
	const [ringtones, setRingtones] = useState<Ringtone[]>([]);
	  
	useEffect(() => {
		let alive = true;
		AlarmModule.getRingtones()
			.then((r) => alive && setRingtones(r))
			.catch(() => {});

		return () => {
			alive = false;
		};
	}, []);

	return (
		<RingtoneContext.Provider value={{ ringtones }}>
			{children}
		</RingtoneContext.Provider>
	);
}

export function useRingtones() {
	const context = useContext(RingtoneContext);
	if (!context) {
		throw new Error('useRingtones has to be used inside RingtoneProvider');
	}
	return context;
}