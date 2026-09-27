package dev.heedlesssoap.alarmmodule

import android.app.AlarmManager
import android.app.NotificationManager
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

        val launchIntent = context.packageManager.getLaunchIntentForPackage(context.packageName);
        val showPendingIntent = PendingIntent.getActivity(
            context,
            0,
            launchIntent,
            PendingIntent.FLAG_IMMUTABLE
        );
        
        val triggerAt = if (notification.alarm.triggerAt - notification.delay > System.currentTimeMillis()) notification.alarm.triggerAt - notification.delay else System.currentTimeMillis();

        alarmManager.setAlarmClock(AlarmManager.AlarmClockInfo(triggerAt, showPendingIntent), pendingIntent);
        save(context, notification);
	}
	
	fun rescheduleAll(context: Context) {
		val prefs = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
		val now = System.currentTimeMillis();
		
		for ((key, value) in prefs.all) {
			val notification_obj = JSONObject(value as String);
			
			val notification = AlarmNotification(
			    notification_obj.getInt("id"), 
			    notification_obj.getLong("delay"), 
			    Alarm(
			        notification_obj.getInt("alarm.id"), 
			        notification_obj.getLong("alarm.triggerAt"), 
			        notification_obj.getString("alarm.label"), 
			        notification_obj.getString("alarm.group"),
			    ),
			)
			
			if (notification.alarm.triggerAt > now) { // schedule will handle the case, where the triggerAt - delay > now
				schedule(context, notification);
			} else {
				remove(context, notification.id);
			}
		}
	}
	
	fun cancelByAlarmId(context: Context, alarm_id: Int) {
		val prefs = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
		
		for ((key, value) in prefs.all) {
			val notification_obj = JSONObject(value as String);
			
			if (notification_obj.getInt("alarm.id") == alarm_id) {
				cancel(context, notification_obj.getInt("id"));
			}
		}
	}
	
	private fun cancel(context: Context, id: Int) {
		val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager;
		
		val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager;
        notificationManager.cancel(id)
		
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
	
	private fun remove(context: Context, id: Int) {
		context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit().remove(id.toString()).apply();
	}
}