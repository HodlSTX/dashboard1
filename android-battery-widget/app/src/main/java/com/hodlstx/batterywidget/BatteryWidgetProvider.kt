package com.hodlstx.batterywidget

import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.BatteryManager
import android.widget.RemoteViews
import kotlin.math.roundToInt

/**
 * Home screen widget that displays battery percentage and charging ETAs.
 * Shows estimated time to reach 20%, 50%, 80%, and 100%.
 */
class BatteryWidgetProvider : AppWidgetProvider() {

    companion object {
        private val TARGETS = intArrayOf(20, 50, 80, 100)

        fun updateAllWidgets(context: Context) {
            val intent = Intent(context, BatteryWidgetProvider::class.java).apply {
                action = AppWidgetManager.ACTION_APPWIDGET_UPDATE
            }
            val manager = AppWidgetManager.getInstance(context)
            val ids = manager.getAppWidgetIds(
                ComponentName(context, BatteryWidgetProvider::class.java)
            )
            intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids)
            context.sendBroadcast(intent)
        }
    }

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        for (appWidgetId in appWidgetIds) {
            updateWidget(context, appWidgetManager, appWidgetId)
        }
    }

    override fun onEnabled(context: Context) {
        super.onEnabled(context)
        // Start the monitor service when first widget is added
        val intent = Intent(context, BatteryMonitorService::class.java)
        context.startForegroundService(intent)
    }

    override fun onDisabled(context: Context) {
        super.onDisabled(context)
        // Stop service when last widget is removed
        context.stopService(Intent(context, BatteryMonitorService::class.java))
    }

    private fun updateWidget(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetId: Int
    ) {
        val views = RemoteViews(context.packageName, R.layout.widget_battery)

        // Get current battery info
        val batteryIntent = context.registerReceiver(
            null,
            IntentFilter(Intent.ACTION_BATTERY_CHANGED)
        )

        val level = batteryIntent?.getIntExtra(BatteryManager.EXTRA_LEVEL, -1) ?: -1
        val scale = batteryIntent?.getIntExtra(BatteryManager.EXTRA_SCALE, 100) ?: 100
        val status = batteryIntent?.getIntExtra(BatteryManager.EXTRA_STATUS, -1) ?: -1
        val isCharging = status == BatteryManager.BATTERY_STATUS_CHARGING ||
                status == BatteryManager.BATTERY_STATUS_FULL
        val percentage = (level * 100) / scale

        // Set battery percentage
        views.setTextViewText(R.id.tv_battery_percent, "$percentage%")

        // Set charging status
        val statusText = if (isCharging) "Charging" else "Not Charging"
        views.setTextViewText(R.id.tv_charging_status, statusText)

        // Set progress bar
        views.setProgressBar(R.id.progress_battery, 100, percentage, false)

        // Calculate ETAs
        val prefs = context.getSharedPreferences(
            BatteryMonitorService.PREFS_NAME,
            Context.MODE_PRIVATE
        )
        val chargeRate = prefs.getFloat(BatteryMonitorService.KEY_CHARGE_RATE, 0f)

        val etaBuilder = StringBuilder()

        if (isCharging && chargeRate > 0) {
            for (target in TARGETS) {
                if (percentage >= target) {
                    etaBuilder.appendLine("$target%  ✓ reached")
                } else {
                    val minutesLeft = ((target - percentage) / chargeRate).roundToInt()
                    etaBuilder.appendLine("$target%  ~${formatTime(minutesLeft)}")
                }
            }
        } else if (isCharging) {
            etaBuilder.append("Calculating charge rate...")
        } else {
            etaBuilder.append("Plug in to see charge ETAs")
        }

        views.setTextViewText(R.id.tv_eta_details, etaBuilder.toString().trim())

        appWidgetManager.updateAppWidget(appWidgetId, views)
    }

    private fun formatTime(minutes: Int): String {
        return when {
            minutes < 1 -> "<1 min"
            minutes < 60 -> "${minutes}m"
            else -> {
                val h = minutes / 60
                val m = minutes % 60
                if (m == 0) "${h}h" else "${h}h ${m}m"
            }
        }
    }
}
