package veera.subbiah.remote.notifications.data

import android.util.Log
import org.json.JSONException
import org.json.JSONObject

/**
 * Created by Veera.Subbiah on 23/08/17.
 */

class ListModel {
    private var appName = ""
    private var packageName = ""
    private var selected = false


    fun getPackageName(): String {
        return packageName
    }

    fun setPackageName(packageName: String): ListModel {
        this.packageName = packageName
        return this
    }

    fun getAppName(): String {
        return appName
    }

    fun setAppName(appName: String): ListModel {
        this.appName = appName
        return this
    }

    fun isSelected(): Boolean {
        return selected
    }

    fun setSelected(selected: Boolean): ListModel {
        this.selected = selected
        return this
    }

    override fun toString(): String {
        val jsonObject = JSONObject()
        try {
            jsonObject.put("packageName", getPackageName())
            jsonObject.put("appName", getAppName())
            jsonObject.put("selected", isSelected())
        } catch (e: JSONException) {
            Log.e(TAG, "This Happened: ", e)
        }

        return jsonObject.toString()
    }

    override fun equals(other: Any?): Boolean {
        return other != null && javaClass == other.javaClass && javaClass.cast(other).getPackageName().equals(getPackageName(), ignoreCase = true)
    }

    companion object {
        private val TAG = "ListModel"

        fun fromString(payload: String): ListModel {
            try {
                val jsonObject = JSONObject(payload)
                return ListModel()
                    .setSelected(jsonObject.getBoolean("selected"))
                    .setAppName(jsonObject.getString("appName"))
                    .setPackageName(jsonObject.getString("packageName"))
            } catch (e: JSONException) {
                Log.e(TAG, "This Happened: ", e)
            }

            return ListModel()
        }
    }
}