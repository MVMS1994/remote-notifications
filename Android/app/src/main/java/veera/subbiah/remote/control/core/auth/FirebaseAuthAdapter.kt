package veera.subbiah.remote.control.core.auth

import android.app.Activity
import android.content.Context
import com.firebase.ui.auth.AuthUI

object FirebaseAuthAdapter {
    const val RC_SIGN_IN: Int = 7

    fun signIn(activity: Activity) {
        val providers = arrayListOf(AuthUI.IdpConfig.GoogleBuilder().build())
        activity.startActivityForResult(AuthUI.getInstance()
            .createSignInIntentBuilder()
            .setAvailableProviders(providers)
            .build(), RC_SIGN_IN)
    }

    fun signOut(context: Context, runnable: Runnable) {
        AuthUI.getInstance()
            .signOut(context)
            .addOnCompleteListener { runnable.run() }
    }
}