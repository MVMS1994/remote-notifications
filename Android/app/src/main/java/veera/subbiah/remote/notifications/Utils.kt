package veera.subbiah.remote.notifications

import android.content.Context
import android.provider.Settings
import android.util.Log
import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import veera.subbiah.remote.notifications.core.PkgManager
import veera.subbiah.remote.notifications.data.ListModel

const val ENABLED_APPS = "enabled_notification_listeners"

fun canAccessNotifications(context: Context): Boolean {
    val enabledAppList = Settings.Secure.getString(context.contentResolver, ENABLED_APPS)
    Log.d("app list", enabledAppList)
    Log.d("package name", context.packageName)
    return enabledAppList?.contains(context.packageName)?: false
}

fun getInstalledPackages(context: Context): List<ListModel> {
    val pm = context.packageManager
    val apps = pm.getInstalledApplications(PackageManager.GET_META_DATA)?: mutableListOf()
    val savedPref = PkgManager.getSavedNotificationPref()

    val arrayAppListModel: ArrayList<ListModel> = ArrayList()
    for (app in apps) {
        arrayAppListModel.add(
            ListModel()
                .setAppName(getAppName(context, app))
                .setPackageName(app.packageName)
                .setSelected(savedPref.contains(app.packageName))
        )
    }

    arrayAppListModel.sortWith(compareBy({ !it.isSelected() }, { it.getAppName() }))
    return arrayAppListModel
}

fun getAppName(context: Context, applicationInfo: ApplicationInfo?): String {
    return context.packageManager.getApplicationLabel(applicationInfo)?.toString()
        ?: applicationInfo?.packageName
        ?: "UNKNOWN APP"
}

