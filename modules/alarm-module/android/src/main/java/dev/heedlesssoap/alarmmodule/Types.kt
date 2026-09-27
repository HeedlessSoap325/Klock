package dev.heedlesssoap.alarmmodule;

import expo.modules.kotlin.records.Record
import expo.modules.kotlin.records.Field

data class Alarm (
	@Field val id: Int,
	@Field val triggerAt: Long,
	@Field val label: String,
	@Field val group: String,
) : Record;

data class AlarmNotification (
	@Field val id: Int,
	@Field val delay: Long,
	@Field val alarm: Alarm,
) : Record;