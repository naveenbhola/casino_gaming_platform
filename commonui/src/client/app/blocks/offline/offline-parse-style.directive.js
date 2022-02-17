(function () {
    'use strict';

    angular
        .module('wdts.commonui.blocks.offline')
        .directive('offlineParseStyle', offlineParseStyle);

    /* @ngInject */
    offlineParseStyle.$inject = ['$interpolate'];

    function offlineParseStyle($interpolate) {
        return function (scope, elem) {
            var exp = $interpolate(elem.html()),
                watchFunc = function () {
                    return exp(scope);
                };

            scope.$watch(watchFunc, function (html) {
                elem.html(html);
            });
        };
    }
})();
