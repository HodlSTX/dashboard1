package com.dashboard1.fxwidget

import android.appwidget.AppWidgetManager
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

class ConfigActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_config)

        val input = findViewById<EditText>(R.id.input_base_url)
        val save = findViewById<Button>(R.id.button_save)
        val status = findViewById<TextView>(R.id.text_status)

        input.setText(FxPrefs.baseUrl(this))

        save.setOnClickListener {
            val url = input.text.toString().trim()
            if (url.isBlank()) {
                Toast.makeText(this, "Enter a base URL", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }
            FxPrefs.setBaseUrl(this, url)
            FxWidgetProvider.schedulePeriodic(this)
            FxWidgetProvider.enqueueOneShot(this)
            FxWidgetProvider.updateAll(
                this,
                AppWidgetManager.getInstance(this),
                intArrayOf()
            )
            Toast.makeText(this, "Saved. Refreshing widget…", Toast.LENGTH_SHORT).show()
            status.text = "Saved: ${FxPrefs.baseUrl(this)}"
        }
    }
}
