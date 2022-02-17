(function () {
    'use strict';

    angular
        .module('wdts.commonui.blocks.exception')
        .factory('exception', exception);

    /* @ngInject */
    function exception($q, logger, $translate) {
        var service = {
            catcher: catcher,
            catcherHttp: catcherHttp
        };
        return service;

        function catcher(message) {
            return function (e) {
                var thrownDescription;
                var newMessage;
                if (e.data && e.data.description) {
                    thrownDescription = '\n' + e.data.description;
                    newMessage = message + thrownDescription;
                }
                e.data.description = newMessage;
                logger.fatal(newMessage, e);
                return $q.reject(e);
            };
        }

        /*@Jay
         @description:only for http error that is define in the strings.json for english and chinese.
         */
        function catcherHttp(message) {
            return function (e) {
                var statusCodeArray = ["400", "403", "404", "405", "406", "407", "408", "409", "410", "411", "412", "413", "414", "415", "416", "417", "500", "501", "502", "503", "504", "505", "511"];
                var str = $translate.instant("application.app.common.httpmessage." + e.status);
                if (statusCodeArray.indexOf(e.status.toString()) > -1) {
                    if(message){
                        str += '<br>' + $translate.instant(message);
                    }
                    logger.fatal(str, e);
                    $('.modal.in').modal('hide');
                    return $q.reject(e);
                } else {
                    return $q.reject(e);
                }
            };
        }
    }

    exception.$inject = ["$q", "logger", "$translate"];
})();