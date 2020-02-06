package veera.subbiah.remote.control.data

import android.os.Parcel
import android.os.Parcelable
import android.util.Log
import org.json.JSONException
import org.json.JSONObject

/**
 * Created by Veera.Subbiah on 23/08/17.
 */

class ListModel() : Parcelable {
    private var appName = ""
    private var packageName = ""
    private var selected = false

    constructor(parcel: Parcel) : this() {
        appName = parcel.readString()?:""
        packageName = parcel.readString()?:""
        selected = parcel.readByte() != 0.toByte()
    }


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

    @Suppress("RECEIVER_NULLABILITY_MISMATCH_BASED_ON_JAVA_ANNOTATIONS")
    override fun equals(other: Any?): Boolean {
        return other != null && javaClass == other.javaClass && javaClass.cast(other).getPackageName().equals(getPackageName(), ignoreCase = true)
    }


    override fun writeToParcel(parcel: Parcel, flags: Int) {
        parcel.writeString(appName)
        parcel.writeString(packageName)
        parcel.writeByte(if (selected) 1 else 0)
    }

    override fun describeContents(): Int {
        return 0
    }

    override fun hashCode(): Int {
        var result = appName.hashCode()
        result = 31 * result + packageName.hashCode()
        result = 31 * result + selected.hashCode()
        return result
    }

    companion object CREATOR : Parcelable.Creator<ListModel> {
        private val TAG = "ListModel"

        override fun createFromParcel(parcel: Parcel): ListModel {
            return ListModel(parcel)
        }

        override fun newArray(size: Int): Array<ListModel?> {
            return arrayOfNulls(size)
        }

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