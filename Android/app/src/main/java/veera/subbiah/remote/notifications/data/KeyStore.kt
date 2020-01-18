package veera.subbiah.remote.notifications.data

import android.annotation.SuppressLint
import android.content.Context
import veera.subbiah.remote.notifications.R


object KeyStore {
    @SuppressLint("ApplySharedPref")
    fun write(context: Context, key: String, value: String) {
        val sharedPreferences =
            context.getSharedPreferences(context.getString(R.string.app_name), Context.MODE_PRIVATE)
        val editor = sharedPreferences.edit()
        editor.putString(key, value)
        editor.commit()
    }

    fun read(context: Context, key: String, defaultValue: String): String? {
        val sharedPreferences =
            context.getSharedPreferences(context.getString(R.string.app_name), Context.MODE_PRIVATE)
        return sharedPreferences.getString(key, defaultValue)
    }
}