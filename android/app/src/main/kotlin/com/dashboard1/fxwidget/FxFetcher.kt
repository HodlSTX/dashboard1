package com.dashboard1.fxwidget

import android.content.Context
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL

object FxFetcher {
    fun fetchUsdBrl(context: Context): Result<Double> {
        val base = FxPrefs.baseUrl(context)
        if (base.isBlank()) {
            return Result.failure(IllegalStateException("Base URL not configured"))
        }
        return try {
            val url = URL("$base/api/proxy/fx/usd-brl")
            val conn = (url.openConnection() as HttpURLConnection).apply {
                requestMethod = "GET"
                connectTimeout = 10_000
                readTimeout = 10_000
            }
            try {
                val code = conn.responseCode
                if (code !in 200..299) {
                    FxPrefs.setLastError(context, "HTTP $code")
                    return Result.failure(RuntimeException("HTTP $code"))
                }
                val body = conn.inputStream.bufferedReader().use { it.readText() }
                val json = JSONObject(body)
                val rate = json.getDouble("rate")
                val ts = json.optLong("timestamp", System.currentTimeMillis())
                FxPrefs.setLastResult(context, rate, ts)
                Result.success(rate)
            } finally {
                conn.disconnect()
            }
        } catch (t: Throwable) {
            FxPrefs.setLastError(context, t.message ?: t.javaClass.simpleName)
            Result.failure(t)
        }
    }
}
