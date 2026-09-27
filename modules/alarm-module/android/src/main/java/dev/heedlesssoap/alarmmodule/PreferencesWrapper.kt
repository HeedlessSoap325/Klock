package dev.heedlesssoap.alarmmodule;

import android.content.Context
import org.json.JSONObject

import dev.heedlesssoap.alarmmodule.Alarm

object PreferencesWrapper {
	private const val NOTIFICATION_PREFS = "alarm_notifications";
	private const val ALARM_PREFS = "alarms";
	
	// alarm wrappers
	private fun alarmToJSONObject(alarm: Alarm): JSONObject {
		return JSONObject().apply {
			put("id", alarm.id)
			put("label", alarm.label)
			put("triggerAt", alarm.triggerAt)
			put("group", alarm.group)
		}
	}
	
	private fun JSONObjectToAlarm(alarm_obj: JSONObject): Alarm {
		return Alarm(
			alarm_obj.getInt("id"),
			alarm_obj.getLong("triggerAt"),
			alarm_obj.getString("label"),
			alarm_obj.getString("group")
		);
	}
	
	fun saveAlarm(context: Context, alarm: Alarm) {
		val alarm_obj = alarmToJSONObject(alarm).toString();
        context.getSharedPreferences(ALARM_PREFS, Context.MODE_PRIVATE).edit().putString(alarm.id.toString(), alarm_obj).apply();
	}
	
	fun getAlarm(context: Context, id: Int): Alarm {
		val prefs = context.getSharedPreferences(ALARM_PREFS, Context.MODE_PRIVATE);

		val alarmString = prefs.getString(id.toString(), null) ?: throw IllegalArgumentException("Alarm $id not found");

		val alarm_obj = JSONObject(alarmString);

		return JSONObjectToAlarm(alarm_obj);
	}

	fun getAllAlarms(context: Context): List<Alarm> {
		val prefs = context.getSharedPreferences(ALARM_PREFS, Context.MODE_PRIVATE)

		return prefs.all.keys.map { key ->
			getAlarm(context, key.toInt())
		}
	}
	
	fun removeAlarm(context: Context, id: Int) {
		context.getSharedPreferences(ALARM_PREFS, Context.MODE_PRIVATE).edit().remove(id.toString()).apply();
	}
	
	// notification wrappers
	private fun notificationToJSONObject(notification: AlarmNotification): JSONObject {
		return JSONObject().apply {
			put("id", notification.id)
			put("delay", notification.delay)
			put("alarm", alarmToJSONObject(notification.alarm))
		}
	}
	
	private fun JSONObjectToNotification(notification_obj: JSONObject): AlarmNotification {
		return AlarmNotification(
			notification_obj.getInt("id"),
			notification_obj.getLong("delay"),
			JSONObjectToAlarm(notification_obj.getJSONObject("alarm"))
		);
	}
	
	fun saveNotification(context: Context, notification: AlarmNotification) {
		val notification_obj = notificationToJSONObject(notification).toString();
        context.getSharedPreferences(NOTIFICATION_PREFS, Context.MODE_PRIVATE).edit().putString(notification.id.toString(), notification_obj).apply();
	}
	
	fun getNotification(context: Context, id: Int): AlarmNotification {
		val prefs = context.getSharedPreferences(NOTIFICATION_PREFS, Context.MODE_PRIVATE);

		val notificationString = prefs.getString(id.toString(), null) ?: throw IllegalArgumentException("Notification $id not found");

		val notification_obj = JSONObject(notificationString);

		return JSONObjectToNotification(notification_obj);
	}

	fun getAllNotifications(context: Context): List<AlarmNotification> {
		val prefs = context.getSharedPreferences(NOTIFICATION_PREFS, Context.MODE_PRIVATE)

		return prefs.all.keys.map { key ->
			getNotification(context, key.toInt())
		}
	}

	fun removeNotification(context: Context, id: Int) {
		context.getSharedPreferences(NOTIFICATION_PREFS, Context.MODE_PRIVATE).edit().remove(id.toString()).apply();
	}
}