package dev.heedlesssoap.alarmmodule

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import org.json.JSONObject

object AlarmNotificationScheduler {
    private const val PREFS = "alarm_notifications";
    
	fun schedule(context: Context, notification: AlarmNotification) {
		val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager;

		val fireIntent = Intent(
            context,
            AlarmNotificationReceiver::class.java
        ).apply {
            putExtra("id", notification.id)
        }

        val pendingIntent = PendingIntent.getBroadcast(
            context,
            notification.id,
            fireIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        );

		val showIntent = Intent(
            context,
            AlarmNotificationReceiver::class.java
        );

        val showPendingIntent = PendingIntent.getBroadcast(
            context,
            4,
            showIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        );
        
        val triggerAt = if (notification.alarm.triggerAt - notification.delay > System.currentTimeMillis()) notification.alarm.triggerAt - notification.delay else System.currentTimeMillis();

        alarmManager.setAlarmClock(AlarmManager.AlarmClockInfo(triggerAt, showPendingIntent), pendingIntent);
        save(context, notification);
	}
	
	fun cancel(context: Context, id: Int) {
		val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager;
		
		val pendingIntent = PendingIntent.getBroadcast(
		    context, id, Intent(context, AlarmNotificationReceiver::class.java),
		    PendingIntent.FLAG_NO_CREATE or PendingIntent.FLAG_IMMUTABLE
		);
		
		if (pendingIntent != null) {
			alarmManager.cancel(pendingIntent);
			pendingIntent.cancel();
		}
		
		remove(context, id);
	}
	
	private fun save(context: Context, notification: AlarmNotification) {
		val alarm_obj = JSONObject().put("id", notification.id).put("delay", notification.delay).put("alarm.id", notification.alarm.id).put("alarm.label", notification.alarm.label).put("alarm.triggerAt", notification.alarm.triggerAt).put("alarm.group", notification.alarm.group).toString();
        context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit().putString(notification.id.toString(), alarm_obj).apply();
	}
	
	fun remove(context: Context, id: Int) {
		context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit().remove(id.toString()).apply();
	}
}