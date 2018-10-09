package com.tygasoft.utility;
import com.tygasoft.bll.Device;
import com.tygasoft.model.DeviceInfo;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.net.URLDecoder;

import jxl.Cell;
import jxl.CellType;
import jxl.DateCell;
import jxl.LabelCell;
import jxl.Sheet;
import jxl.Workbook;
import jxl.write.Label;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;
import jxl.write.WriteException;

public class ExcelHelper {
	
	static String RootPath = "/storage/sdcard0/Download/";

	public static String Read(String filePath){  
		if(filePath == null || filePath.equals("")) {
			filePath = RootPath + "Device.xls";
		}
		
		StringBuilder sb = new StringBuilder();
        try{  
            InputStream stream = new FileInputStream(filePath);  
            Workbook doc = Workbook.getWorkbook(stream);  
            Sheet sheet = doc.getSheet(0);  
            int colLen = sheet.getColumns();  
            int rowLen = sheet.getRows();   
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");  
            for(int i=0;i<rowLen;i++){
            	StringBuilder sbCell = new StringBuilder();
            	//Cell[] cells = sheet.getRow(i);
                for(int j=0 ;j<colLen;j++){     
	                Cell cell = sheet.getCell(j,i+1);  
	                String value = cell.getContents();  
		            if(cell.getType() == CellType.LABEL){  
		                LabelCell label = (LabelCell)cell;  
		                value = label.getString();  
		            }    
		            else if(cell.getType()==CellType.DATE){  
		                DateCell dc=(DateCell)cell;    
		                value = sdf.format(dc.getDate());  
		            } 
		            switch(j){
		            case 0:
		            	sbCell.append("\"Rfid\":\""+value+"\",");
    				    break;
    			    case 1:
    			    	sbCell.append("\"Coded\":\""+value+"\",");
    				    break;
    			    case 2:
    			    	sbCell.append("\"Named\":\""+value+"\",");
    				    break;
    			    case 3:
    			    	sbCell.append("\"SpecModel\":\""+value+"\",");
    				    break;
    			    case 4:
    			    	sbCell.append("\"DeviceType\":\""+value+"\",");
    				    break;
    			    case 5:
    			    	sbCell.append("\"Manufacturer\":\""+value+"\",");
    				    break;
    			    case 6:
    			    	sbCell.append("\"ProduceType\":\""+value+"\",");
    				    break;
    			    case 7:
    			    	sbCell.append("\"Weight\":\""+value+"\",");
    				    break;
    			    case 8:
    			    	sbCell.append("\"Power\":\""+value+"\",");
    				    break;
    			    case 9:
    			    	sbCell.append("\"EngineCode\":\""+value+"\",");
    				    break;
    			    case 10:
    			    	sbCell.append("\"ChassisCode\":\""+value+"\",");
    				    break;
    			    case 11:
    			    	sbCell.append("\"VehicleCode\":\""+value+"\",");
    				    break;
    			    case 12:
    			    	sbCell.append("\"OriginalValue\":\""+value+"\",");
    				    break;
    			    case 13:
    			    	sbCell.append("\"NetValue\":\""+value+"\",");
    				    break;
    			    case 14:
    			    	sbCell.append("\"TechStatus\":\""+value+"\",");
    				    break;
    			    case 15:
    			    	sbCell.append("\"VehicleStatus\":\""+value+"\",");
    				    break;
    			    case 16:
    			    	sbCell.append("\"LeaseStatus\":\""+value+"\",");
    				    break;
    			    case 17:
    			    	sbCell.append("\"ManageUnit\":\""+value+"\",");
    				    break;
    			    case 18:
    			    	sbCell.append("\"DeviceProject\":\""+value+"\",");
    				    break;
		            	default:
		            		break;
		            }
                }
                
                String sCell = sbCell.toString();
                sb.append("{"+sCell.substring(0, sCell.lastIndexOf(","))+"},");
            } 
            
            doc.close();  
        }  
        catch(Exception e){  
            e.printStackTrace();  
        } 
        String sJson = sb.toString();
        return "["+sJson.substring(0, sJson.lastIndexOf(","))+"]";
    }  
	
	public static void Write(String name,String json){
		if(name == null || name.equals("")) {
			Date currentTime = new Date();
			SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
			name = sdf.format(currentTime)+".xls";
		}
		try{
			File file = new File(RootPath + name);
			file.createNewFile();
			OutputStream stream = new FileOutputStream(file);
			Write(stream,1,json);
		}
		catch(Exception ex){
			ex.printStackTrace();  
		}
	} 
	
	public static void Write(OutputStream stream,int flag,String json) throws WriteException, IOException{  
		WritableWorkbook workbook = null;
        try{  
        	workbook = Workbook.createWorkbook(stream);  
    		WritableSheet sheet = workbook.createSheet("Sheet1", 0);  
    		
    		WriteSheet(sheet,flag,json);
    		
    		workbook.write();  
    		workbook.close();
    		stream.close();  
        }  
        catch(Exception e){  
        	if(workbook != null){
        		workbook.close();
        		workbook = null;
        	}
        	if(stream != null){
        		stream.close();  
        		stream = null;
        	}
            e.printStackTrace();  
        }  
    } 
	
	public static void WriteSheet(WritableSheet sheet,int flag,String json){
		try{
			switch(flag){
			    case 1:
			    	Device bll = new Device();
			    	List<DeviceInfo> deviceList = bll.GetList(json);
			    	
					//String headCell = new String("Rfid4,设备编号,设备名称,设备型号,设备类别,生产厂家,进口/国产,整机重量(kg),装机功率(KW),发动机号,底盘号,车牌号,设备原值,设备净值,设备技术状态,车辆状态,租赁状态,管理单位,设备所在项目".getBytes("GBK"),"GBK");
			    	//String headCell = "Rfid,设备编号,设备名称,设备型号,设备类别,生产厂家,进口/国产,整机重量(kg),装机功率(KW),发动机号,底盘号,车牌号,设备原值,设备净值,设备技术状态,车辆状态,租赁状态,管理单位,设备所在项目";
			    	//headCell = URLDecoder.decode(headCell, "gb2312");
					//String[] headCells = headCell.split(",");
			    	//for(int i=0;i<headCells.length;i++){
			    	//	sheet.addCell(new Label(i, 0, headCells[i]));
		    		//}
			    	
					int len = 20;
			    	for(int i=0;i<deviceList.size();i++){
			    		DeviceInfo item = deviceList.get(i);
			    		for(int j=0;j<len;j++){
			    			String value = "";
			    			switch(j){
			    			    case 0:
			    			    	value = item.Rfid;
			    				    break;
			    			    case 1:
			    			    	value = item.Coded;
			    				    break;
			    			    case 2:
			    			    	value = item.Named;
			    				    break;
			    			    case 3:
			    			    	value = item.SpecModel;
			    				    break;
			    			    case 4:
			    			    	value = item.DeviceType;
			    				    break;
			    			    case 5:
			    			    	value = item.Manufacturer;
			    				    break;
			    			    case 6:
			    			    	value = item.ProduceType;
			    				    break;
			    			    case 7:
			    			    	value = item.Weight;
			    				    break;
			    			    case 8:
			    			    	value = item.Power;
			    				    break;
			    			    case 9:
			    			    	value = item.EngineCode;
			    				    break;
			    			    case 10:
			    			    	value = item.ChassisCode;
			    				    break;
			    			    case 11:
			    			    	value = item.VehicleCode;
			    				    break;
			    			    case 12:
			    			    	value = item.OriginalValue;
			    				    break;
			    			    case 13:
			    			    	value = item.NetValue;
			    				    break;
			    			    case 14:
			    			    	value = item.TechStatus;
			    				    break;
			    			    case 15:
			    			    	value = item.VehicleStatus;
			    				    break;
			    			    case 16:
			    			    	value = item.LeaseStatus;
			    				    break;
			    			    case 17:
			    			    	value = item.ManageUnit;
			    				    break;
			    			    case 18:
			    			    	value = item.DeviceProject;
			    				    break;
			    				default:
			    					break;
			    			}
			    			sheet.addCell(new Label(j, i, value));
			    		} 
			    		
			    	}
				    break;
				default:
					break;
			}
		}
		catch(Exception e){
		    e.printStackTrace();
		}
	}
}
