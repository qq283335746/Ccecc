angular.module('ngTygaSoft.services.Product', [])

.factory('$tygasoftProduct', function ($ionicLoading, $ionicPopup, $ionicModal, ionicDatePicker, $tygasoftMC, $tygasoftCommon, $tygasoftDbHelper) {

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
        $ionicModal.fromTemplateUrl('templates/DlgProductInfo.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.productInfoModal = modal;
        });
        $scope.onCancelDlgProductInfo = function () {
            $scope.productInfoModal.hide();
            $scope.ModelData.Barcode = '';
            if ($scope.btnTabIndex == 0) {
                setTimeout(function () {
                    $scope.CanRead = true;
                }, 1000);
            }
        };
        
    };

    ts.GetBarcode = function ($scope) {
        var barcode = $scope.ModelData.Barcode;
        $scope.ModelData.Barcode = '';
        if (!barcode || barcode == '') return false;

        ts.GetProductInfo($scope, barcode);
    };

    ts.GetProductInfo = function ($scope, barcode) {
        try {
            $ionicLoading.show();
            $tygasoftDbHelper.GetValueByKey('Product', barcode).then(function (res) {
                $ionicLoading.hide();
                if (!res) {
                    $ionicPopup.alert({ title: $tygasoftMC.MC.Alert_Title, template: $tygasoftMC.GetString('Params_NotExist', barcode), okText: $tygasoftMC.MC.Btn_OkText }).then(function () {
                        $scope.CanRead = true;
                    })
                    return false;
                }
                $scope.ProductInfo = JSON.parse(res);
                $scope.productInfoModal.show();
            }, function (err) {
                $ionicLoading.hide();
                alert(err)
            })
        }
        catch (e) {
            $ionicLoading.hide();
        }
    };

    ts.GetProductList = function ($scope) {
        try {
            $ionicLoading.show();
            $tygasoftDbHelper.GetAll('Product').then(function (res) {
                $ionicLoading.hide();
                if (res) {
                    var list = [];
                    for (var i = 0; i < res.length; i++) {
                        list.push(JSON.parse(res.item(i).ContentValue));
                    }
                    $scope.ProductItems = list;
                }
            }, function (err) {
                $ionicLoading.hide();
                alert($tygasoftMC.MC.M_LoadingError);
            })
        }
        catch (e) {
            $ionicLoading.hide();
            alert($tygasoftMC.MC.M_LoadingError);
        }
    };

    ts.SearchProduct = function ($scope,orderCode,userName,startDate) {
        var s = '';
        if (orderCode && orderCode != '') {
            s += '"OrderCode":"'+orderCode+'"';
        }
        if (userName && userName != '') {
            s += '"OrderUserName":"' + userName + '"';
        }
        if (startDate && startDate.replace('请选择','') != '' ) {
            s += '"OrderStartDate":"' + startDate + '"';
        }
        if (s != '') {
            var sqlWhere = 'and ContentValue like ' + s + '';
            $tygasoftDbHelper.ExecuteReader('Product', sqlWhere).then(function (res) {
                if (res && res.length > 0) {
                    var list = [];
                    for (var i = 0; i < res.length; i++) {
                        var rowItem = JSON.parse(res.item(i).ContentValue);
                        list.push(rowItem);
                    }
                    $scope.ProductItems = list;
                }
            })
        }
    };

    return ts;
});