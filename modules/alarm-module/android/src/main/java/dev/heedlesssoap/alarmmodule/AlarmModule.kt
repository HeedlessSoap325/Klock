package dev.heedlesssoap.alarmmodule

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

import android.content.Context

class AlarmModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("AlarmModule")
    
    AsyncFunction("scheduleAlarm") { 
            id: Int,
            triggerAtMillis: Long,
            label: String
        ->
            AlarmScheduler.schedule(
                appContext.reactContext ?: throw Exception("React context unavailable"),
                id,
                triggerAtMillis,
                label
            )
        }
  }
}
