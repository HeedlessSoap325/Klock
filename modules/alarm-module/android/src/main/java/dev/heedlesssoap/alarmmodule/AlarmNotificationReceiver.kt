package dev.heedlesssoap.alarmmodule

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.app.PendingIntent

import android.app.*
import android.os.Build
import org.json.JSONObject
import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter

class AlarmNotificationReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
    	val notification_id = intent.getIntExtra("notification_id", 0);
        val alarm_notification = PreferencesWrapper.getNotification(context, notification_id);

        val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        if (Build.VERSION.SDK_INT >= 26) {
            notificationManager.createNotificationChannel(
                NotificationChannel("alarms", "Alarms", NotificationManager.IMPORTANCE_HIGH)
            );
        }
        
        val alarmTriggerTime = Instant.ofEpochMilli(alarm_notification.alarm.triggerAt)
            .atZone(ZoneId.systemDefault())
            .format(DateTimeFormatter.ofPattern("HH:mm"));
        
        val dismissIntent = Intent(context, DismissAlarmReceiver::class.java).apply {
            putExtra("alarm_id", alarm_notification.alarm.id)
        };
        
        val dismissPendingIntent = PendingIntent.getBroadcast(
            context,
            (System.currentTimeMillis() % 2147483647).toInt(),
            dismissIntent,
            PendingIntent.FLAG_IMMUTABLE
        );
                    
        val dismissAction = Notification.Action.Builder(
            android.R.drawable.ic_menu_close_clear_cancel,
            "Dismiss Alarm",
            dismissPendingIntent
        ).build();
        
        val launchIntent = context.packageManager.getLaunchIntentForPackage(context.packageName);
        val showPendingIntent = PendingIntent.getActivity(
            context,
            0,
            launchIntent,
            PendingIntent.FLAG_IMMUTABLE
        );

        val notification = Notification.Builder(context, "alarms")
            .setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
            .setContentTitle("Upcoming Alarm ⋅ " + alarm_notification.alarm.group)
            .setContentText(alarmTriggerTime + " ⋅ " + alarm_notification.alarm.label)
            .addAction(dismissAction)
            .setContentIntent(showPendingIntent)
            .setCategory(Notification.CATEGORY_ALARM)
            .setPriority(Notification.PRIORITY_HIGH)
            .build();
            
        notificationManager.notify(notification_id, notification);
    }
}
