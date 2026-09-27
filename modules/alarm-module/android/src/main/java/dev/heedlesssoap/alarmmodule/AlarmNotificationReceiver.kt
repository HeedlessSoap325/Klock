package dev.heedlesssoap.alarmmodule

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

import android.app.*
import android.os.Build
import org.json.JSONObject

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
        
        val notification = Notification.Builder(context, "alarms")
            .setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
            .setContentTitle(notification_obj.getString("alarm.label"))
            .setContentText("test")
            .setCategory(Notification.CATEGORY_ALARM)
            .setPriority(Notification.PRIORITY_HIGH)
            .build();
            
        notificationManager.notify(id, notification);
        
        AlarmScheduler.remove(context, id);
        AlarmNotificationScheduler.remove(context, id);
    }
}
