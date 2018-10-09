var exec = require('cordova/exec');

exports.HelloWord = function (arg0, success, error) {
    exec(success, error, "CustomPlugin", "HelloWord", [arg0]);
};

exports.onImport = function(arg0,success, error) {
    exec(success, error, "CustomPlugin", "onImport", [arg0]);
};

exports.onExport = function(arg0,success, error) {
    exec(success, error, "CustomPlugin", "onExport", [arg0]);
};