package veera.subbiah.remote.control.ui.adapters

import android.view.View
import android.view.ViewGroup
import android.widget.*
import veera.subbiah.remote.control.R
import veera.subbiah.remote.control.data.ListModel
import veera.subbiah.remote.control.sortAppList
import veera.subbiah.remote.control.ui.fragments.NotificationsFragment


class AppListAdapter(private val holder: NotificationsFragment, values: ArrayList<ListModel>):
    BaseAdapter(), Filterable {

    private var filteredValues = values
    private val filter = AppListFilter(values)

    class ViewHolder {
        var checkBox: CheckBox? = null
        var textView: TextView? = null
    }

    override fun getItem(position: Int): ListModel? {
        return filteredValues[position]
    }

    override fun getItemId(position: Int): Long {
        return position.toLong()
    }

    override fun getCount(): Int {
        return filteredValues.size
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

        holder.textView?.text = filteredValues[position].getAppName()
        holder.checkBox?.tag = filteredValues[position]
        holder.checkBox?.isChecked = filteredValues[position].isSelected()
        return result
    }

    override fun getFilter(): Filter {
        return filter
    }

    inner class AppListFilter(private val list: ArrayList<ListModel> ): Filter() {

        override fun performFiltering(constraint: CharSequence?): FilterResults {
            val results = FilterResults()
            val count = list.size

            if(constraint.isNullOrBlank()) {
                sortAppList(list)
                results.count = count
                results.values = list
            } else {
                val nList = list
                    .filter {
                        val words = it.getAppName().split(" ")
                        it.getPackageName().startsWith(constraint) ||
                        words.any { word -> word.startsWith(constraint, true) }
                    }

                sortAppList(nList as ArrayList<ListModel>)
                results.count = nList.size
                results.values = nList
            }

            return results
        }

        @Suppress("UNCHECKED_CAST")
        override fun publishResults(constraint: CharSequence?, results: FilterResults?) {
            filteredValues = results!!.values as ArrayList<ListModel>
            notifyDataSetChanged()
        }
    }
}