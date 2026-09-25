package dev.heedlesssoap.alarmmodule

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import org.json.JSONObject

object AlarmScheduler {
	fun schedule(context: Context, id: Int, triggerAt: Long, label: String) {
		val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager;

		val fireIntent = Intent(
            context,
            AlarmReceiver::class.java
        ).apply {
            putExtra("id", id)
            putExtra("label", label)
        }

        val pendingIntent = PendingIntent.getBroadcast(
            context,
            id,
            fireIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or
                PendingIntent.FLAG_IMMUTABLE
        )

		val showIntent = Intent(
            context,
            AlarmReceiver::class.java
        )

        val showPendingIntent = PendingIntent.getBroadcast(
            context,
            id,
            showIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or
                PendingIntent.FLAG_IMMUTABLE
        )

        alarmManager.setAlarmClock(AlarmManager.AlarmClockInfo(triggerAt, showPendingIntent), pendingIntent);
	}
}