package dev.heedlesssoap.alarmmodule

import android.app.AlarmManager
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import org.json.JSONObject

object AlarmNotificationScheduler {
	fun schedule(context: Context, notification: AlarmNotification) {
		val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager;

		val fireIntent = Intent(
            context,
            AlarmNotificationReceiver::class.java
        ).apply {
            putExtra("notification_id", notification.id)
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
        PreferencesWrapper.saveNotification(context, notification);
	}
	
	fun rescheduleAll(context: Context) {
		val notifications = PreferencesWrapper.getAllNotifications(context);
		val now = System.currentTimeMillis();
		
		for (notification in notifications) {
			if (notification.alarm.triggerAt > now) { // schedule will handle the case, where the triggerAt - delay > now
				schedule(context, notification);
			} else {
				PreferencesWrapper.removeNotification(context, notification.id)
			}
		}
	}
	
	fun cancelByAlarmId(context: Context, alarm_id: Int) {
		val notifications = PreferencesWrapper.getAllNotifications(context);
		
		for (notification in notifications) {
			if (notification.alarm.id == alarm_id) {
				cancel(context, notification.id);
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
		
		PreferencesWrapper.removeNotification(context, id);
	}
}