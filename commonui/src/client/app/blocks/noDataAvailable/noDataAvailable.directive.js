(function () {
    'use strict';

    angular.module('wdts.commonui.blocks.noDataAvailable')
        .directive('noDataAvailable', noDataAvailable);

    noDataAvailable.$inject = [];
    function noDataAvailable() {
        
        var defaultMessageKey = 'application.app.common.labels.NO_DATA_AVAILABLE';

        return {
            transclude: true,
            scope: {
                totalCount: '=',
                fetchingData: '=',      //{boolean} - TRUE if waiting for server response, otherwise FALSE
                noDataMessageKey: '@'   //{string}  - optional parameter to set custom message
            },
            templateUrl: 'bower_components/wdts-common-ui/src/client/app/blocks/noDataAvailable/noDataAvailable.html',
            link: function (scope, elem) {
                scope.totalCount = +scope.totalCount;
                scope.noDataMessageKey = scope.noDataMessageKey || defaultMessageKey;
            }
        };
    }
})();