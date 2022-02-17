(function () {
    'use strict';

    angular
    .module('wdts.openerCloser')
    .service('openerCloserService', openerCloserService);

    openerCloserService.$inject = ['$http', 'config', 'exception','store','jwtTokenKey'];

    function openerCloserService($http, config, exception,store,jwtTokenKey) {
        this.getOpenerCloser = getOpenerCloser;
        this.getOpenerCloserReportData = getOpenerCloserReportData;

        function getOpenerCloser(siteId, gamingDayFromURL, start, limitRecord, filterArray, sortObj) {
            var configParams = {
                topologyId: siteId,
                gamingDay: gamingDayFromURL,
                start: start,
                limit: limitRecord
            };

            if(sortObj && sortObj.sortField && sortObj.sortOrder){
                configParams.sortField = sortObj.sortField;
                configParams.sortOrder = sortObj.sortOrder;
            }

            angular.forEach(filterArray, function (item) {
                angular.extend(configParams, item);
            });

            return $http({
                method: 'GET',
                url: config.cage.route + 'paginatedOpenerCloser',
                headers: {
                    'Content-Type': 'application/json','Authorization': "Bearer " + store.get(jwtTokenKey)
                },
                params: configParams
            }).then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response;
            }
        }

        function getOpenerCloserReportData(tableId, gamingDay) {
            var configParams = {
                topologyId: tableId,
                gamingDay: gamingDay
            };
            return $http({
                method: 'GET',
                url: config.cage.route + 'openerCloserReportData',
                params: configParams
            }).then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data.successObj;
            }
        }
    }
})();