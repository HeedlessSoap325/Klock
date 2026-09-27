package dev.heedlesssoap.alarmmodule

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import org.json.JSONObject

object AlarmScheduler {
    fun schedule(context: Context, alarm: Alarm) {
		val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager;

		val fireIntent = Intent(
            context,
            AlarmReceiver::class.java
        ).apply {
            putExtra("alarm_id", alarm.id)
        }

        val pendingIntent = PendingIntent.getBroadcast(
            context,
            alarm.id,
            fireIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        );

        val launchIntent = context.packageManager.getLaunchIntentForPackage(context.packageName);
        val showPendingIntent = PendingIntent.getActivity(
            context,
            0,
            launchIntent,
            PendingIntent.FLAG_IMMUTABLE
        );

        alarmManager.setAlarmClock(AlarmManager.AlarmClockInfo(alarm.triggerAt, showPendingIntent), pendingIntent);
        PreferencesWrapper.saveAlarm(context, alarm);
	}
	
	fun rescheduleAll(context: Context) {
		val alarms = PreferencesWrapper.getAllAlarms(context);
		val now = System.currentTimeMillis();
		
		for (alarm in alarms) {
			if (alarm.triggerAt > now) {
				schedule(context, alarm);
			} else {
				PreferencesWrapper.removeAlarm(context, alarm.id)
			}
		}
	}
	
	fun cancel(context: Context, id: Int) {
		val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager;
		
		val pendingIntent = PendingIntent.getBroadcast(
		    context, id, Intent(context, AlarmReceiver::class.java),
		    PendingIntent.FLAG_NO_CREATE or PendingIntent.FLAG_IMMUTABLE
		);
		
		if (pendingIntent != null) {
			alarmManager.cancel(pendingIntent);
			pendingIntent.cancel();
		}
		
		PreferencesWrapper.removeAlarm(context, id);
		AlarmNotificationScheduler.cancelByAlarmId(context, id);
	}
}