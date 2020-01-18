package veera.subbiah.remote.notifications

import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.provider.Settings
import android.util.Log
import android.view.View
import android.widget.AdapterView
import android.widget.CompoundButton
import android.widget.ListView
import androidx.appcompat.app.AppCompatActivity
import veera.subbiah.remote.notifications.core.PkgManager
import veera.subbiah.remote.notifications.data.ListModel
import veera.subbiah.remote.notifications.ui.AppListAdapter
import veera.subbiah.remote.notifications.ui.AppListAdapter.ViewHolder

class MainActivity : AppCompatActivity(), AdapterView.OnItemClickListener,
    CompoundButton.OnCheckedChangeListener {

    companion object {
        private const val TAG = "MainActivity"
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        if(canAccessNotifications(this)) {
            initHomePage(savedInstanceState)
        } else {
            applicationContext.startActivity(Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS))
        }
    }

    private fun initHomePage(savedInstanceState: Bundle?) {
        val packages = getInstalledPackages(this)

        Log.d(TAG, "notifications enabled")
        Log.d(TAG, "package list size: ${packages.size}")

        initializeListView(packages)
    }

    private fun initializeListView(installedPackages: List<ListModel>) {
        val listView = findViewById<ListView>(R.id.app_list)

        val adapter = AppListAdapter(this, installedPackages)
        listView.onItemClickListener = this
        listView.adapter = adapter
    }

    override fun onItemClick(parent: AdapterView<*>, view: View, position: Int, id: Long) {
        val holder = view.tag as ViewHolder
        val newStatus = holder.checkBox?.isChecked?.not() ?: false

        holder.checkBox?.setOnCheckedChangeListener(null)
        toggleNotificationPreference(holder.checkBox, newStatus)
        holder.checkBox?.setOnCheckedChangeListener(this)
    }

    override fun onCheckedChanged(buttonView: CompoundButton?, isChecked: Boolean) {
        toggleNotificationPreference(buttonView, isChecked)
    }

    private fun toggleNotificationPreference(buttonView: CompoundButton?, isChecked: Boolean) {
        val listModel = buttonView?.tag as ListModel? ?: return

        buttonView?.isChecked = isChecked
        listModel.setSelected(isChecked)

        PkgManager.setNotificationPref(this, listModel.getPackageName(), isChecked)
    }
}
