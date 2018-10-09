angular.module('ngTygaSoft.services.Login', [])

.factory('$tygasoftLogin', function ($q,$http, $ionicModal, $ionicHistory, $ionicLoading, $ionicPopup, $tygasoftMC, $tygasoftCommon, $tygasoftLocalStorage, $tygasoftDbHelper) {

    var ts = {};

    ts.Bind = function ($scope) {
        $scope.doLogin = function () {
            ts.Login($scope);
        };
    };

    ts.IsLogin = function () {
        return parseInt($tygasoftLocalStorage.Get('IsLogin', 0)) == 1;

        //var q = $q.defer();
        //$tygasoftDbHelper.GetValueByKey('KeyValue', 'DeviceInfo').then(function (result) {
        //    if (result) {
        //        return q.resolve(!JSON.parse(result).UserName.IsNullOrEmpty());
        //    }
        //    return q.resolve(false);
        //})
        //return q.promise;
    };

    ts.GetLoginInfo = function () {
        var q = $q.defer();
        $tygasoftDbHelper.GetValueByKey('KeyValue', 'DeviceInfo').then(function (result) {
            q.resolve(JSON.parse(result));
        })
        return q.promise;
    };

    ts.Login = function ($scope) {
        //$tygasoftLocalStorage.Set('IsLogin', 1);
        //ts.ToHome();
        //return false;
        if ((!$scope.LoginData.UserName || $scope.LoginData.UserName == '') || (!$scope.LoginData.Password || $scope.LoginData.Password == '')) {
            $ionicPopup.alert({ title: $tygasoftMC.MC.Alert_Title, template: $tygasoftMC.MC.Login_EmptyError, okText: $tygasoftMC.MC.Btn_OkText });
            return false;
        }
        $tygasoftDbHelper.GetValueByKey('Users', $scope.LoginData.UserName).then(function (res) {
            var jData = JSON.parse(res);
            if (jData.Password != $scope.LoginData.Password) {
                $ionicPopup.alert({ title: $tygasoftMC.MC.Alert_Title, template: $tygasoftMC.MC.Login_InvalidError, okText: $tygasoftMC.MC.Btn_OkText });
                return false;
            }
            var dlgShow = $ionicPopup.show({ title: $tygasoftMC.MC.Alert_Title, template: $tygasoftMC.MC.Login_Ok });
            $tygasoftDbHelper.GetValueByKey('KeyValue', 'DeviceInfo').then(function (deviceInfo) {
                var jDeviceInfo = JSON.parse(deviceInfo);
                jDeviceInfo.UserName = $scope.LoginData.UserName;
                $tygasoftDbHelper.DoInsert('KeyValue', 'Admin', '', "DeviceInfo", JSON.stringify(jDeviceInfo), true).then(function (res) {
                    $tygasoftLocalStorage.Set('IsLogin', 1);
                    setTimeout(function () {
                        dlgShow.close();
                        ts.ToHome();
                    }, 1000);
                });
            });

        }, function (err) {
            console.log('Login--err--' + err);
            $ionicPopup.alert({ title: $tygasoftMC.MC.Alert_Title, template: $tygasoftMC.MC.M_ExError, okText: $tygasoftMC.MC.Btn_OkText });
        })
    };

    ts.ToHome = function () {
        window.location = '#/app/Default';
    };

    ts.SetRootView = function () {
        $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true,
            historyRoot: true
        });
        window.location = '#/app/Default';
    };

    return ts;
});