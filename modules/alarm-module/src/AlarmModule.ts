import { NativeModule, requireNativeModule } from 'expo';
import { AlarmModuleAlarm, AlarmModuleNotification, Ringtone } from './AlarmModule.types';

declare class AlarmModule extends NativeModule<{}> {
	scheduleAlarm(alarm: AlarmModuleAlarm): Promise<void>;
	cancelAlarm(id: number): Promise<void>;

	scheduleAlarmNotification(notification: AlarmModuleNotification): Promise<void>;

	getRingtones(): Promise<Ringtone[]>;
	playPreview(stored: string): void;
	stopPreview(): void;
}

export default requireNativeModule<AlarmModule>('AlarmModule');