package veera.subbiah.remote.notifications.core

import android.content.Context
import android.util.Log
import org.json.JSONArray
import veera.subbiah.remote.notifications.data.KeyStore
import java.lang.Exception

object PkgManager {
    const val NOTIFCATION_PREF = "notification_pref"
    private val savedNotificationPref: HashSet<String> = HashSet()

    fun init(context: Context) {
        try {
            val prefs = JSONArray(KeyStore.read(context, NOTIFCATION_PREF, "[]"))
            for (i in 0 until prefs.length()) {
                savedNotificationPref.add(prefs.getString(i))
            }
        } catch (e: Exception) {
            Log.e("Utils", "getSavedNotificationPref", e)
        }
    }

    fun getSavedNotificationPref(): HashSet<String> {
        return savedNotificationPref
    }

    fun setNotificationPref(context: Context, pkgName: String, shouldAdd: Boolean) {
        if(shouldAdd) {
            savedNotificationPref.add(pkgName)
        } else {
            savedNotificationPref.remove(pkgName)
        }
        updateKeyStore(context)
    }

    private fun updateKeyStore(context: Context) {
        val temp = JSONArray()
        for(pkg in savedNotificationPref) {
            temp.put(pkg)
        }

        KeyStore.write(context, NOTIFCATION_PREF, temp.toString())
    }
}