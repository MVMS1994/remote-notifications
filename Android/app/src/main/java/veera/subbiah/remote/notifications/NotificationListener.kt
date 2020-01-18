package veera.subbiah.remote.notifications

import android.app.Notification
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log
import veera.subbiah.remote.notifications.core.PkgManager

class NotificationListener: NotificationListenerService() {
    companion object {
        private const val TAG = "NotificationListener"
    }

    override fun onNotificationPosted(sbn: StatusBarNotification) {
        super.onNotificationPosted(sbn)
        val notification: Notification? = sbn.notification
        if(PkgManager.getSavedNotificationPref().contains(sbn.packageName)) {
            Log.d(TAG, sbn.packageName)
            Log.d(TAG, notification?.extras?.getCharSequence(Notification.EXTRA_TITLE).toString())
            Log.d(TAG, notification?.extras?.getCharSequence(Notification.EXTRA_TEXT).toString())
            Log.d(TAG, notification?.extras?.getCharSequence(Notification.EXTRA_BIG_TEXT).toString())
        }
    }
}