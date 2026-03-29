package com.hodlstx.batterywidget

import android.content.Intent
import android.content.IntentFilter
import android.os.BatteryManager
import android.os.Bundle
import android.widget.ProgressBar
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import kotlin.math.roundToInt

/**
 * Main activity — shows current battery info and instructions
 * for adding the widget to the home screen.
 */
class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // Start the monitoring service
        startForegroundService(Intent(this, BatteryMonitorService::class.java))

        updateUI()
    }

    override fun onResume() {
        super.onResume()
        updateUI()
    }

    private fun updateUI() {
        val batteryIntent = registerReceiver(null, IntentFilter(Intent.ACTION_BATTERY_CHANGED))

        val level = batteryIntent?.getIntExtra(BatteryManager.EXTRA_LEVEL, -1) ?: -1
        val scale = batteryIntent?.getIntExtra(BatteryManager.EXTRA_SCALE, 100) ?: 100
        val status = batteryIntent?.getIntExtra(BatteryManager.EXTRA_STATUS, -1) ?: -1
        val plugged = batteryIntent?.getIntExtra(BatteryManager.EXTRA_PLUGGED, 0) ?: 0
        val temp = batteryIntent?.getIntExtra(BatteryManager.EXTRA_TEMPERATURE, 0) ?: 0
        val voltage = batteryIntent?.getIntExtra(BatteryManager.EXTRA_VOLTAGE, 0) ?: 0

        val isCharging = status == BatteryManager.BATTERY_STATUS_CHARGING ||
                status == BatteryManager.BATTERY_STATUS_FULL
        val percentage = (level * 100) / scale

        // Battery percentage
        findViewById<TextView>(R.id.tv_main_percent).text = "$percentage%"
        findViewById<ProgressBar>(R.id.progress_main_battery).progress = percentage

        // Charging status
        val statusStr = when {
            status == BatteryManager.BATTERY_STATUS_FULL -> "Full"
            isCharging -> "Charging"
            else -> "Not Charging"
        }
        val plugStr = when (plugged) {
            BatteryManager.BATTERY_PLUGGED_AC -> "AC"
            BatteryManager.BATTERY_PLUGGED_USB -> "USB"
            BatteryManager.BATTERY_PLUGGED_WIRELESS -> "Wireless"
            else -> "—"
        }
        findViewById<TextView>(R.id.tv_main_status).text = "$statusStr ($plugStr)"

        // Temperature & voltage
        val tempC = temp / 10.0
        val voltageV = voltage / 1000.0
        findViewById<TextView>(R.id.tv_main_details).text =
            "Temperature: ${tempC}°C\nVoltage: ${voltageV}V"

        // ETA section
        val prefs = getSharedPreferences(BatteryMonitorService.PREFS_NAME, MODE_PRIVATE)
        val chargeRate = prefs.getFloat(BatteryMonitorService.KEY_CHARGE_RATE, 0f)
        val targets = intArrayOf(20, 50, 80, 100)
        val etaView = findViewById<TextView>(R.id.tv_main_eta)

        if (isCharging && chargeRate > 0) {
            val sb = StringBuilder()
            for (target in targets) {
                if (percentage >= target) {
                    sb.appendLine("  $target%   ✓ reached")
                } else {
                    val min = ((target - percentage) / chargeRate).roundToInt()
                    sb.appendLine("  $target%   ~${formatTime(min)}")
                }
            }
            etaView.text = sb.toString().trim()
        } else if (isCharging) {
            etaView.text = "Calculating charge rate...\nKeep charging for a minute."
        } else {
            etaView.text = "Plug in your charger to see ETAs."
        }
    }

    private fun formatTime(minutes: Int): String {
        return when {
            minutes < 1 -> "<1 min"
            minutes < 60 -> "${minutes} min"
            else -> {
                val h = minutes / 60
                val m = minutes % 60
                if (m == 0) "${h}h" else "${h}h ${m}m"
            }
        }
    }
}
