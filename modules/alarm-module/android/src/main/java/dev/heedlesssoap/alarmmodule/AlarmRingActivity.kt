package dev.heedlesssoap.alarmmodule;

import android.app.KeyguardManager
import android.content.Context
import android.content.Intent
import android.os.*
import androidx.appcompat.app.AppCompatActivity
import java.time.LocalTime
import java.time.format.DateTimeFormatter

class AlarmRingActivity : AppCompatActivity() {
	override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState);

        setShowWhenLocked(true);
        setTurnScreenOn(true);
        (getSystemService(Context.KEYGUARD_SERVICE) as KeyguardManager)
            .requestDismissKeyguard(this, null);
    

        val label = intent.getStringExtra("alarm_label") ?: "Alarm";
        val id = intent.getIntExtra("alarm_id", 0);
        val ringtone = intent.getStringExtra("alarm_ringtone") ?: "default";
        val vibrate = intent.getBooleanExtra("alarm_vibrate", true);

        // Simplest version: native layout with Snooze/Dismiss buttons.
        setContentView(R.layout.activity_alarm_ringing)
        
        findViewById<android.widget.TextView>(R.id.alarmLabel).text = label;
        
        val currentTime = LocalTime.now()
            .format(DateTimeFormatter.ofPattern("HH:mm"))
        
        findViewById<android.widget.TextView>(R.id.alarmTime).text = currentTime;
        
        findViewById<android.widget.TextView>(R.id.dismissButton).setOnClickListener {
            stopService(Intent(this, AlarmRingingService::class.java));
            finish();
        };
        
        findViewById<android.widget.TextView>(R.id.snoozeButton).setOnClickListener {
            stopService(Intent(this, AlarmRingingService::class.java));
            
            val snoozedAlarm = Alarm(id, System.currentTimeMillis() + 5 * 60 * 1000, label, "", ringtone, vibrate);
            AlarmScheduler.schedule(this, snoozedAlarm);
            
            finish();
        };
    }
}