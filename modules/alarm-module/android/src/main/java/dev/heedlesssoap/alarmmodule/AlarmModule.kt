package dev.heedlesssoap.alarmmodule

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

import android.content.Context

class AlarmModule : Module() {
    override fun definition() = ModuleDefinition {
        Name("AlarmModule")
        
        AsyncFunction("scheduleAlarm") { 
                alarm: Alarm
            ->
                AlarmScheduler.schedule(
                    appContext.reactContext ?: throw Exception("React context unavailable"),
                    alarm
                );
        }
        
        AsyncFunction("cancelAlarm") { 
                id: Int
            ->
                AlarmScheduler.cancel(
                    appContext.reactContext ?: throw Exception("React context unavailable"),
                    id
                );
        }
            
        AsyncFunction("scheduleAlarmNotification") { 
                notification: AlarmNotification
            ->
                AlarmNotificationScheduler.schedule(
                    appContext.reactContext ?: throw Exception("React context unavailable"),
                    notification
                );
        }
  }
}
