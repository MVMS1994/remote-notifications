package veera.subbiah.remote.control.ui.fragments

import veera.subbiah.remote.control.data.Commands

interface BaseFragment {
    fun onCommand(command: Commands, arg: String)
}