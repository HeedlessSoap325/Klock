package dev.heedlesssoap.alarmmodule

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

class AlarmReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val alarm_id = intent.getIntExtra("alarm_id", 0);
        val alarm = PreferencesWrapper.getAlarm(context, alarm_id);
    	
        val alarmRingService = Intent(context, AlarmRingingService::class.java)
            .putExtra("alarm_id", alarm.id)
            .putExtra("alarm_label", alarm.label)
            .putExtra("alarm_ringtone", alarm.ringtone)
            .putExtra("alarm_vibrate", alarm.vibrate);
            
    
        context.startForegroundService(alarmRingService);
        AlarmScheduler.cancel(context, alarm_id);
    }
}