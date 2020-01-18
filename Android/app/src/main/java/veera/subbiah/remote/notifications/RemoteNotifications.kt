package veera.subbiah.remote.notifications

import android.app.Application
import veera.subbiah.remote.notifications.core.PkgManager

class RemoteNotifications: Application() {
    override fun onCreate() {
        super.onCreate()
        PkgManager.init(this)
    }
}