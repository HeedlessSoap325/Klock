package dev.heedlesssoap.alarmmodule;

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

class DismissAlarmReceiver : BroadcastReceiver() {
	override fun onReceive(context: Context, intent: Intent) { 
		AlarmScheduler.cancel(context, intent.getIntExtra("alarm_id", 0));
	}
}