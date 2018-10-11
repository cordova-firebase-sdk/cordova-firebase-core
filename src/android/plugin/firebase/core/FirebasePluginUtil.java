package plugin.firebase.core;

import rufus.lzstring4java.LZString;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.Map;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;


public class FirebasePluginUtil {

  public static String serialize(Object target) throws JSONException {
    if (target instanceof JSONObject) {
      return LZString.compressToBase64(((JSONObject) target).toString(0));
    } else if (target instanceof JSONArray) {
      return LZString.compressToBase64(((JSONArray) target).toString(0));
    } else {
      return LZString.compressToBase64((String)target);
    }
  }

  public static Object deserialize(String serializedStr) {
    serializedStr = LZString.decompressFromBase64(serializedStr);
    try {
      if (serializedStr.startsWith("{") && serializedStr.endsWith("}")) {
        return new JSONObject(serializedStr);
      } else if (serializedStr.startsWith("[") && serializedStr.endsWith("]")) {
        return new JSONArray(serializedStr);
      }
      return serializedStr;
    } catch (Exception e) {
      // ignore
      return serializedStr;
    }
  }

  public static ArrayList<Object> Json2Map(JSONArray jsonArray) throws JSONException {

    ArrayList<Object> array = new ArrayList<Object>();

    Object value2;
    for (int i = 0; i < jsonArray.length(); i++) {
      value2 = jsonArray.get(i);
      if (value2 == null ||
              Boolean.class.isInstance(value2) ||
              value2 instanceof Number ||
              value2 instanceof String) {
        array.add(value2);
      } else if (JSONObject.class.isInstance(value2)) {
        array.add(Json2Map((JSONObject)value2));
      } else if (JSONArray.class.isInstance(value2)) {
        array.add(Json2Map((JSONArray)value2));
      } else {
        array.add(value2 + "");
      }
    }
    return array;
  }

  public static Map<String, Object> Json2Map(JSONObject json) throws JSONException {
    HashMap<String, Object> mMap = new HashMap<>();
    @SuppressWarnings("unchecked")
    Iterator<String> iterator = json.keys();
    Object value;
    while (iterator.hasNext()) {
      String key = iterator.next();
      try {
        value = json.get(key);
        if (value == null ||
                Boolean.class.isInstance(value) ||
                value instanceof Number ||
                value instanceof String) {
          mMap.put(key, value);
        } else if (JSONObject.class.isInstance(value)) {
          mMap.put(key, Json2Map((JSONObject)value));
        } else if (JSONArray.class.isInstance(value)) {
          mMap.put(key, Json2Map((JSONArray)value));
        } else {
          mMap.put(key, value + "");
        }
      } catch (JSONException e) {
        e.printStackTrace();
      }
    }
    return mMap;
  }
}
