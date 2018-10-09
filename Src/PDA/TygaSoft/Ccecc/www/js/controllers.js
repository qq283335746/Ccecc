angular.module('starter.controllers', [])

.controller('AppCtrl', function ($scope, $tygasoftMenu) {
    $scope.LoginData = {};
    $tygasoftMenu.Bind($scope);

    $scope.$on('$ionicView.enter', function (e) {
        $tygasoftMenu.CheckVersion();
    });
})
.controller('DefaultCtrl', function ($scope) {
    $scope.$on('$ionicView.enter', function (e) {
    });
})
.controller('LoginCtrl', function ($scope, $tygasoftLogin) {
    $scope.LoginData = { UserName: 'admin', Password:'admin963' };
    //$tygasoftLogin.IsLogin().then(function (r) {
    //    alert('rrrrr--' + r);
    //    if (r) {
    //        window.location = '#/app/Default';
    //    }
    //    else {
    //        $ionicSideMenuDelegate.canDragContent(false);
    //    }
    //}, function (err) {
    //    $ionicSideMenuDelegate.canDragContent(false);
    //});
    
    $tygasoftLogin.Bind($scope);
})
.controller('ProductCtrl', function ($scope, $tygasoftProduct, $tygasoftRfid) {
    $scope.ModelData = { "Barcode": "" };
    $scope.CanRead = true;
    var itvRfid = null;
    $tygasoftProduct.Bind($scope);

    $scope.$on('$ionicView.beforeEnter', function (e) {
        $tygasoftRfid.Reset();
    });
    $scope.$on('$ionicView.enter', function (e) {
        $tygasoftRfid.SetResult();
        itvRfid = setInterval(function () {
            if (!$scope.CanRead) return;
            if (!$scope.ModelData.Barcode || $scope.ModelData.Barcode == '') {
                var rfid = $tygasoftRfid.GetRfid();
                $scope.CanRead = false;
                if (rfid != '') {
                    $scope.ModelData.Barcode = rfid;
                    $scope.onBarcodeChanged();
                }
                else $scope.CanRead = true;
            }
        }, 100);
    });
    $scope.$on('$ionicView.leave', function (e) {
        clearInterval(itvRfid);
        $scope.CanRead = false;
        $tygasoftRfid.Reset();
    });
})
.controller('AddPandianCtrl', function ($scope, $tygasoftCommon, $tygasoftPandian) {
    $scope.ModelData = { "OrderCode": "" + $tygasoftCommon.GetRndOrderCode(999) + "", "StartDate": "请选择", "EndDate": "请选择" };
    $tygasoftPandian.Bind($scope, "AddPandian");
})
.controller('PandianCtrl', function ($scope, $tygasoftPandian) {
    $scope.ModelData = {};
    $tygasoftPandian.Bind($scope, "Pandian");
    $scope.$on('$ionicView.enter', function (e) {
        $tygasoftPandian.GetPandianList($scope);
    });
})
.controller('PandianProductCtrl', function ($scope, $stateParams, $tygasoftPandianProduct, $tygasoftRfid) {
    $scope.ModelData = { "Barcode": "" };
    $scope.ModelInfo = JSON.parse($stateParams.item);
    $scope.CanRead = true;
    var itvRfid = null;
    $tygasoftPandianProduct.Bind($scope, "");

    $scope.$on('$ionicView.beforeEnter', function (e) {
        $tygasoftRfid.Reset();
    });
    $scope.$on('$ionicView.enter', function (e) {
        $tygasoftPandianProduct.GetPandianProductList($scope);
        $tygasoftRfid.SetResult();

        itvRfid = setInterval(function () {
            if (!$scope.CanRead) return;
            if (!$scope.ModelData.Barcode || $scope.ModelData.Barcode == '') {
                var rfid = $tygasoftRfid.GetRfid();
                $scope.CanRead = false;
                if (rfid != '') {
                    $scope.ModelData.Barcode = rfid;
                    $scope.onBarcodeChanged();
                }
                else $scope.CanRead = true;
            }
        }, 100);
    });
    $scope.$on('$ionicView.leave', function (e) {
        clearInterval(itvRfid);
        $scope.CanRead = false;
        $tygasoftRfid.Reset();
    });
})
.controller('ViewProductCtrl', function ($scope, $tygasoftProduct) {
    $scope.ModelData = {"StartDate":"请选择"};
    $scope.$on('$ionicView.enter', function (e) {
        $tygasoftProduct.GetProductList($scope);
    });
    
    $scope.onSearch = function () {
        $tygasoftProduct.SearchProduct($scope, $scope.ModelData.OrderCode, $scope.ModelData.UserName, $scope.ModelData.StartDate);
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
})
.controller('DataSourceCtrl', function ($scope) {
    $scope.DataItems = [{ "Id": 1, "Name": "导入数据", "icon": "ion-ios-shuffle", "Url": "#/app/ImportData" }, { "Id": 2, "Name": "导出数据", "icon": "ion-ios-snowy", "Url": "#/app/ExportData" }]
})
.controller('ImportDataCtrl', function ($scope, $tygasoftImportData) {
    $tygasoftImportData.Bind($scope);
})
.controller('ExportDataCtrl', function ($scope, $tygasoftExportData) {
    $tygasoftExportData.Bind($scope);
    $scope.$on('$ionicView.enter', function (e) {
        $tygasoftExportData.GetPandianProductList($scope);
    });
})
.controller('SysCtrl', function ($scope, $tygasoftLocalStorage, $tygasoftSys) {
    $scope.ModelData = { "ServiceUrl": "" + $tygasoftLocalStorage.Get("ServiceUrl", "") + "", "UhfOnOff": "checked" };
    $tygasoftSys.Bind($scope);
});
