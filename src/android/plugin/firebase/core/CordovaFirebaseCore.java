package plugin.firebase.core;

import android.content.Context;
import android.util.Log;

import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;

import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;

import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginEntry;
import org.apache.cordova.PluginManager;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Hashtable;
import java.util.Map;

/**
 * This class echoes a string called from JavaScript.
 */
public class CordovaFirebaseCore extends CordovaPlugin {

    public Map<String, PluginEntry> plugins = new Hashtable<>();
    private Map<String, IActionHandler> handlers = new Hashtable<>();
    private Context context;
    private PluginManager pluginManager;

    @Override
    public void initialize(final CordovaInterface cordova, final CordovaWebView webView) {
        super.initialize(cordova, webView);

        pluginManager = webView.getPluginManager();
    }

    @Override
    protected void pluginInitialize() {
        this.context = cordova.getContext();
        this.handlers.put("newInstance", new newInstance());
    }

    @Override
    public boolean execute(final String action, final JSONArray args, final CallbackContext callbackContext) throws JSONException {
        if (handlers.containsKey(action)) {
            try {
                handlers.get(action).handle(args, callbackContext);
                return true;
            } catch (Exception e) {
                Log.e(action, e.getMessage(), e);
                callbackContext.error(e.getMessage());
                return false;
            }
        } else {
            return false;
        }
    }

    private class newInstance implements IActionHandler {

        @Override
        public void handle(JSONArray args, CallbackContext callbackContext) throws JSONException {

            JSONObject options = args.getJSONObject(0);
            String instanceId = options.getString("id");
            String name = options.getString("name");

            // TODO: create app using options
            // FirebaseOptions.Builder builder = new FirebaseOptions.Builder();
            // FirebaseOptions appOptions = builder.build();
            // FirebaseApp app = FirebaseApp.initializeApp(context, appOptions, name);

            // Create an instance of FirebaseApp
            FirebaseApp app = FirebaseApp.initializeApp(context);

            // Create an instance of FireBaseAppPlugin
            FirebaseAppPlugin appPlugin = new FirebaseAppPlugin(app);
            appPlugin.privateInitialize(instanceId, cordova, webView, null);
            appPlugin.initialize(cordova, webView);

            // Register as new plugin
            // (plugin name is "instanceId" variable.
            PluginEntry pluginEntry = new PluginEntry(instanceId, appPlugin);
            plugins.put(instanceId, pluginEntry);
            pluginManager.addService(pluginEntry);

            callbackContext.success();
        }
    }
}
