package com.tygasoft.bll;
import com.tygasoft.model.DeviceInfo;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class Device {
	public List<DeviceInfo> GetList(String json) {
        List<DeviceInfo> list = new ArrayList<DeviceInfo>();
        try {
            JSONArray jsonArray = new JSONArray(json);
            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject jsonObject = (JSONObject) jsonArray.get(i);
                DeviceInfo model = new DeviceInfo();
                model.Coded = jsonObject.optString("Coded");
                model.Named = jsonObject.optString("Named");
                model.Rfid = jsonObject.optString("Rfid");
                model.SpecModel = jsonObject.optString("SpecModel");
                model.DeviceType = jsonObject.optString("DeviceType");
                model.Manufacturer = jsonObject.optString("Manufacturer");
                model.ProduceType = jsonObject.optString("ProduceType");
                model.Weight =  jsonObject.optString("Weight");
                model.Power = jsonObject.optString("Power");
                model.EngineCode = jsonObject.optString("EngineCode");
                model.ChassisCode = jsonObject.optString("ChassisCode");
				model.VehicleCode = jsonObject.optString("VehicleCode");
                model.OriginalValue = jsonObject.optString("OriginalValue");
                model.NetValue = jsonObject.optString("NetValue");
                model.TechStatus = jsonObject.optString("TechStatus");
                model.VehicleStatus = jsonObject.optString("VehicleStatus");
                model.LeaseStatus = jsonObject.optString("LeaseStatus");
                model.ManageUnit = jsonObject.optString("ManageUnit");
                model.DeviceProject = jsonObject.optString("DeviceProject");
                list.add(model);
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return list;
    }
}
