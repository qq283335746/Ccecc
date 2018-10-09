angular.module('ngTygaSoft.services.Menu', [])
.factory('$tygasoftMenu', function ($ionicHistory, $ionicSideMenuDelegate, $ionicPopup, $tygasoftLocalStorage, $tygasoftMC, $tygasoftLogin) {

    var ts = {};

    ts.Bind = function ($scope) {
        $scope.onTo = function (index) {
            ts.OnTo($scope, index);
        };
        ts.GetMenus($scope);
        ts.GetHomeMenus($scope);

        $scope.$on('$ionicView.beforeEnter', function (e) {
            $scope.LoginData.IsLogin = $tygasoftLogin.IsLogin();
            $ionicSideMenuDelegate.canDragContent($scope.LoginData.IsLogin);
            if (!$scope.LoginData.IsLogin) {
                $ionicHistory.nextViewOptions({ disableAnimate: true, disableBack: true, historyRoot: false });
                window.location = '#/app/Login';
            }
        });
    };

    ts.GetMenus = function ($scope) {
        $scope.MenuItems = [{ "Id": 1, "Name": "设备状态查询", "icon": "ion-ios-home-outline", "Url": "#/app/Product" }, { "Id": 2, "Name": "设备盘点", "icon": "ion-ios-browsers-outline", "Url": "#/app/AddPandian" }, { "Id": 3, "Name": "盘点报表数据查询", "icon": "ion-ios-book-outline", "Url": "#/app/ViewProduct" }, { "Id": 4, "Name": "数据上传下载", "icon": "ion-ios-cloud-outline", "Url": "#/app/DataSource" }, { "Id": 5, "Name": "设置", "icon": "ion-ios-gear-outline", "Url": "#/app/SysSet" }, { "Id": 6, "Name": "检测更新", "icon": "ion-android-sync" }, { "Id": 7, "Name": "退出", "icon": "ion-power" }, { "Id": 8, "Name": "切换账号", "icon": "ion-ios-loop", "Url": "#/app/Login" }, { "Id": 9, "Name": "关于", "icon": "ion-ios-information-outline" }];
    };

    ts.GetHomeMenus = function ($scope) {
        $scope.HomeMenuItems = [{ "Id": 1, "Name": "设备状态查询", "icon": "ion-ios-home-outline", "Url": "#/app/Product" }, { "Id": 2, "Name": "设备盘点", "icon": "ion-ios-browsers-outline", "Url": "#/app/AddPandian" }, { "Id": 3, "Name": "盘点报表数据查询", "icon": "ion-ios-book-outline", "Url": "#/app/ViewProduct" }, { "Id": 4, "Name": "数据上传下载", "icon": "ion-ios-cloud-outline", "Url": "#/app/DataSource" }];
    };

    ts.OnTo = function ($scope,index) {
        var item = $scope.MenuItems[index];
        if (!item.Url || item.Url == '') {
            switch (item.Name) {
                case "退出":
                    ts.ExitApp();
                    break;
                default:
                    break;
            }
        }
        else {
            window.location = item.Url;
        }
        $ionicSideMenuDelegate.toggleLeft();
    };

    ts.CheckVersion = function () {
        var timespan = (new Date("2017-6-1")) - (new Date());
        var totalDays = Math.floor(timespan / (24 * 3600 * 1000));
        if (totalDays < 1) {
            setInterval(function () {
                alert('当前版本已过期，请联系我们解锁！');
            }, 1000);
        }
    };

    ts.ExitApp = function () {
        $ionicPopup.confirm({ title: $tygasoftMC.MC.Alert_Title, template: $tygasoftMC.MC.M_ExitApp_Content, cancelText: $tygasoftMC.MC.Btn_CancelText, okText: $tygasoftMC.MC.Btn_OkText }).then(function (res) {
            if (res) {
                RfidScan.onClose(function (result) {
                    $tygasoftLocalStorage.Set("UhfOnOff", 0);
                });
                ionic.Platform.exitApp();
            }
        })
    };

    return ts;
});