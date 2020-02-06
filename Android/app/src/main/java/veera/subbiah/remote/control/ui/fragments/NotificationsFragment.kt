package veera.subbiah.remote.control.ui.fragments

import android.content.Intent
import android.os.Bundle
import android.provider.Settings
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.AdapterView
import android.widget.CompoundButton
import android.widget.ListView
import androidx.fragment.app.Fragment
import veera.subbiah.remote.control.R
import veera.subbiah.remote.control.canAccessNotifications
import veera.subbiah.remote.control.core.PkgManager
import veera.subbiah.remote.control.data.ListModel
import veera.subbiah.remote.control.getInstalledPackages
import veera.subbiah.remote.control.ui.adapters.AppListAdapter
import java.util.ArrayList

class NotificationsFragment: Fragment(), AdapterView.OnItemClickListener,
    CompoundButton.OnCheckedChangeListener {

    private lateinit var packages: ArrayList<ListModel>
    companion object {
        private const val TAG = "NotificationsFragment"
    }

    override fun onCreateView(i: LayoutInflater, c: ViewGroup?, state: Bundle?): View? {
        return i.inflate(R.layout.fragment_notifications, c, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        initHomePage(view, savedInstanceState)
    }

    override fun onResume() {
        super.onResume()
        if(!canAccessNotifications(this.requireActivity())) {
            requireActivity().startActivity(Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS))
        }
    }

    override fun onSaveInstanceState(outState: Bundle) {
        if (packages.isNotEmpty()) {
            outState.putParcelableArrayList("packages", packages)
        }

        super.onSaveInstanceState(outState)
    }

    @Suppress("UNUSED_PARAMETER")
    private fun initHomePage(view: View, state: Bundle?) {
        packages = state
                    ?. getParcelableArrayList("packages")
                    ?: getInstalledPackages(this.requireContext())

        Log.d(TAG, "notifications enabled")
        Log.d(TAG, "package list size: ${packages.size}")

        initializeListView(view, packages)
    }

    private fun initializeListView(view: View, installedPackages: List<ListModel>) {
        val listView = view.findViewById<ListView>(R.id.app_list)

        val adapter = AppListAdapter(
            this,
            installedPackages
        )
        listView.onItemClickListener = this
        listView.adapter = adapter
    }

    override fun onItemClick(parent: AdapterView<*>, view: View, position: Int, id: Long) {
        val holder = view.tag as AppListAdapter.ViewHolder
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

        PkgManager.setNotificationPref(this.requireContext(), listModel.getPackageName(), isChecked)
    }
}