package com.hodlstx.batterywidget

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.BatteryManager
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat

/**
 * Foreground service that monitors battery level changes while charging
 * and calculates the charge rate to estimate time-to-target.
 */
class BatteryMonitorService : Service() {

    companion object {
        const val CHANNEL_ID = "battery_monitor_channel"
        const val NOTIFICATION_ID = 1001
        const val PREFS_NAME = "battery_widget_prefs"
        const val KEY_CHARGE_RATE = "charge_rate_per_min"
        const val KEY_LAST_LEVEL = "last_battery_level"
        const val KEY_LAST_TIME = "last_battery_time"
        const val KEY_IS_CHARGING = "is_charging"
    }

    private var batteryReceiver: BroadcastReceiver? = null

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
        startForeground(NOTIFICATION_ID, buildNotification("Monitoring battery..."))
        registerBatteryReceiver()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        return START_STICKY
    }

    override fun onDestroy() {
        super.onDestroy()
        batteryReceiver?.let { unregisterReceiver(it) }
    }

    private fun registerBatteryReceiver() {
        batteryReceiver = object : BroadcastReceiver() {
            override fun onReceive(context: Context, intent: Intent) {
                processBatteryUpdate(intent)
            }
        }
        val filter = IntentFilter().apply {
            addAction(Intent.ACTION_BATTERY_CHANGED)
        }
        registerReceiver(batteryReceiver, filter)
    }

    private fun processBatteryUpdate(intent: Intent) {
        val level = intent.getIntExtra(BatteryManager.EXTRA_LEVEL, -1)
        val scale = intent.getIntExtra(BatteryManager.EXTRA_SCALE, 100)
        val status = intent.getIntExtra(BatteryManager.EXTRA_STATUS, -1)
        val isCharging = status == BatteryManager.BATTERY_STATUS_CHARGING ||
                status == BatteryManager.BATTERY_STATUS_FULL
        val percentage = (level * 100) / scale
        val now = System.currentTimeMillis()

        val prefs = getSharedPreferences(PREFS_NAME, MODE_PRIVATE)
        val lastLevel = prefs.getInt(KEY_LAST_LEVEL, -1)
        val lastTime = prefs.getLong(KEY_LAST_TIME, 0L)

        prefs.edit()
            .putBoolean(KEY_IS_CHARGING, isCharging)
            .apply()

        if (isCharging && lastLevel >= 0 && lastTime > 0 && percentage > lastLevel) {
            val elapsedMin = (now - lastTime) / 60000.0
            if (elapsedMin > 0.5) { // at least 30 seconds between samples
                val rate = (percentage - lastLevel) / elapsedMin
                prefs.edit()
                    .putFloat(KEY_CHARGE_RATE, rate.toFloat())
                    .putInt(KEY_LAST_LEVEL, percentage)
                    .putLong(KEY_LAST_TIME, now)
                    .apply()
            }
        } else if (isCharging && (lastLevel < 0 || !prefs.getBoolean(KEY_IS_CHARGING, false))) {
            // Just started charging — record baseline
            prefs.edit()
                .putInt(KEY_LAST_LEVEL, percentage)
                .putLong(KEY_LAST_TIME, now)
                .apply()
        }

        // Update widget
        BatteryWidgetProvider.updateAllWidgets(this)

        // Update notification
        val notifText = if (isCharging) {
            val rate = prefs.getFloat(KEY_CHARGE_RATE, 0f)
            if (rate > 0) {
                val minTo100 = ((100 - percentage) / rate).toInt()
                "$percentage% charging — ~${formatTime(minTo100)} to full"
            } else {
                "$percentage% charging — calculating..."
            }
        } else {
            "$percentage% — not charging"
        }

        val nm = getSystemService(NotificationManager::class.java)
        nm.notify(NOTIFICATION_ID, buildNotification(notifText))
    }

    private fun formatTime(minutes: Int): String {
        return when {
            minutes < 1 -> "<1 min"
            minutes < 60 -> "${minutes}m"
            else -> "${minutes / 60}h ${minutes % 60}m"
        }
    }

    private fun createNotificationChannel() {
        val channel = NotificationChannel(
            CHANNEL_ID,
            "Battery Monitor",
            NotificationManager.IMPORTANCE_LOW
        ).apply {
            description = "Shows battery charging status"
        }
        getSystemService(NotificationManager::class.java).createNotificationChannel(channel)
    }

    private fun buildNotification(text: String): Notification {
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Battery Widget")
            .setContentText(text)
            .setSmallIcon(android.R.drawable.ic_lock_idle_charging)
            .setOngoing(true)
            .build()
    }
}
