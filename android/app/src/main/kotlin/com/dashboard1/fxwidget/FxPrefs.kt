package com.dashboard1.fxwidget

import android.content.Context

object FxPrefs {
    private const val NAME = "fx_widget_prefs"
    private const val KEY_BASE_URL = "base_url"
    private const val KEY_LAST_RATE = "last_rate"
    private const val KEY_LAST_TS = "last_ts"
    private const val KEY_LAST_ERROR = "last_error"

    private fun prefs(context: Context) =
        context.getSharedPreferences(NAME, Context.MODE_PRIVATE)

    fun baseUrl(context: Context): String =
        prefs(context).getString(KEY_BASE_URL, "")?.trim().orEmpty()

    fun setBaseUrl(context: Context, url: String) {
        prefs(context).edit()
            .putString(KEY_BASE_URL, url.trim().trimEnd('/'))
            .apply()
    }

    fun setLastResult(context: Context, rate: Double, ts: Long) {
        prefs(context).edit()
            .putFloat(KEY_LAST_RATE, rate.toFloat())
            .putLong(KEY_LAST_TS, ts)
            .remove(KEY_LAST_ERROR)
            .apply()
    }

    fun setLastError(context: Context, message: String) {
        prefs(context).edit().putString(KEY_LAST_ERROR, message).apply()
    }

    fun lastRate(context: Context): Double? {
        val p = prefs(context)
        if (!p.contains(KEY_LAST_RATE)) return null
        return p.getFloat(KEY_LAST_RATE, 0f).toDouble()
    }

    fun lastTimestamp(context: Context): Long =
        prefs(context).getLong(KEY_LAST_TS, 0L)

    fun lastError(context: Context): String? =
        prefs(context).getString(KEY_LAST_ERROR, null)
}
