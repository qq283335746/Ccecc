package com.tygasoft.plugins;
import com.tygasoft.utility.ExcelHelper;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;
import org.json.JSONArray;
import org.json.JSONException;

public class CustomPlugin extends CordovaPlugin {
	@Override
    public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) throws JSONException {
		if (action.equals("HelloWord")) {
            String message = args.getString(0);
            callbackContext.success(message);
            return true;
        }
		else if (action.equals("onImport")) {
            String fileName = args.getString(0);
            callbackContext.success(ExcelHelper.Read(fileName));
            return true;
        }
        else if (action.equals("onExport")) {
        	String json = args.getString(0);
			//callbackContext.success(json);
        	ExcelHelper.Write("", json);
        	callbackContext.success(1);
        	return true;
        }
        
        return false;
    }
}
