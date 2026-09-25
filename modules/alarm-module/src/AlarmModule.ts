import { NativeModule, requireNativeModule } from 'expo';

declare class AlarmModule extends NativeModule<{}> {
	scheduleAlarm(id: number, triggerAt: number, label: string): Promise<void>;
}

export default requireNativeModule<AlarmModule>('AlarmModule');
