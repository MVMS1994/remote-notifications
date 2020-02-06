package veera.subbiah.remote.control.core.api

import android.os.AsyncTask
import android.util.Log
import com.google.firebase.crashlytics.FirebaseCrashlytics
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.MediaType.Companion.toMediaType
import veera.subbiah.remote.control.getUser
import java.io.IOException


object ApiHandler {
    private val TAG = "ApiHandler"

    fun makePost(url: String, json: String): String? {
        try {
            val client = OkHttpClient()
            val user = getUser() ?: return "User not logged in."

            val request: Request = Request.Builder()
                .url(url)
                .addHeader("x-uid", user.uid)
                .post(json.toRequestBody("application/json".toMediaType()))
                .build()

            client.newCall(request).execute().use { response ->
                if (!response.isSuccessful) throw IOException("Unexpected code $response")

                return response.body.toString()
            }
        } catch (e: Exception) {
            Log.e(TAG, "API errored: ", e)
            FirebaseCrashlytics.getInstance().recordException(e)
            return null
        }
    }

    class ApiHandlerTask: AsyncTask<String, Void, String>() {
        override fun doInBackground(vararg args: String?): String? {
            val url = args[0]
            val json = args[1]

            when(args[2]) {
                "post" -> {
                    if(url.isNullOrEmpty() || json.isNullOrEmpty()) {
                        return "url and json can't be null or empty"
                    }
                    return makePost(url, json)
                }
                else -> {
                    return "API call not supported"
                }
            }
        }

        override fun onPostExecute(result: String?) {
            Log.d(TAG, "API result: $result")
            super.onPostExecute(result)
        }
    }
}