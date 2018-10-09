angular.module('ngTygaSoft.services.Pandian', [])

.factory('$tygasoftPandian', function ($http, $ionicLoading, $ionicPopup, $ionicModal, ionicDatePicker, $tygasoftMC, $tygasoftCommon, $tygasoftDbHelper, $tygasoftLogin) {

    var ts = {};

    ts.Bind = function ($scope, key) {
        if (key == "AddPandian") {
            ts.GetWarehouseList($scope);
            $ionicModal.fromTemplateUrl('templates/DlgWarehouse.html', {
                scope: $scope
            }).then(function (modal) {
                $scope.warehouseModal = modal;
            });
            $scope.onDlgWarehouse = function () {
                $scope.warehouseModal.show();
            };
            $scope.onSelectWarehouse = function (index) {
                var item = $scope.WarehouseItems[index];
                $scope.ModelData.Warehouse = item.Name;
                $scope.onCloseWarehouse();
            };
            $scope.onCloseWarehouse = function () {
                $scope.warehouseModal.hide();
            };
            $scope.onDpDate = function (n) {
                ionicDatePicker.openDatePicker({
                    callback: function (val) {
                        var sDate = new Date(val).Format("yyyy-MM-dd");
                        switch (n) {
                            case 1:
                                $scope.ModelData.StartDate = sDate;
                                break;
                            case 2:
                                $scope.ModelData.EndDate = sDate;
                                break;
                            default:
                                break;
                        }
                    }
                });
            };

            $scope.onSaveOrderInfo = function () {
                $ionicPopup.confirm({ title: $tygasoftMC.MC.Alert_Title, template: $tygasoftMC.MC.M_PandianConfirm, cancelText: $tygasoftMC.MC.Btn_CancelText, okText: $tygasoftMC.MC.Btn_OkText }).then(function (r) {
                    if (r) {
                        ts.OnSavePandian($scope);
                    }
                })
            };

            ts.GetPandianUser($scope);
        }
        else {
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
            $scope.onRowSelect = function (item) {
                window.location = "#/app/PandianProduct/" + JSON.stringify(item);
            };
        }
    };

    ts.OnSavePandian = function ($scope) {
        var jOrderInfo = {};
        jOrderInfo.OrderCode = $scope.ModelData.OrderCode;
        //jOrderInfo.Warehouse = $scope.ModelData.Warehouse;
        jOrderInfo.StartDate = $scope.ModelData.StartDate;
        jOrderInfo.EndDate = $scope.ModelData.EndDate;
        jOrderInfo.UserName = $scope.ModelData.UserName;
        $tygasoftDbHelper.DoInsert('Pandian', 'Admin', $tygasoftMC.DataStatus.Insert, jOrderInfo.OrderCode, JSON.stringify(jOrderInfo), true).then(function (res) {
            if (!res) {
                $ionicPopup.alert({ title: $tygasoftMC.MC.Alert_Title, template: $tygasoftMC.MC.M_ExError, okText: $tygasoftMC.MC.Btn_OkText });
                return false;
            }
            window.location = "#/app/PandianProduct/" + JSON.stringify(jOrderInfo);
        })
    };

    ts.GetWarehouseList = function ($scope) {
        $scope.WarehouseItems = [{ "Name": "仓库一" }, { "Name": "仓库二" }, { "Name": "仓库三" }, { "Name": "仓库四" }, { "Name": "仓库五" }, { "Name": "仓库六" }, { "Name": "仓库七" }];
    };

    ts.GetPandianList = function ($scope) {
        try {
            $ionicLoading.show();
            $tygasoftDbHelper.GetAll('Pandian').then(function (res) {
                $ionicLoading.hide();
                if (res) {
                    var list = [];
                    for (var i = 0; i < res.length; i++) {
                        list.push(JSON.parse(res.item(i).ContentValue));
                    }
                    $scope.PandianItems = list;
                }
            }, function (err) {
                $ionicLoading.hide();
                alert(err)
            })
        }
        catch (e) {
            $ionicLoading.hide();
        }
    };

    ts.GetPandianUser = function ($scope) {
        $tygasoftLogin.GetLoginInfo().then(function (res) {
            $scope.ModelData.UserName = res.UserName;
        })
    };

    return ts;
});