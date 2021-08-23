package io.ionic.starter

import com.getcapacitor.BridgeActivity
import android.os.Bundle
import com.trupluginioniccapacitor.TruPluginIonicCapacitorPlugin
import android.util.Log

class MainActivity : BridgeActivity() {
    private val TAG = MainActivity::class.qualifiedName


    public override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        registerPlugin(TruPluginIonicCapacitorPlugin::class.java)
    }
}