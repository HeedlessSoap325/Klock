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
    	val PREFS = "alarm_notifications";
    	
    	val id = intent.getIntExtra("id", 0);
    	
    	val prefs = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
    	val notification_obj = JSONObject(prefs.getString(id.toString(), "") as String);
    	

        val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        if (Build.VERSION.SDK_INT >= 26) {
            notificationManager.createNotificationChannel(
                NotificationChannel("alarms", "Alarms", NotificationManager.IMPORTANCE_HIGH)
            );
        }
        
        val alarmTriggerTime = Instant.ofEpochMilli(notification_obj.getLong("alarm.triggerAt"))
            .atZone(ZoneId.systemDefault())
            .format(DateTimeFormatter.ofPattern("HH:mm"));
        
        val dismissIntent = Intent(context, DismissAlarmReceiver::class.java).apply {
            putExtra("alarm_id", notification_obj.getInt("alarm.id"))
            putExtra("notification_id", id)
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
            .setContentTitle("Upcoming Alarm ⋅ " + notification_obj.getString("alarm.group"))
            .setContentText(alarmTriggerTime + " ⋅ " + notification_obj.getString("alarm.label"))
            .addAction(dismissAction)
            .setContentIntent(showPendingIntent)
            .setCategory(Notification.CATEGORY_ALARM)
            .setPriority(Notification.PRIORITY_HIGH)
            .build();
            
        notificationManager.notify(id, notification);
    }
}
