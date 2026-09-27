import { NativeModule, requireNativeModule } from 'expo';
import { Alarm, AlarmNotification } from './AlarmModule.types';

declare class AlarmModule extends NativeModule<{}> {
	scheduleAlarm(alarm: Alarm): Promise<void>;
	cancelAlarm(id: number): Promise<void>;

	scheduleAlarmNotification(notification: AlarmNotification): Promise<void>;
}

export default requireNativeModule<AlarmModule>('AlarmModule');
