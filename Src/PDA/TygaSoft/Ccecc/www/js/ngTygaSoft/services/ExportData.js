angular.module('ngTygaSoft.services.ExportData', [])
.factory('$tygasoftExportData', function ($http, $ionicLoading, $ionicPopup, $tygasoftMC, $tygasoftCommon, $tygasoftDbHelper) {

    var ts = {};

    ts.Bind = function ($scope) {
        $scope.toggleGroup = function (group) {
            if ($scope.isGroupShown(group)) {
                $scope.shownGroup = null;
            } else {
                $scope.shownGroup = group;
            }
        };
        $scope.isGroupShown = function (group) {
            return $scope.shownGroup === group;
        };
        $scope.onExport = function () {
            ts.Export($scope);
        }
    };

    ts.GetPandianProductList = function ($scope) {
        try {
            $ionicLoading.show();
            $tygasoftDbHelper.GetAll('PandianProduct').then(function (res) {
                $ionicLoading.hide();
                if (res) {
                    var list = [];
                    for (var i = 0; i < res.length; i++) {
                        list.push(JSON.parse(res.item(i).ContentValue));
                    }
                    $scope.PandianProductItems = list;
                }
                else $scope.PandianProductItems = [];
            }, function (err) {
                $ionicLoading.hide();
                alert(err)
            })
        }
        catch (e) {
            $ionicLoading.hide();
        }
    };

    ts.OnCommit = function ($scope) {
        if (!$scope.PandianProductItems || $scope.PandianProductItems.length == 0) {
            $ionicPopup.alert({ title: $tygasoftMC.MC.Alert_Title, template: $tygasoftMC.MC.Data_ToServer_EmptyError, okText: $tygasoftMC.MC.Btn_OkText });
            return false;
        }
        $ionicPopup.confirm({ title: $tygasoftMC.MC.Alert_Title, template: $tygasoftMC.MC.Confirm_SaveToServer, cancelText: $tygasoftMC.MC.Btn_CancelText, okText: $tygasoftMC.MC.Btn_OkText }).then(function (r) {
            if (r) {
                try {
                    var okCount = 0;
                    $ionicLoading.show();
                    var url = "" + $tygasoftCommon.ServerUrl() + "/Services/PdaService.svc/SaveDevice";
                    var totalLen = $scope.PandianProductItems.length;
                    for (var i = 0; i < totalLen; i++) {
                        var item = $scope.PandianProductItems[i];
                        if (item.OrderCode && item.OrderCode != '') {
                            okCount++;
                            try {
                                var sData = '{"model":{"ItemJson":"' + encodeURIComponent(JSON.stringify(item)) + '"}}';
                                $http.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
                                $http({
                                    method: 'POST',
                                    url: url,
                                    data: sData
                                }).then(function (res) {
                                    var result = res.data;
                                    //alert('result--' + JSON.stringify(result));
                                    if (result.ResCode != 1000) {
                                        $ionicPopup.alert({ title: $tygasoftMC.MC.Alert_Title, template: result.Msg, okText: $tygasoftMC.MC.Btn_OkText });
                                        return false;
                                    }
                                    var key = item.Coded + "|" + item.OrderCode;
                                    $tygasoftDbHelper.Delete("PandianProduct", key);

                                }, function (err) {
                                    $ionicLoading.hide();
                                    alert($tygasoftMC.MC.Http_Err);
                                });
                            }
                            catch (e) {
                                $ionicLoading.hide();
                            }
                        }
                    }
                    $ionicLoading.hide();
                    if (okCount == 0) {
                        $ionicPopup.alert({ title: $tygasoftMC.MC.Alert_Title, template: $tygasoftMC.MC.Data_ToServer_EmptyError, okText: $tygasoftMC.MC.Btn_OkText });
                        return false;
                    }

                    $ionicPopup.alert({ title: $tygasoftMC.MC.Alert_Title, template: $tygasoftMC.MC.Response_Ok, okText: $tygasoftMC.MC.Btn_OkText });
                    var totalItv = 0;
                    var objItv = setInterval(function () {
                        ts.GetPandianProductList($scope);
                        if ($scope.PandianProductItems.length == 0) clearInterval(objItv);
                        else {
                            if (totalItv > okCount * 2) {
                                clearInterval(objItv);
                            }
                        }
                        totalItv++;
                    }, 2000);
                }
                catch (e) {
                    alert($tygasoftMC.MC.M_ExError);
                }
            }
        })
    };

    ts.Export = function ($scope) {
        if (!$scope.PandianProductItems || $scope.PandianProductItems.length == 0) {
            $ionicPopup.alert({ title: $tygasoftMC.MC.Alert_Title, template: $tygasoftMC.MC.M_ExportEmptyData, okText: $tygasoftMC.MC.Btn_OkText });
            return false;
        }
        $ionicPopup.confirm({ title: $tygasoftMC.MC.Alert_Title, template: $tygasoftMC.MC.Confirm_Export, cancelText: $tygasoftMC.MC.Btn_CancelText, okText: $tygasoftMC.MC.Btn_OkText }).then(function (r) {
            if (r) {
                $ionicLoading.show();
                var totalLen = $scope.PandianProductItems.length;
                var json = [{ "Rfid": "Rfid", "Coded": "设备编号", "Named": "设备名称", "SpecModel": "设备型号", "DeviceType": "设备类别", "Manufacturer": "生产厂家", "ProduceType": "进口/国产", "Weight": "整机重量(kg)", "Power": "装机功率(KW)", "EngineCode": "发动机号", "ChassisCode": "底盘号", "VehicleCode": "车牌号", "OriginalValue": "设备原值", "NetValue": "设备净值", "TechStatus": "设备技术状态", "VehicleStatus": "车辆状态", "LeaseStatus": "租赁状态", "ManageUnit": "管理单位", "DeviceProject": "设备所在项目"}];
                for (var i = 0; i < totalLen; i++) {
                    var item = $scope.PandianProductItems[i];
                    if (item.OrderCode && item.OrderCode != '') {
                        json.push(item);
                    }
                }
                if (json.length > 0) {
                    CustomPlugin.onExport(JSON.stringify(json), function (result) {
                        for (var i = 0; i < json.length; i++) {
                            var item = json[i];
                            var key = item.Rfid + "|" + item.OrderCode;
                            $tygasoftDbHelper.Delete("PandianProduct", key);
                        }
                        ts.GetPandianProductList($scope);
                    })
                }
                else {
                    $ionicPopup.alert({ title: $tygasoftMC.MC.Alert_Title, template: $tygasoftMC.MC.M_ExportEmptyData, okText: $tygasoftMC.MC.Btn_OkText });
                    return false;
                }

                $ionicLoading.hide();
                $ionicPopup.alert({ title: $tygasoftMC.MC.Alert_Title, template: $tygasoftMC.MC.Response_Ok, okText: $tygasoftMC.MC.Btn_OkText });
                var totalItv = 0;
                var objItv = setInterval(function () {
                    ts.GetPandianProductList($scope);
                    if ($scope.PandianProductItems.length == 0) clearInterval(objItv);
                    else {
                        if (totalItv > totalLen) {
                            clearInterval(objItv);
                        }
                    }
                    totalItv++;
                }, 2000);
            }
        })
    };

    return ts;
});