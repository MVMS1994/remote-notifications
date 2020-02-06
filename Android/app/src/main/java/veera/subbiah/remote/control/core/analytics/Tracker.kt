package veera.subbiah.remote.control.core.analytics

import android.content.Context
import com.google.firebase.analytics.FirebaseAnalytics
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.crashlytics.FirebaseCrashlytics

object Tracker {
    fun sessionUser(context: Context) {
        val firebaseAuth = FirebaseAuth.getInstance()
        val firebaseAnalytics = FirebaseAnalytics.getInstance(context)
        val crashlytics = FirebaseCrashlytics.getInstance()

        val user = firebaseAuth.currentUser
        if(user != null) {
            firebaseAnalytics.setUserId(user.uid)
            crashlytics.setUserId(user.uid)
        }
    }
}