package dev.heedlesssoap.alarmmodule;

import android.app.*
import android.content.Context
import android.content.Intent
import android.media.RingtoneManager
import android.media.Ringtone
import android.media.MediaPlayer
import android.media.AudioAttributes
import android.os.*

class AlarmRingingService : Service() {
	private var mediaPlayer: MediaPlayer? = null
    private var vibrator: Vibrator? = null
    
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val id = intent?.getIntExtra("id", 0) ?: 0;
        val label = intent?.getStringExtra("label") ?: "Alarm";
        
        val ringtoneURI = RingtoneManager.getActualDefaultRingtoneUri(this, RingtoneManager.TYPE_ALARM);
        mediaPlayer = MediaPlayer().apply {
            setAudioAttributes(
                AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_ALARM)
                    .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                    .build()
            )
            
            setDataSource(this@AlarmRingingService, ringtoneURI)
            
            prepare()
            start()
        };
        
        val vibratorManager = getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as VibratorManager;
        vibrator = vibratorManager.getDefaultVibrator();
        vibrator?.vibrate(VibrationEffect.createWaveform(longArrayOf(0, 1000, 1000), 0));
        
        val ringIntent = Intent(this, AlarmRingActivity::class.java)
			.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
			.putExtra("id", id)
			.putExtra("label", label);
			
		startActivity(ringIntent);
		
		return START_STICKY
    }
    
    override fun onDestroy() {
        mediaPlayer?.stop();
        vibrator?.cancel();
        super.onDestroy();
    }
    
    override fun onBind(intent: Intent?): IBinder? = null
}