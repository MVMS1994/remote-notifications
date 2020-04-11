package veera.subbiah.remote.control

import android.app.SearchManager
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.Menu
import android.view.MenuItem
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.SearchView
import androidx.appcompat.widget.Toolbar
import androidx.viewpager2.widget.ViewPager2
import com.firebase.ui.auth.IdpResponse
import com.google.android.material.tabs.TabLayout
import com.google.android.material.tabs.TabLayoutMediator
import com.google.firebase.analytics.FirebaseAnalytics
import veera.subbiah.remote.control.core.analytics.Tracker
import veera.subbiah.remote.control.core.auth.FirebaseAuthAdapter
import veera.subbiah.remote.control.ui.adapters.ViewPagerAdapter

class MainActivity : AppCompatActivity() {

    companion object {
        @Suppress("unused")
        private const val TAG = "MainActivity"
    }

    private lateinit var toolbar: Toolbar
    private lateinit var tabs: Array<String>
    private lateinit var viewPagerAdapter: ViewPagerAdapter
    private lateinit var viewPager: ViewPager2

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        initToolbar()
        initTabs()
    }

    private fun initToolbar() {
        toolbar = findViewById(R.id.toolbar)

        setSupportActionBar(toolbar)
        supportActionBar?.title = getString(R.string.app_name)
    }

    private fun initTabs() {
        tabs = resources.getStringArray(R.array.tabs)
        viewPagerAdapter =
            ViewPagerAdapter(this, tabs)

        viewPager = findViewById(R.id.main_pager)
        viewPager.adapter = viewPagerAdapter
        viewPager.offscreenPageLimit = 3
        viewPager.isUserInputEnabled = false

        val tabLayout = findViewById<TabLayout>(R.id.main_tab_header)
        TabLayoutMediator(tabLayout, viewPager) { tab, position ->
            tab.text = tabs[position]
        }.attach()
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        menuInflater.inflate(R.menu.title_menu, menu)

        val searchManager = getSystemService(Context.SEARCH_SERVICE) as SearchManager
        (menu.findItem(R.id.search).actionView as SearchView).apply {
            setSearchableInfo(searchManager.getSearchableInfo(componentName))
        }
        return true
    }

    override fun onPrepareOptionsMenu(menu: Menu): Boolean {
        if(getUser() == null) {
            menu.findItem(R.id.sign_out)?.isVisible = false
        } else {
            menu.findItem(R.id.sign_in)?.isVisible = false
        }

        return super.onPrepareOptionsMenu(menu)
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return when(item.itemId) {
            R.id.sign_out -> {
                FirebaseAuthAdapter.signOut(this, Runnable {
                    FirebaseAnalytics
                        .getInstance(this)
                        .logEvent("sign_out", null)

                    invalidateOptionsMenu()
                })
                return true
            }
            R.id.sign_in -> {
                FirebaseAuthAdapter.signIn(this)
                return true
            }
            R.id.search -> {

                return true
            }
            else -> false
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        if (requestCode == FirebaseAuthAdapter.RC_SIGN_IN) {
            IdpResponse.fromResultIntent(data)
            if(getUser() != null) {
                FirebaseAnalytics
                    .getInstance(this)
                    .logEvent("login", null)
            }

            invalidateOptionsMenu()
            Tracker.sessionUser(this)
        }
    }
}
