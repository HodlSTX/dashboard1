package com.dashboard1.fxwidget

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.widget.RemoteViews
import androidx.work.Constraints
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.ExistingWorkPolicy
import androidx.work.NetworkType
import androidx.work.OneTimeWorkRequestBuilder
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.concurrent.TimeUnit

class FxWidgetProvider : AppWidgetProvider() {

    override fun onUpdate(context: Context, manager: AppWidgetManager, ids: IntArray) {
        updateAll(context, manager, ids)
        schedulePeriodic(context)
        enqueueOneShot(context)
    }

    override fun onEnabled(context: Context) {
        schedulePeriodic(context)
        enqueueOneShot(context)
    }

    override fun onDisabled(context: Context) {
        WorkManager.getInstance(context).cancelUniqueWork(PERIODIC_WORK)
    }

    override fun onReceive(context: Context, intent: Intent) {
        super.onReceive(context, intent)
        if (intent.action == ACTION_REFRESH) {
            enqueueOneShot(context)
        }
    }

    companion object {
        const val ACTION_REFRESH = "com.dashboard1.fxwidget.REFRESH"
        private const val PERIODIC_WORK = "fx_refresh_periodic"
        private const val ONESHOT_WORK = "fx_refresh_oneshot"

        fun updateAll(context: Context, manager: AppWidgetManager, ids: IntArray) {
            val views = RemoteViews(context.packageName, R.layout.widget_fx)
            val rate = FxPrefs.lastRate(context)
            val ts = FxPrefs.lastTimestamp(context)
            val baseUrl = FxPrefs.baseUrl(context)
            val err = FxPrefs.lastError(context)

            when {
                baseUrl.isBlank() -> {
                    views.setTextViewText(R.id.widget_rate, "—")
                    views.setTextViewText(R.id.widget_subtitle, "Tap to configure")
                }
                rate != null -> {
                    views.setTextViewText(
                        R.id.widget_rate,
                        "R$ %.2f".format(Locale.US, rate)
                    )
                    val sub = buildString {
                        append("1 USD")
                        if (ts > 0) {
                            append(" · ")
                            append(
                                SimpleDateFormat("HH:mm", Locale.getDefault())
                                    .format(Date(ts))
                            )
                        }
                    }
                    views.setTextViewText(R.id.widget_subtitle, sub)
                }
                else -> {
                    views.setTextViewText(R.id.widget_rate, "—")
                    views.setTextViewText(R.id.widget_subtitle, err ?: "Loading…")
                }
            }

            val tapIntent = Intent(context, ConfigActivity::class.java)
                .setFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            val tapPi = PendingIntent.getActivity(
                context, 0, tapIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            views.setOnClickPendingIntent(R.id.widget_root, tapPi)

            val refreshIntent = Intent(context, FxWidgetProvider::class.java)
                .setAction(ACTION_REFRESH)
            val refreshPi = PendingIntent.getBroadcast(
                context, 0, refreshIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            views.setOnClickPendingIntent(R.id.widget_refresh, refreshPi)

            if (ids.isEmpty()) {
                manager.updateAppWidget(
                    ComponentName(context, FxWidgetProvider::class.java),
                    views
                )
            } else {
                manager.updateAppWidget(ids, views)
            }
        }

        fun schedulePeriodic(context: Context) {
            val req = PeriodicWorkRequestBuilder<FxRefreshWorker>(15, TimeUnit.MINUTES)
                .setConstraints(
                    Constraints.Builder()
                        .setRequiredNetworkType(NetworkType.CONNECTED)
                        .build()
                )
                .build()
            WorkManager.getInstance(context).enqueueUniquePeriodicWork(
                PERIODIC_WORK,
                ExistingPeriodicWorkPolicy.UPDATE,
                req
            )
        }

        fun enqueueOneShot(context: Context) {
            val req = OneTimeWorkRequestBuilder<FxRefreshWorker>()
                .setConstraints(
                    Constraints.Builder()
                        .setRequiredNetworkType(NetworkType.CONNECTED)
                        .build()
                )
                .build()
            WorkManager.getInstance(context).enqueueUniqueWork(
                ONESHOT_WORK,
                ExistingWorkPolicy.REPLACE,
                req
            )
        }
    }
}
