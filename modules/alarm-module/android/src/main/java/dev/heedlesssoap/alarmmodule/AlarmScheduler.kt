package dev.heedlesssoap.alarmmodule

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import org.json.JSONObject

object AlarmScheduler {
    private const val PREFS = "alarms";
    
	fun schedule(context: Context, alarm: Alarm) {
		val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager;

		val fireIntent = Intent(
            context,
            AlarmReceiver::class.java
        ).apply {
            putExtra("id", alarm.id)
        }

        val pendingIntent = PendingIntent.getBroadcast(
            context,
            alarm.id,
            fireIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        );

		val showIntent = Intent(
            context,
            AlarmReceiver::class.java
        );

        val showPendingIntent = PendingIntent.getBroadcast(
            context,
            3,
            showIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        );

        alarmManager.setAlarmClock(AlarmManager.AlarmClockInfo(alarm.triggerAt, showPendingIntent), pendingIntent);
        save(context, alarm);
	}
	
	fun rescheduleAll(context: Context) {
		val prefs = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
		val now = System.currentTimeMillis();
		
		for ((key, value) in prefs.all) {
		    val alarm_obj = JSONObject(value as String);
		    
			val alarm = Alarm(
			    alarm_obj.getInt("id"), 
			    alarm_obj.getLong("triggerAt"),
			    alarm_obj.getString("label"),
			    alarm_obj.getString("group")
			);
			
			if (alarm.triggerAt > now) {
				schedule(context, alarm);
			} else {
				remove(context, alarm.id);
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
		
		remove(context, id);
		AlarmNotificationScheduler.cancelByAlarmId(context, id);
	}
	
	private fun save(context: Context, alarm: Alarm) {
		val alarm_obj = JSONObject().put("id", alarm.id).put("label", alarm.label).put("triggerAt", alarm.triggerAt).put("group", alarm.group).toString();
        context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit().putString(alarm.id.toString(), alarm_obj).apply();
	}
	
	fun remove(context: Context, id: Int) {
		context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit().remove(id.toString()).apply();
	}
}