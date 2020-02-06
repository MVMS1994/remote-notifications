package veera.subbiah.remote.control

import android.app.Application
import com.google.firebase.analytics.FirebaseAnalytics
import com.google.firebase.auth.FirebaseAuth
import veera.subbiah.remote.control.core.PkgManager
import veera.subbiah.remote.control.core.analytics.Tracker

class RemoteControl: Application() {
    override fun onCreate() {
        super.onCreate()
        PkgManager.init(this)
        initFirebase()
    }

    private fun initFirebase() {
        FirebaseAnalytics.getInstance(this)
        FirebaseAuth.getInstance()
        Tracker.sessionUser(this)
    }
}