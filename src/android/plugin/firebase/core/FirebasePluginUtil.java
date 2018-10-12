package plugin.firebase.core;

import android.os.Bundle;
import android.util.Log;

import rufus.lzstring4java.LZString;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;


public class FirebasePluginUtil {

  public static String serialize(Object target) throws JSONException {
    if (target instanceof JSONObject) {
      return LZString.compressToBase64(((JSONObject) target).toString(0));
    } else if (target instanceof JSONArray) {
      return LZString.compressToBase64(((JSONArray) target).toString(0));
    } else if (target instanceof Map) {
      return serialize(Map2Json((Map<String, Object>)target));
    } else if (target instanceof List) {
      Iterator<Object> iterator = ((List)target).iterator();
      JSONArray array = new JSONArray();
      while (iterator.hasNext()) {
        array.put(serialize(iterator.next()));
      }
      return serialize(array);
    } else {
      return LZString.compressToBase64(target + "");
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

  public static JSONObject Map2Json(Map map) {
    JSONObject json = new JSONObject();
    Set<String> keys = map.keySet();
    Iterator<String> iterator = keys.iterator();
    while (iterator.hasNext()) {
      String key = iterator.next();
      try {
        Object value = map.get(key);
        if (Map.class.isInstance(value)) {
          value = Map2Json((Map)value);
        }
        if (value.getClass().isArray()) {
          JSONArray values = new JSONArray();
          Object[] objects = (Object[])value;
          int i = 0;
          for (i = 0; i < objects.length; i++) {
            if (Map.class.isInstance(objects[i])) {
              objects[i] = Map2Json((Map)objects[i]);
            }
            values.put(objects[i]);
          }
          json.put(key, values);
        } else if (value.getClass() == ArrayList.class) {
          JSONArray values = new JSONArray();
          Iterator<?> listIterator = ((ArrayList<?>)value).iterator();
          while(listIterator.hasNext()) {
            value = listIterator.next();
            if (Map.class.isInstance(value)) {
              value = Map2Json((Map)value);
            }
            values.put(value);
          }
          json.put(key, values);
        } else {
          json.put(key, value);
        }
      } catch (JSONException e) {
        e.printStackTrace();
      }
    }
    return json;
  }
}
