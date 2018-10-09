angular.module('ngTygaSoft.services.PandianProduct', [])

.factory('$tygasoftPandianProduct', function ($http, $ionicLoading, $ionicPopup, $ionicModal, ionicDatePicker, $tygasoftMC, $tygasoftCommon, $tygasoftDbHelper) {

    var ts = {};

    ts.Bind = function ($scope, key) {
        $scope.btnTabIndex = 0;
        $scope.onTabSelected = function (index) {
            $scope.btnTabIndex = index;
            RfidScan.onPause(index);
            $scope.CanRead = index == 0;
        };
        $scope.onBarcodeChanged = function () {
            if ($scope.btnTabIndex == 0) {
                ts.GetBarcode($scope);
            }
        };
        $scope.onSure = function () {
            ts.GetBarcode($scope);
        };
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
        $ionicModal.fromTemplateUrl('templates/DlgPandianProduct.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.pandianProductModal = modal;
        });
        $ionicModal.fromTemplateUrl('templates/DlgTechStatus.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.techStatusModal = modal;
        });
        $scope.onCancelDlgPandianProduct = function () {
            $scope.pandianProductModal.hide();
            $scope.ModelData.Barcode = '';
            if ($scope.btnTabIndex == 0) {
                setTimeout(function () {
                    $scope.CanRead = true;
                }, 1000);
            }
        };
        $scope.onDlgTechStatus = function () {
            $scope.TechStatusItems = [{ "Name": "良好" }, { "Name": "待修" }, { "Name": "报废" }];
            $scope.techStatusModal.show();
        };
        $scope.onCloseDlgTechStatus = function () {
            $scope.techStatusModal.hide();
        };
        $scope.onSelectTechStatus = function (index) {
            var item = $scope.TechStatusItems[index];
            $scope.ProductInfo.TechStatus = item.Name;
            $scope.onCloseDlgTechStatus();
        };
        $scope.onSavePandianProduct = function () {
            ts.OnSavePandianProduct($scope);
        };
    };

    ts.OnSavePandianProduct = function ($scope) {
        try {
            $scope.ProductInfo.TechStatus = $scope.ProductInfo.TechStatus.replace("请选择", '');
            $scope.ProductInfo.OrderCode = $scope.ModelInfo.OrderCode;
            $scope.ProductInfo.OrderUserName = $scope.ModelInfo.UserName;
            $scope.ProductInfo.OrderStartDate = $scope.ModelInfo.StartDate;
            $scope.ProductInfo.OrderEndDate = $scope.ModelInfo.EndDate;
            $tygasoftDbHelper.DoInsert('Product', 'Admin', $tygasoftMC.DataStatus.Update, $scope.ProductInfo.Rfid, JSON.stringify($scope.ProductInfo), true);
            var key = $scope.ProductInfo.Rfid + "|" + $scope.ModelInfo.OrderCode;
            var value = JSON.stringify($scope.ProductInfo);
            $ionicLoading.show();
            $tygasoftDbHelper.DoInsert('PandianProduct', 'Admin', $tygasoftMC.DataStatus.Update, key, value, true).then(function (res) {
                $ionicLoading.hide();
                if (!res || res == 0) {
                    $ionicPopup.alert({ title: $tygasoftMC.MC.Alert_Title, template: $tygasoftMC.MC.M_ExError, okText: $tygasoftMC.MC.Btn_OkText });
                    return false;
                }
                $ionicPopup.alert({ title: $tygasoftMC.MC.Alert_Title, template: $tygasoftMC.MC.Response_Ok, okText: $tygasoftMC.MC.Btn_OkText });
                ts.GetPandianProductList($scope);
                $scope.onCancelDlgPandianProduct();
            }, function (err) {
                $ionicLoading.hide();
                alert($tygasoftMC.MC.M_ExError);
            })
        }
        catch (e) {
            $ionicLoading.hide();
            alert($tygasoftMC.MC.M_ExError);
        }
    };

    ts.GetBarcode = function ($scope) {
        var barcode = $scope.ModelData.Barcode;
        $scope.ModelData.Barcode = '';
        if (!barcode || barcode == '') return false;

        ts.GetProductInfo($scope, barcode);
    };

    ts.GetProductInfo = function ($scope,barcode) {
        try {
            $ionicLoading.show();
            $tygasoftDbHelper.GetValueByKey('Product',barcode).then(function (res) {
                $ionicLoading.hide();
                if (!res) {
                    $ionicPopup.alert({ title: $tygasoftMC.MC.Alert_Title, template: $tygasoftMC.GetString('Params_NotExist', barcode), okText: $tygasoftMC.MC.Btn_OkText }).then(function () {
                        $scope.CanRead = true;
                    })
                    return false;
                }
                $scope.ProductInfo = JSON.parse(res);
                if (!$scope.ProductInfo.TechStatus || $scope.ProductInfo.TechStatus == '') $scope.ProductInfo.TechStatus = '请选择';
                $scope.pandianProductModal.show();
            }, function (err) {
                $ionicLoading.hide();
                alert($tygasoftMC.MC.M_ExError);
            })
        }
        catch (e) {
            $ionicLoading.hide();
            alert($tygasoftMC.MC.M_ExError);
        }
    }

    ts.GetPandianProductList = function ($scope) {
        try {
            var sqlWhere = "and KeyName like '%" + $scope.ModelInfo.OrderCode + "%' ";
            $tygasoftDbHelper.ExecuteReader('PandianProduct', sqlWhere).then(function (res) {
                if (res) {
                    var list = [];
                    for (var i = 0; i < res.length; i++) {
                        list.push(JSON.parse(res.item(i).ContentValue));
                    }
                    $scope.PandianProductItems = list;
                }
            })
        }
        catch (e) {}
    };

    return ts;
});