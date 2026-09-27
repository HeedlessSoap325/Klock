package dev.heedlesssoap.alarmmodule

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import org.json.JSONObject

class AlarmReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val PREFS = "alarms";
        
        val id = intent.getIntExtra("id", 0);
        val prefs = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
    	val alarm_obj = JSONObject(prefs.getString(id.toString(), "") as String);
    	
        val alarmRingService = Intent(context, AlarmRingingService::class.java)
            .putExtra("id", alarm_obj.getInt("id"))
            .putExtra("label", alarm_obj.getString("label"));
            
    
        context.startForegroundService(alarmRingService);
    }
}