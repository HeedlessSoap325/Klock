package dev.heedlesssoap.alarmmodule;

import android.app.*
import android.content.Context
import android.content.Intent
import android.media.RingtoneManager
import android.media.Ringtone
import android.media.MediaPlayer
import android.media.AudioAttributes
import android.os.*
import android.net.Uri 

class AlarmRingingService : Service() {
	private var mediaPlayer: MediaPlayer? = null
    private var vibrator: Vibrator? = null
    
    override fun onCreate() {
        super.onCreate()

        val channel = NotificationChannel(
            "alarm_ringing",
            "Alarm ringing",
            NotificationManager.IMPORTANCE_HIGH
        ).apply {
            description = "Notifications for ringing alarms"
        }

        val notificationManager = getSystemService(NotificationManager::class.java)

        notificationManager.createNotificationChannel(channel)

        val notification = Notification.Builder(this, "alarm_ringing")
            .setSmallIcon(android.R.drawable.ic_notification_overlay)
            .setContentTitle("Alarm")
            .setContentText("Alarm is ringing")
            .setPriority(Notification.PRIORITY_HIGH)
            .setCategory(Notification.CATEGORY_ALARM)
            .setOngoing(true)
            .build()

        startForeground(1001, notification);
    }
    
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val id = intent?.getIntExtra("alarm_id", 0) ?: 0;
        val label = intent?.getStringExtra("alarm_label") ?: "Alarm";
        val alarm = PreferencesWrapper.getAlarm(this, id);
        
        val fallbackUri: Uri = RingtoneManager.getActualDefaultRingtoneUri(this, RingtoneManager.TYPE_ALARM)
            ?: RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM)

        val ringtoneUri: Uri = if (alarm.ringtone == "default") fallbackUri else Uri.parse(alarm.ringtone)
        
        mediaPlayer = MediaPlayer().apply {
            setAudioAttributes(
                AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_ALARM)
                    .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                    .build()
            )
            
            setDataSource(this@AlarmRingingService, ringtoneUri)
            
            prepare()
            start()
        };
        
        if (alarm.vibrate) {
            val vibratorManager = getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as VibratorManager;
            vibrator = vibratorManager.getDefaultVibrator();
            vibrator?.vibrate(VibrationEffect.createWaveform(longArrayOf(0, 1000, 1000), 0));
        }
        
        val ringIntent = Intent(this, AlarmRingActivity::class.java)
			.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
			.putExtra("alarm_id", id)
			.putExtra("alarm_label", label)
			.putExtra("alarm_ringtone", alarm.ringtone)
			.putExtra("alarm_vibrate", alarm.vibrate);
			
		startActivity(ringIntent);
		
		return START_NOT_STICKY
    }
    
    override fun onDestroy() {
        mediaPlayer?.stop();
        vibrator?.cancel();
        super.onDestroy();
    }
    
    override fun onBind(intent: Intent?): IBinder? = null
}