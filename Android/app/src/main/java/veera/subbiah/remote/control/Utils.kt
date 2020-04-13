package veera.subbiah.remote.control

import android.content.Context
import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import android.provider.Settings
import android.util.Log
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseUser
import veera.subbiah.remote.control.core.PkgManager
import veera.subbiah.remote.control.data.ListModel
import java.math.BigInteger
import java.security.MessageDigest
import java.util.*
import kotlin.collections.ArrayList

const val ENABLED_APPS = "enabled_notification_listeners"

fun canAccessNotifications(context: Context): Boolean {
    val enabledAppList = Settings.Secure.getString(context.contentResolver, ENABLED_APPS)
    Log.d("app list", enabledAppList)
    Log.d("package name", context.packageName)
    return enabledAppList?.contains(context.packageName)?: false
}

fun getInstalledPackages(context: Context): java.util.ArrayList<ListModel> {
    val pm = context.packageManager
    val apps = pm.getInstalledApplications(PackageManager.GET_META_DATA)?: mutableListOf()
    val savedPref = PkgManager.getSavedNotificationPref()

    val arrayAppListModel: ArrayList<ListModel> = ArrayList()
    for (app in apps) {
        arrayAppListModel.add(
            ListModel()
                .setAppName(getAppName(context, app))
                .setPackageName(app.packageName)
                .setSelected(savedPref.contains(app.packageName)))
    }

    sortAppList(arrayAppListModel)
    return arrayAppListModel
}

fun sortAppList(appList: ArrayList<ListModel>) {
    appList.sortWith(compareBy({ !it.isSelected() }, { it.getAppName().toLowerCase(Locale.US) }))
}

fun getAppName(context: Context, applicationInfo: ApplicationInfo?): String {
    return context.packageManager.getApplicationLabel(applicationInfo)?.toString()
        ?: applicationInfo?.packageName
        ?: "UNKNOWN APP"
}

fun getAppInfo(context: Context, packageName: String): ApplicationInfo? {
    return context.packageManager.getApplicationInfo(packageName, 0)
}

fun getUser(): FirebaseUser? {
    return FirebaseAuth.getInstance().currentUser
}

val String.md5: String?
    get() {
        val md: MessageDigest = MessageDigest.getInstance("MD5")
        val messageDigest: ByteArray = md.digest(this.toByteArray())
        val no = BigInteger(1, messageDigest)
        var hashText: String = no.toString(16)
        while (hashText.length < 32) {
            hashText = "0$hashText"
        }
        return hashText
    }