package veera.subbiah.remote.control.core.api

import android.os.AsyncTask
import android.util.Log
import com.google.firebase.crashlytics.FirebaseCrashlytics
import okhttp3.ConnectionPool
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.logging.HttpLoggingInterceptor
import okhttp3.logging.HttpLoggingInterceptor.Level
import veera.subbiah.remote.control.getUser
import java.io.IOException
import java.util.concurrent.TimeUnit


object ApiHandler {
    private val TAG = "ApiHandler"
    private val client = OkHttpClient.Builder()
        .connectionPool(ConnectionPool(5, 1, TimeUnit.MINUTES))
        .addInterceptor(HttpLoggingInterceptor().setLevel(Level.BASIC))
        .build()

    fun makePost(url: String, json: String): String? {
        try {
            val user = getUser() ?: return "User not logged in."

            val request: Request = Request.Builder()
                .url(url)
                .addHeader("x-uid", user.uid)
                .post(json.toRequestBody("application/json".toMediaType()))
                .build()

            client.newCall(request).execute().use { response ->
                if (!response.isSuccessful) throw IOException("Unexpected code $response")

                return response.body?.byteString()?.utf8()
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