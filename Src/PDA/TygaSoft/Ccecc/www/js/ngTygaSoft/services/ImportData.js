angular.module('ngTygaSoft.services.ImportData', [])
.factory('$tygasoftImportData', function ($ionicLoading, $ionicPopup, $http, $tygasoftMC, $tygasoftCommon, $tygasoftDbHelper) {

    var ts = {};

    ts.Bind = function ($scope) {
        $scope.onImport = function () {
            ts.Import();
            //var sJson = "[{\"Id\":\"34fe22cb-71f7-4196-968b-5e4ffa2d4258\",\"Coded\":\"10-01-466105-0145\",\"Named\":\"250KVA发电机\",\"Rfid\":\"E2004134100D009226600BF2\",\"SpecModel\":\"HDC250\",\"DeviceType\":\"生产设备\",\"Manufacturer\":\"华东动力\",\"ProduceType\":\"国产\",\"Weight\":0.0,\"Power\":0.0,\"EngineCode\":\"\",\"ChassisCode\":\"NO:HDC0906119\",\"VehicleCode\":\"\",\"OriginalValue\":3905769.78,\"NetValue\":0.00,\"TechStatus\":\"良好\",\"VehicleStatus\":\"\",\"LeaseStatus\":\"退租\",\"ManageUnit\":\"阿布贾城铁\",\"DeviceProject\":\"阿布贾城铁\",\"LastUpdatedDate\":\"2017-01-14T18:23:50.213\"}]";
            //CustomPlugin.onExport(sJson, function (result) {
            //    alert(result);
            //})
            //ts.GetProductList(1, 1000);
        };

    };

    ts.Import = function () {
        CustomPlugin.onImport("", function (result) {
            var jData = JSON.parse(result);
            var okCount = 0;
            for (var i = 0; i < jData.length; i++) {
                var item = jData[i];
                var key = item.Rfid != '' ? item.Rfid : item.Coded;
                $tygasoftDbHelper.DoInsert('Product', 'Admin', $tygasoftMC.DataStatus.Import, key, JSON.stringify(item), true);
                okCount++;
            }
            $ionicPopup.alert({ title: $tygasoftMC.MC.Alert_Title, template: $tygasoftMC.GetString('Server_Data_ImportCount', okCount), okText: $tygasoftMC.MC.Btn_OkText });
        })
    };

    ts.GetProductList = function (pageIndex, pageSize) {
        try {
            var url = "" + $tygasoftCommon.ServerUrl() + "/Services/PdaService.svc/GetDeviceList";
            var sData = '{"model":{"PageIndex":"' + pageIndex + '","PageSize":"' + pageSize + '"}}';
            //console.log('url--' + url);
            $ionicLoading.show();
            $http.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
            $http({
                method: 'POST',
                url: url,
                data: sData
            }).then(function (res) {
                $ionicLoading.hide();
                var result = res.data;
                //alert(JSON.stringify(result));
                //console.log('GetDeviceList--result--' + JSON.stringify(result));
                //alert('GetDeviceList--result--' + JSON.stringify(result));
                //return false;
                if (result.ResCode != 1000) {
                    $ionicPopup.alert({ title: $tygasoftMC.MC.Alert_Title, template: result.Msg, okText: $tygasoftMC.MC.Btn_OkText });
                    return false;
                }
                var jData = JSON.parse(result.Data);
                var okCount = 0;
                for (var i = 0; i < jData.length; i++) {
                    var item = jData[i];
                    //console.log('GetProductList--item--' + JSON.stringify(item));
                    var key = item.Rfid != '' ? item.Rfid : item.Coded;
                    $tygasoftDbHelper.DoInsert('Product', 'Admin', $tygasoftMC.DataStatus.Import, key, JSON.stringify(item), true);
                    okCount++;
                }
                $ionicPopup.alert({ title: $tygasoftMC.MC.Alert_Title, template: $tygasoftMC.GetString('Server_Data_ImportCount', okCount), okText: $tygasoftMC.MC.Btn_OkText });

            }, function (err) {
                $ionicLoading.hide();
                alert($tygasoftMC.MC.Http_Err);
            });
        }
        catch (e) {
            $ionicLoading.hide();
            alert($tygasoftMC.MC.Http_Err);
        }
    };

    return ts;
});