package dev.heedlesssoap.alarmmodule;

import android.content.ContentUris
import android.content.Context
import android.media.AudioAttributes
import android.media.Ringtone
import android.media.RingtoneManager
import android.net.Uri

object Ringtone {
	private var preview: Ringtone? = null;
	
	fun getRingtones(context: Context): List<Map<String, String>> {
		val manager = RingtoneManager(context).apply {
			setType(RingtoneManager.TYPE_ALARM)
		}
		val result = mutableListOf(mapOf("title" to "Default", "uri" to "default"))

		manager.cursor.use { cursor ->
			while (cursor.moveToNext()) {
			val id = cursor.getLong(RingtoneManager.ID_COLUMN_INDEX)
			val base = Uri.parse(cursor.getString(RingtoneManager.URI_COLUMN_INDEX))
			
			result.add(
				mapOf(
				"title" to cursor.getString(RingtoneManager.TITLE_COLUMN_INDEX),
				"uri" to ContentUris.withAppendedId(base, id).toString()
				)
			)
			}
		}
		
		return result
	}
	
	fun play(context: Context, stored: String) {
		preview?.stop()
      	preview = buildRingtone(context, stored).also { it.play() }
	}
	
	fun stop() {
		preview?.stop()
      	preview = null
	}
	
	private fun buildRingtone(context: Context, stored: String, loop: Boolean = false): Ringtone {
		val defaultUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM)
		val uri = if (stored == "default") defaultUri else Uri.parse(stored)

		val ringtone = RingtoneManager.getRingtone(context, uri)
			?: RingtoneManager.getRingtone(context, defaultUri)

		ringtone.audioAttributes = AudioAttributes.Builder()
			.setUsage(AudioAttributes.USAGE_ALARM)
			.setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
			.build()
		if (loop && android.os.Build.VERSION.SDK_INT >= 28) ringtone.isLooping = true
		
		return ringtone
	}
}