# Default proguard rules for Battery Widget
-keepclassmembers class * extends android.appwidget.AppWidgetProvider {
    public void onUpdate(...);
}
