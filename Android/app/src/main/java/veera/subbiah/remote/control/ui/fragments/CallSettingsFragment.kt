package veera.subbiah.remote.control.ui.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import veera.subbiah.remote.control.R

class CallSettingsFragment: Fragment() {
    override fun onCreateView(i: LayoutInflater, c: ViewGroup?, state: Bundle?): View? {
        return i.inflate(R.layout.fragment_call_settings, c, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
    }
}