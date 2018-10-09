var db = null;

angular.module('starter', ['ionic', 'ionic-datepicker', 'ngCordova', 'ngTygaSoft', 'starter.controllers'])
.run(function ($ionicPlatform, $ionicHistory, $rootScope, $state, $cordovaToast, $cordovaDevice, $cordovaSQLite, $tygasoftLocalStorage, $tygasoftMC, $tygasoftDbHelper, $tygasoftLogin) {
    $ionicPlatform.ready(function () {
        if (cordova.platformId === 'ios' && window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }

        db = $cordovaSQLite.openDB({ name: "CceccDb.db", location: 1 });
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS KeyValue (Id integer primary key, KeyName nvarchar(100), ContentValue ntext,UserName nvarchar(50),Status nvarchar(20))");
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Users (Id integer primary key, KeyName nvarchar(100), ContentValue ntext,UserName nvarchar(50),Status nvarchar(20))");
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Product (Id integer primary key, KeyName nvarchar(100), ContentValue ntext,UserName nvarchar(50),Status nvarchar(20))");
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Pandian (Id integer primary key, KeyName nvarchar(100), ContentValue ntext,UserName nvarchar(50),Status nvarchar(20))");
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS PandianProduct (Id integer primary key, KeyName nvarchar(100), ContentValue ntext,UserName nvarchar(50),Status nvarchar(20))");

        var jDevice = { "Platform": "" + $cordovaDevice.getPlatform() + "", "UUID": "" + $cordovaDevice.getUUID() + "", "Version": "" + $cordovaDevice.getVersion() + "", "Latlng": "", "UserName": "", "AccessToken": "" };
        $tygasoftDbHelper.DoInsert('KeyValue', 'Admin', $tygasoftMC.DataStatus.SysAdd, 'DeviceInfo', JSON.stringify(jDevice), false);
        $tygasoftDbHelper.DoInsert('Users', 'Admin', $tygasoftMC.DataStatus.SysAdd, 'admin', '{"Named":"admin","Password":"admin963"}', false);
        //$tygasoftLocalStorage.Set("RefreshTimeout", 30);

        $ionicPlatform.registerBackButtonAction(function (e) {
            if ($ionicHistory.backView()) {
                $ionicHistory.goBack();
            }
            else {
                if ($rootScope.backButtonPressedOnceToExit) {
                    RfidScan.onPause(1);
                    ionic.Platform.exitApp();
                } else {
                    $rootScope.backButtonPressedOnceToExit = true;
                    $cordovaToast.showShortCenter($tygasoftMC.MC.M_ExitApp);
                    setTimeout(function () {
                        $rootScope.backButtonPressedOnceToExit = false;
                    }, 2000);
                }
            }
            e.preventDefault();
            return false;
        }, 101);

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
            if (!$tygasoftLogin.IsLogin()) {
                if (toState.name == 'app.Login') {
                    $ionicHistory.nextViewOptions({ disableAnimate: true, disableBack: true, historyRoot:false });
                }
                else{
                    $state.go('app.Login');
                    event.preventDefault();
                }
            }
        });

        $tygasoftLocalStorage.Set("ServiceUrl", "http://www.tygaweb.com/ccecc");
        RfidScan.onOpen();
        $tygasoftLocalStorage.Set("UhfOnOff", 0);
    });
})

.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, ionicDatePickerProvider) {
    $ionicConfigProvider.navBar.alignTitle('center');
    $ionicConfigProvider.scrolling.jsScrolling(true);
    ionicDatePickerProvider.configDatePicker({
        inputDate: new Date(),
        setLabel: '确定',
        todayLabel: '今天',
        closeLabel: '关闭',
        mondayFirst: false,
        weeksList: ["日", "一", "二", "三", "四", "五", "六"],
        monthsList: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        templateType: 'popup',
        showTodayButton: true,
        dateFormat: 'yyyy年MM月dd日',
        closeOnSelect: false,
        disableWeekdays: [6],
    });
    $stateProvider

      .state('app', {
          url: '/app',
          abstract: true,
          templateUrl: 'templates/Menu.html',
          controller: 'AppCtrl'
      })
    .state('app.Login', {
        url: '/Login',
        views: {
            'menuContent': {
                templateUrl: 'templates/Login.html',
                controller: 'LoginCtrl'
            }
        }
    })
    .state('app.Default', {
        url: '/Default',
        views: {
            'menuContent': {
                templateUrl: 'templates/Default.html',
                controller: 'AppCtrl'
            }
        }
    })
    .state('app.Product', {
        url: '/Product',
        views: {
            'menuContent': {
                templateUrl: 'templates/Product.html',
                controller: 'ProductCtrl'
            }
        }
    })
    .state('app.AddPandian', {
        url: '/AddPandian',
        views: {
            'menuContent': {
                templateUrl: 'templates/AddPandian.html',
                controller: 'AddPandianCtrl'
            }
        }
    })
    .state('app.Pandian', {
        url: '/Pandian',
        views: {
            'menuContent': {
                templateUrl: 'templates/Pandian.html',
                controller: 'PandianCtrl'
            }
        }
    })
    .state('app.PandianProduct', {
        url: '/PandianProduct/:item',
        views: {
            'menuContent': {
                templateUrl: 'templates/PandianProduct.html',
                controller: 'PandianProductCtrl'
            }
        }
    })
    .state('app.ViewProduct', {
        url: '/ViewProduct',
        views: {
            'menuContent': {
                templateUrl: 'templates/ViewProduct.html',
                controller: 'ViewProductCtrl'
            }
        }
    })
    .state('app.DataSource', {
        url: '/DataSource',
        views: {
            'menuContent': {
                templateUrl: 'templates/DataSource.html',
                controller: 'DataSourceCtrl'
            }
        }
    })
    .state('app.ImportData', {
        url: '/ImportData',
        views: {
            'menuContent': {
                templateUrl: 'templates/ImportData.html',
                controller: 'ImportDataCtrl'
            }
        }
    })
    .state('app.ExportData', {
        url: '/ExportData',
        views: {
            'menuContent': {
                templateUrl: 'templates/ExportData.html',
                controller: 'ExportDataCtrl'
            }
        }
    })
    .state('app.SysSet', {
        url: '/SysSet',
        views: {
            'menuContent': {
                templateUrl: 'templates/SysSet.html',
                controller: 'SysCtrl'
            }
        }
    })

    $urlRouterProvider.otherwise('/app/Default');
});
