(function () {
    'use strict';

    angular
        .module('wdts.commonui.services')
        .factory('tableService', tableService);

    tableService.$inject = ['$http', 'config','$rootScope','exception', 'store', 'jwtTokenKey'];

    function tableService($http,config,$rootScope,exception,store,jwtTokenKey) {
        var service = {
            children: [],
            map: [],
            tableId : '',
            startStopBurn: startStopBurn
        };

        service.setData = function (arg) {
            console.log('in setData of tableService');
            console.log(arg);
            service.children = arg;
            updateData();
        };

        service.getData = function () {
            return service.children;
        };

        service.setMap = function (arg) {
            console.log('in set map for table service');
            service.map = arg;
            updateMap();
        };

        service.getMap = function () {
            return service.map;
        };

        service.setTableId = function(arg){
          service.tableId = arg;
        };

        service.getTableId = function(){
          return service.tableId;
        };

        function updateData() {
            $rootScope.$broadcast('tabledata');  // broadcasts the update to listeners
        }

        function updateMap(){
            $rootScope.$broadcast('setmapdata');
        }


        function startStopBurn(url, dataParams, token){
            return $http({
                method: 'POST',
                url: url,
                headers: {
                    'Content-Type': 'application/json','Authorization': "Bearer " + token
                },
                data: dataParams
            })
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        return service;

    }
})();
