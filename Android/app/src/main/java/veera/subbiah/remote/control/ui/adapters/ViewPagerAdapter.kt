package veera.subbiah.remote.control.ui.adapters

import android.os.Bundle
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentActivity
import androidx.viewpager2.adapter.FragmentStateAdapter
import veera.subbiah.remote.control.ui.fragments.CallSettingsFragment
import veera.subbiah.remote.control.ui.fragments.NotificationsFragment

class ViewPagerAdapter(fm: FragmentActivity, private val tabs: Array<String>) : FragmentStateAdapter(fm) {

    override fun getItemCount(): Int {
        return tabs.size
    }

    override fun createFragment(position: Int): Fragment {
        val arguments = Bundle()
        val fragment =
        if(position == 0) {
            NotificationsFragment()
        } else {
            CallSettingsFragment()
        }

        arguments.apply {
            putInt("position", position)
            putString("name", tabs[position])
        }
        fragment.arguments = arguments
        return fragment
    }
}