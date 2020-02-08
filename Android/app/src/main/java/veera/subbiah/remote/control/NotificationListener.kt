package veera.subbiah.remote.control

import android.app.Notification
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log
import org.json.JSONObject
import veera.subbiah.remote.control.core.PkgManager
import veera.subbiah.remote.control.core.api.ApiHandler

class NotificationListener: NotificationListenerService() {
    companion object {
        private const val TAG = "NotificationListener"
    }

    override fun onNotificationPosted(sbn: StatusBarNotification) {
        super.onNotificationPosted(sbn)
        val notification: Notification? = sbn.notification
        if(PkgManager.getSavedNotificationPref().contains(sbn.packageName)) {
            val packageName = sbn.packageName
            val title     = notification?.extras?.getCharSequence(Notification.EXTRA_TITLE).toString()
            val bigText   = notification?.extras?.getCharSequence(Notification.EXTRA_BIG_TEXT).toString()
            val smallText = notification?.extras?.getCharSequence(Notification.EXTRA_TEXT).toString()

            val payload = JSONObject()
            val notificationData = JSONObject()
            notificationData.put("source", packageName)
            notificationData.put("title", title)
            notificationData.put("bigText", bigText)
            notificationData.put("smallText", smallText)
            payload.put("data", notificationData)

            val url = getString(R.string.base_url) + getString(R.string.send_message)
            val apiHandlerTask = ApiHandler.ApiHandlerTask()
            apiHandlerTask.execute(url, payload.toString(), "post")
        }
    }
}