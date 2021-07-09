package veera.subbiah.remote.control

import android.app.Activity
import android.content.Intent
import android.content.IntentSender.SendIntentException
import android.os.Bundle
import android.view.Menu
import android.view.MenuItem
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.SearchView
import androidx.appcompat.widget.Toolbar
import androidx.viewpager2.widget.ViewPager2
import com.firebase.ui.auth.IdpResponse
import com.google.android.material.snackbar.Snackbar
import com.google.android.material.tabs.TabLayout
import com.google.android.material.tabs.TabLayoutMediator
import com.google.android.play.core.appupdate.AppUpdateInfo
import com.google.android.play.core.appupdate.AppUpdateManager
import com.google.android.play.core.appupdate.AppUpdateManagerFactory
import com.google.android.play.core.install.InstallState
import com.google.android.play.core.install.InstallStateUpdatedListener
import com.google.android.play.core.install.model.AppUpdateType
import com.google.android.play.core.install.model.InstallStatus
import com.google.android.play.core.install.model.UpdateAvailability
import com.google.android.play.core.tasks.OnSuccessListener
import com.google.firebase.analytics.FirebaseAnalytics
import kotlinx.android.synthetic.main.activity_main.*
import veera.subbiah.remote.control.core.analytics.Tracker
import veera.subbiah.remote.control.core.auth.FirebaseAuthAdapter
import veera.subbiah.remote.control.data.Commands
import veera.subbiah.remote.control.ui.adapters.ViewPagerAdapter

class MainActivity : AppCompatActivity(), SearchView.OnQueryTextListener {


    companion object {
        @Suppress("unused")
        private const val TAG = "MainActivity"

        private var appUpdateManager: AppUpdateManager? = null
        private val RC_APP_UPDATE = 100
    }

    private lateinit var toolbar: Toolbar
    private lateinit var tabs: Array<String>
    private lateinit var viewPagerAdapter: ViewPagerAdapter
    private lateinit var viewPager: ViewPager2
    private lateinit var menu: Menu

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        initToolbar()
        initTabs()

        appUpdateManager = AppUpdateManagerFactory.create(this)
        appUpdateManager!!.getAppUpdateInfo()
            .addOnSuccessListener(object : OnSuccessListener<AppUpdateInfo?> {

                override fun onSuccess(result: AppUpdateInfo?) {
                    if (result!!.updateAvailability() == UpdateAvailability.UPDATE_AVAILABLE) {
                        if(result.isUpdateTypeAllowed(AppUpdateType.FLEXIBLE)) {
                            try {
                                appUpdateManager!!.startUpdateFlowForResult(
                                    result,
                                    AppUpdateType.FLEXIBLE,
                                    this@MainActivity,
                                    RC_APP_UPDATE
                                )
                                appUpdateManager!!.registerListener(installStateUpdatedListener)
                            } catch (e: SendIntentException) {
                                e.printStackTrace()
                            }
                        }
                         else if(result.isUpdateTypeAllowed(AppUpdateType.IMMEDIATE)) {
                            try {
                                appUpdateManager!!.startUpdateFlowForResult(
                                    result,
                                    AppUpdateType.IMMEDIATE,
                                    this@MainActivity,
                                    RC_APP_UPDATE
                                )
                            } catch (e: SendIntentException) {
                                e.printStackTrace()
                            }
                        }
                    }
                }
            })
    }

    private val installStateUpdatedListener: InstallStateUpdatedListener =
        object : InstallStateUpdatedListener {
            override fun onStateUpdate(state: InstallState) {
                if (state.installStatus() == InstallStatus.DOWNLOADED) {
                    showCompletedUpdate()
                }
            }
        }

    private fun showCompletedUpdate() {
        val snackbar = Snackbar.make(
            findViewById(android.R.id.content),
            "Update downloaded",
            Snackbar.LENGTH_INDEFINITE
        )
        snackbar.setAction(
            "Install"
        ) { appUpdateManager!!.completeUpdate() }
        snackbar.show()
    }

    override fun onStop() {
        if (appUpdateManager != null) {
            appUpdateManager!!.unregisterListener(installStateUpdatedListener)
        }
        super.onStop()
    }

    override fun onResume() {
        appUpdateManager!!.getAppUpdateInfo()
            .addOnSuccessListener(object : OnSuccessListener<AppUpdateInfo?> {
                override fun onSuccess(result: AppUpdateInfo?) {
                    if(result!!.updateAvailability() == UpdateAvailability.DEVELOPER_TRIGGERED_UPDATE_IN_PROGRESS) {
                        try {
                            appUpdateManager!!.startUpdateFlowForResult(
                                result,
                                AppUpdateType.FLEXIBLE,
                                this@MainActivity,
                                RC_APP_UPDATE
                            )
                            appUpdateManager!!.registerListener(installStateUpdatedListener)
                        } catch (e: SendIntentException) {
                            e.printStackTrace()
                        }
                    }
                }
            })
        super.onResume()
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

        if(tabs.size == 1) {
            main_tab_header.visibility = View.GONE
        }
        viewPager = findViewById(R.id.main_pager)
        viewPager.adapter = viewPagerAdapter
        viewPager.offscreenPageLimit = 3
        viewPager.isUserInputEnabled = false
        viewPager.registerOnPageChangeCallback(object : ViewPager2.OnPageChangeCallback() {
            override fun onPageScrolled(position: Int, positionOffset: Float,
                positionOffsetPixels: Int) {}

            override fun onPageSelected(position: Int) {
                invalidateOptionsMenu()
            }
            override fun onPageScrollStateChanged(state: Int) {}
        })

        val tabLayout = findViewById<TabLayout>(R.id.main_tab_header)
        TabLayoutMediator(tabLayout, viewPager) { tab, position ->
            tab.text = tabs[position]
        }.attach()
    }

    private fun initSearch(menu: Menu) {
        val item = menu.findItem(R.id.search)
        val searchView = item.actionView as SearchView
        searchView.maxWidth = Int.MAX_VALUE
        searchView.setIconifiedByDefault(true)
        searchView.setOnQueryTextListener(this)
        searchView.setOnCloseListener { false }
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        menuInflater.inflate(R.menu.title_menu, menu)
        initSearch(menu)
        this.menu = menu

        return super.onCreateOptionsMenu(menu)
    }

    override fun onPrepareOptionsMenu(menu: Menu): Boolean {
        if(getUser() == null) {
            menu.findItem(R.id.sign_out)?.isVisible = false
        } else {
            menu.findItem(R.id.sign_in)?.isVisible = false
        }

        menu.findItem(R.id.search)?.isVisible = viewPager.currentItem == 0
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
        if (requestCode == RC_APP_UPDATE && resultCode != Activity.RESULT_OK) {
            Toast.makeText(this, "Update cancelled", Toast.LENGTH_SHORT).show()
        }
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

    override fun onQueryTextSubmit(query: String?): Boolean {
        viewPagerAdapter.getFragment(viewPager.currentItem)
            ?.onCommand(Commands.FILTER, query?: "")
        return true
    }

    override fun onQueryTextChange(query: String?): Boolean {
        viewPagerAdapter.getFragment(viewPager.currentItem)
            ?.onCommand(Commands.FILTER, query?: "")
        return true
    }

    override fun onBackPressed() {
        val item = menu.findItem(R.id.search)
        val searchView = item?.actionView as SearchView

        if (!searchView.isIconified) {
            searchView.isIconified = true
        } else {
            super.onBackPressed()
        }
    }
}
