package plugin.firebase.core;

import android.content.Context;
import android.util.Log;

import com.google.firebase.FirebaseApp;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginEntry;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Hashtable;
import java.util.Map;

public class FirebaseAppPlugin extends CordovaPlugin {

  private FirebaseApp app;
  private Map<String, IActionHandler> handlers = new Hashtable<>();
  private Context context;

  FirebaseAppPlugin(FirebaseApp app) {
    super();
    this.app = app;
  }

  @Override
  protected void pluginInitialize() {
    this.context = cordova.getContext();
    this.handlers.put("newInstance", new delete());
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


  private class delete implements IActionHandler {

    @Override
    public void handle(JSONArray args, CallbackContext callbackContext) throws JSONException {

      app.delete();
      app = null;

      callbackContext.success();
    }
  }

}
