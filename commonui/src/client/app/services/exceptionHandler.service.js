(function () {
    'use strict';

    angular
        .module('wdts.commonui.services')
        .factory('$exceptionHandler',  ['logger', function(logger) {
            return function myExceptionHandler(exception) {
                logger.fatal(exception.stack);
            };
        }]);
})();

