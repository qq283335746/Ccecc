
angular.module('ngTygaSoft.services.Common', [])

.factory('$tygasoftCommon', function ($ionicPopup, $tygasoftLocalStorage, $tygasoftMC) {

    var ts = {};

    ts.AppKey = '011de50b-216d-49c4-8836-8ba2f4c9e490';

    ts.ServerUrl = function () {
        //return "http://localhost/ccecc";
        //return "http://www.tygaweb.com/ccecc";
        //return "http://192.168.245.249/ccecc";
        var serviceUrl = $tygasoftLocalStorage.Get("ServiceUrl", "");
        if (!serviceUrl || serviceUrl == '') {
            $ionicPopup.alert({ title: $tygasoftMC.MC.Alert_Title, template: $tygasoftMC.MC.M_ServiceUrlEmpty, okText: $tygasoftMC.MC.Btn_OkText }).then(function () {
                window.location = "#/app/SysSet";
            })
            return false;
        }
        if (serviceUrl.indexOf('/Services/PdaService.svc') > -1) serviceUrl = serviceUrl.replace('/Services/PdaService.svc', "");
        return serviceUrl;
    };

    ts.PageIndex = 1;
    ts.PageSize = 20;

    ts.IsMobilePhone = function (s) {
        var reg = /^0{0,1}(13[0-9]|15[0-9]|18[0-9])[0-9]{8}$/;

    };

    ts.FDate = function (value) {
        if (value == '') return new Date().Format("yyyy-MM-dd");
        return new Date(value.replace('T', ' ')).Format("yyyy-MM-dd");
    };
    ts.FDateTime = function (value) {
        if (value == '') return new Date().Format("yyyy-MM-dd hh:mm:ss");
        return new Date(value.replace('T', ' ')).Format("yyyy-MM-dd hh:mm:ss");
    };
    ts.GetRndOrderCode = function (max) {
        return new Date().Format("yyyyMMddhhmmss") + Math.round(Math.random() * max);
    };

    ts.String = {
        IsNullOrWhiteSpace: function (s) {
            if (s) {
                if (s.replace(/^\s+|\s+$/g, "") != "") return false;
            }
            return true;
        },
        Trim: function (s) {
            return s.replace(/^\s+|\s+$/g, "");
        }
    };

    return ts;
});