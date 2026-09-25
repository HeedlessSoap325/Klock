import { registerWebModule, NativeModule } from 'expo';

// AlarmModule is not available on the web platform.
class AlarmModule extends NativeModule<{}> {}

export default registerWebModule(AlarmModule, 'AlarmModule');
