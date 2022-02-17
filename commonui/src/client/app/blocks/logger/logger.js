(function() {
    'use strict';

    angular
        .module('wdts.commonui.blocks.logger')
        .factory('logger', logger);

    logger.$inject = ['$log', '$window', 'toastr', 'store', 'jwtHelper', 'jwtTokenKey','config'];

    function logger($log, $window, toastr, store, jwtHelper, jwtTokenKey,config) {
        var LOCAL_STORAGE_LOGS_KEY = 'wdts.local.logs';
        var LOGS_LIMIT_INTERVAL = 5000;
        let logWorker;

        initWW();
        // setInterval(sendLogs, LOGS_LIMIT_INTERVAL);     //sending logs array every 5 seconds
        setInterval(sendLogsWW, LOGS_LIMIT_INTERVAL);     //sending logs array every 5 seconds

        return ({
            fatal: logFatal,
            error: logError,
            warn: logWarn,
            debug: logDebug,
            info: logInfo,
            success: logSuccess
        });

        function logFatal(message, exception) {
            // display toastr message
            // toastr.error(message);

            // preserve default behaviour
            $log.error.apply($log, arguments);

            // use stackTrace.js pintStackTrace() method to generate
            // a stack trace.
            var stackTrace = printStackTrace({e: exception});

            addLogObject($window.location.href, message, 'FATAL', stackTrace);
        }

        function logError(message) {
            // display toastr message
            toastr.error(message);

            // preserve default behaviour
            $log.error.apply($log, arguments);

            addLogObject($window.location.href, message, 'ERROR', null);
        }

        function logWarn(message) {
            // display toastr message
            if(message.length < 100) {
                toastr.warning(message);
            }

            // preserve default behaviour
            $log.warn.apply($log, arguments);

            addLogObject($window.location.href, message, 'WARN', null);
        }

        function logDebug(message) {
            toastr.info(message);

            // preserve default behaviour
            $log.debug.apply($log, arguments);

            addLogObject($window.location.href, message, 'DEBUG', null);
        }

        function logInfo(message) {
            // display toastr message
            toastr.info(message);

            // preserve default behaviour
            $log.info.apply($log, arguments);

            addLogObject($window.location.href, message, 'INFO', null);
        }

        function logSuccess(message) {
            // display toastr message
            toastr.success(message);

            // preserve default behaviour
            $log.info.apply($log, arguments);

            addLogObject($window.location.href, message, 'INFO', null);
        }

        function getLogsFromLocalStorage () {
            return JSON.parse(localStorage.getItem(LOCAL_STORAGE_LOGS_KEY)) || [];
        }

        function saveLogsToLocalStorage (logs) {
            localStorage.setItem(LOCAL_STORAGE_LOGS_KEY, JSON.stringify(logs));
        }

        function addLogObject (url, message, level, stackTrace) {
            var jwtCode = store.get(jwtTokenKey);
            var logsBuffer = getLogsFromLocalStorage();
            if(jwtCode) {
                var decodedJwt = jwtHelper.decodeToken(jwtCode);

                logsBuffer.push({
                    timestamp: new Date().getTime(),
                    path: url,
                    app_url: url,
                    application_name:decodedJwt.authorities[0].applicationCode,
                    user_id: decodedJwt.userId,
                    host: decodedJwt.host,
                    message: message,
                    priority: level,
                    stack_trace: (stackTrace || '')
                });

                saveLogsToLocalStorage(logsBuffer);
            }
        }

        function sendLogs () {
            var logsBuffer = getLogsFromLocalStorage();

            if(logsBuffer.length){
                try {

                    // send server side
                    // You do NOT use the AngularJS $http service.
                    // For two reasons, firstly it will create a circular
                    // dependency which you really want to avoid, and secondly
                    // if the AngularJS app is fubar’d you still have a chance
                    // of logging the error to your server

                    $.ajax({
                        type: 'PUT',
                        url: config.log,
                        contentType: 'application/json',
                        data: angular.toJson(logsBuffer),
                        success: function (data, textStatus, XMLHttpRequest) {
                            //remove logs array that successfully sent
                            //from localStorage
                            logsBuffer.splice(0, logsBuffer.length);
                            saveLogsToLocalStorage(logsBuffer);
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            // If size of logsBuffer is more than 5MB, and API fails clear the logsBuffer.
                            if(MegabyteCount(JSON.stringify(logsBuffer)) > 5){
                                logsBuffer.splice(0, logsBuffer.length);
                                saveLogsToLocalStorage(logsBuffer);
                            }
                            $log.warn('Failed to persist log to server: ' + errorThrown);
                        }
                    });
                } catch (loggerException) {
                    $log.warn('Failed to persist log to server: ' + loggerException.toString());
                }
            }
        }

        function sendLogsWW(){
            let logsBuffer = getLogsFromLocalStorage();
            if(logsBuffer.length){
                //logWorker.postMessage(JSON.stringify({type: "ajax", data: JSON.stringify(logsBuffer)}))
            }
        }

        function initWW(){
            logWorker = new Worker('dist/web-worker-logger.js');
            //logWorker.postMessage(JSON.stringify({type: 'set', url: config.log}));
            bindEvents()
        }

        function bindEvents(){
            logWorker.onmessage = function(msg){
                let result = JSON.parse(msg.data);
                let logsBuffer = getLogsFromLocalStorage();
                if(result.type === 'ajax'){
                    switch (result.msg){
                        case "success":
                            logsBuffer.splice(0, logsBuffer.length);
                            saveLogsToLocalStorage(logsBuffer);
                            break;
                        case "error":
                            if(MegabyteCount(JSON.stringify(logsBuffer)) > 5){
                                logsBuffer.splice(0, logsBuffer.length);
                                saveLogsToLocalStorage(logsBuffer);
                            }
                            break;
                    }
                }
            }
        }

        /**
         * @param {String} s the string whose size needs to be calculated
         * @return {Number} Size in MB
         * @description Return the size of the string passed in MB
         * */
        function MegabyteCount(s) {
            return Math.floor((encodeURI(s).split(/%..|./).length - 1)/1024000);//Convert the length of the string passed from byte to megaByte
        }
    }
}());
