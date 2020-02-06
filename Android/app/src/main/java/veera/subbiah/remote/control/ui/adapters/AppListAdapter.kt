package veera.subbiah.remote.control.ui.adapters

import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.CheckBox
import android.widget.TextView
import veera.subbiah.remote.control.R
import veera.subbiah.remote.control.data.ListModel
import veera.subbiah.remote.control.ui.fragments.NotificationsFragment


class AppListAdapter(private val holder: NotificationsFragment, private val values: List<ListModel>):
    ArrayAdapter<ListModel>(holder.requireContext(), R.layout.listview_apps, values) {

    class ViewHolder {
        var checkBox: CheckBox? = null
        var textView: TextView? = null
    }


    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        val holder: ViewHolder
        val result: View

        if (convertView == null) {
            val inflater = this.holder.layoutInflater
            result = inflater.inflate(R.layout.listview_apps, parent, false)

            holder =
                ViewHolder()
            holder.textView = result?.findViewById(R.id.app_label)
            holder.checkBox = result?.findViewById(R.id.app_enabled)

            holder.checkBox?.setOnCheckedChangeListener(this.holder)
            result.tag = holder
        } else {
            result = convertView
            holder = convertView.tag as ViewHolder
        }

        holder.textView?.text = values[position].getAppName()
        holder.checkBox?.tag = values[position]
        holder.checkBox?.isChecked = values[position].isSelected()
        return result
    }
}