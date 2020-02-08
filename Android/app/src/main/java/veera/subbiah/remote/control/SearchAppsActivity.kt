package veera.subbiah.remote.control

import android.app.Activity
import android.app.SearchManager
import android.content.Intent
import android.os.Bundle

class SearchAppsActivity: Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        handleIntent(intent)
    }

    override fun onNewIntent(intent: Intent?) {
        super.onNewIntent(intent)
        handleIntent(intent)
    }


    private fun handleIntent(intent: Intent?) {
        if (intent != null && Intent.ACTION_SEARCH == intent.action) {
            val query = intent.getStringExtra(SearchManager.QUERY)

        }
    }
}