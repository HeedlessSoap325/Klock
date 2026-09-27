package dev.heedlesssoap.alarmmodule;

import android.content.*

class BootReceiver : BroadcastReceiver() {
	override fun onReceive(context: Context, intent: Intent) {
		AlarmScheduler.rescheduleAll(context);
		AlarmNotificationScheduler.rescheduleAll(context);
	}
}