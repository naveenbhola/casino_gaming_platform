(function () {
    'use strict';

    angular
        .module('wdts.commonui.services')
        .factory('inventoryService', inventoryService);

    inventoryService.$inject = ['$http', '$q', 'logger', 'config', '$rootScope','exception'];

    function inventoryService($http, $q, logger, config, $rootScope,exception) {
        var service = {
            getInventoryData: getInventoryData
        };

        return service;

        function getInventoryData(topologyId,gamingDay, sortObject) {
            
           var url = config.cage.route + 'chipTrayInventory/' + topologyId + '?gamingDay=' + gamingDay;
            

            if(sortObject && sortObject.sortField && sortObject.sortOrder) {
                url += '&' + "sortField" + '=' + sortObject.sortField;
                url += '&' + "sortOrder" + '=' + sortObject.sortOrder;
            }

            return $http({

                method: 'get',
                url: url,
                headers: {'Content-Type': 'application/json'},
                data: ''
            }).then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }



    }
})();
