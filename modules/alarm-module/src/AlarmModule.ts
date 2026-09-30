import { NativeModule, requireNativeModule } from 'expo';
import { AlarmModuleAlarm, AlarmModuleNotification } from './AlarmModule.types';

declare class AlarmModule extends NativeModule<{}> {
	scheduleAlarm(alarm: AlarmModuleAlarm): Promise<void>;
	cancelAlarm(id: number): Promise<void>;

	scheduleAlarmNotification(notification: AlarmModuleNotification): Promise<void>;
}

export default requireNativeModule<AlarmModule>('AlarmModule');
