(function () {
    'use strict';

    angular
        .module('wdts.commonui.services')
        .factory('cageService', cageService);


    cageService.$inject = ['$http', '$q', 'logger', 'config','exception'];

    function cageService($http, $q, logger, config,exception) {
        var service = {
            getCurrentLocalGamingDay: getCurrentLocalGamingDay,
            getCurrentGamingDay: getCurrentGamingDay,
            getRollDTM: getRollDTM,
            setRollDTM: setRollDTM,
            getChipTrayData: getChipTrayData,
            getChipTrayScanDetails: getChipTrayScanDetails,
            getFillTransaction: getFillTransaction,
            getFillDrill: getFillDrill,
            getCreditTransaction: getCreditTransaction,
            getCreditDrill: getCreditDrill,
            getBuyinTransaction: getBuyinTransaction,
            getBuyinDrill: getBuyinDrill,
            getTransactionFilters: getTransactionFilters,
            bulkEnrollProgress:bulkEnrollProgress,
            isEnrollprocess: isEnrollprocess,
            batchEnroll: batchEnroll

        };

        return service;

        function batchEnroll(data){
            return $http({
                method: 'GET',
                url: config.cage.batchEnroll + '?userId='+ data.loggedInUser +'&topologyNodeId='+ data.topologyId+'&approvedUserId='+ data.approvedUser,
                data: '',
                headers: {'Content-Type': 'application/json'}

            }).then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }
        function isEnrollprocess(){
            return $http({
                method: 'GET',
                url: config.cage.isEnrollprocess,
                data: '',
                headers: {'Content-Type': 'application/json'}

            }).then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }
        function getCurrentLocalGamingDay(id){

            if (id != null) {

                return $http({

                    method: 'GET',
                    url: config.cage.route + 'topologyRollInfo?topologyId=' + id,
                    data: '',
                    headers: {'Content-Type': 'application/json'}
                })

                    .then(success)
                    ['catch'](exception.catcherHttp());
            }

            function success(response) {
                return response.data;
            }

        }

        function getCurrentGamingDay(id) {
            if (id != null) {

                return $http({

                    method: 'GET',
                    url: config.cage.route + 'localGamingDay?topologyId=' + id,
                    data: '',
                    headers: {'Content-Type': 'application/json'}
                })
                    .then(success)
                    ['catch'](exception.catcherHttp());
            }

            function success(response) {
                return response.data;
            }

        }

        function getRollDTM(topologyId){
            return $http({
                method: 'GET',
                url: config.cage.route + 'nextRollDtm?topologyId=' + topologyId,
                data: '',
                headers: {'Content-Type': 'application/json'}

            }).then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        function setRollDTM(data,userId,employeeId){
            return $http({
                method: 'POST',
                url: config.cage.route + 'nextRollDtm/?userId=' + userId + '&employeeId=' + employeeId,
                data: data,
                headers: {'Content-Type': 'application/json'}

            }).then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        function getChipTrayData (topologyId, gamingDay, start, limit, filterArray, sortObj){
            if (topologyId !== null && gamingDay !== null) {
                var url = config.cage.route + 'chipTrayScans/table/' + topologyId;
                var params = {
                    gamingDay: gamingDay,
                    reqFilter: 1,
                    start: start,
                    limit: limit,
                    sortField: sortObj.sortField,
                    sortOrder: sortObj.sortOrder
                };

                angular.extend(params, filterArray);

                // url += filterParse(filterArray);

                return $http({
                    method: 'GET',
                    url: url,
                    headers: {'Content-Type': 'application/json'},
                    params: params
                })
                    .then(success)
                    ['catch'](exception.catcherHttp());
            }

            function success(response) {
                return response;
            }
        }

        function getChipTrayScanDetails(transId){
            return $http({
                method: 'GET',
                url: config.cage.route + 'chipTrayScans/'+transId,
                data: ''

            }).then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        function getFillTransaction (topologyNodeId, gamingDay, start, limit, filterArray, sortObject) {
            if (gamingDay != null) {
                var url = config.cage.route +
                    'transactions?gamingDay=' + gamingDay +
                    '&txnTypes=FILL&topologyIds=' + topologyNodeId +
                    '&start=' + start +
                    '&limit=' + limit;

                url += filterParse(filterArray);

                if(sortObject && sortObject.sortField && sortObject.sortOrder) {
                    url += '&' + "sortField" + '=' + sortObject.sortField;
                    url += '&' + "sortOrder" + '=' + sortObject.sortOrder;
                }

                return $http({
                    method: 'GET',
                    url: url,
                    headers: {'Content-Type': 'application/json'},
                    data: ''
                })
                    .then(success)
                    ['catch'](exception.catcherHttp());
            }

            function success(response) {
                return response;
            }
        }

        function getFillDrill (UUID) {

            if (UUID != null) {
                return $http({
                    method: 'GET',
                    url: config.chip.chips + '/summary?uuid=' + UUID,
                    headers: {'Content-Type': 'application/json'},
                    data: ''
                })
                    .then(success)
                    ['catch'](exception.catcherHttp());
            }

            function success(response) {
                console.log('fill drill data - ' + JSON.stringify(response));
                return response.data;
            }
        }

        function getCreditTransaction (topologyNodeId, gamingDay, start, limit, filterArray, sortObject) {
            if (gamingDay != null) {
                var url = config.cage.route +
                    'transactions?gamingDay=' + gamingDay +
                    '&txnTypes=CREDIT&topologyIds=' + topologyNodeId +
                    '&start=' + start +
                    '&limit=' + limit;

                url += filterParse(filterArray);

                if(sortObject && sortObject.sortField && sortObject.sortOrder) {
                    url += '&' + "sortField" + '=' + sortObject.sortField;
                    url += '&' + "sortOrder" + '=' + sortObject.sortOrder;
                }

                return $http({
                    method: 'GET',
                    url: url,
                    headers: {'Content-Type': 'application/json'},
                    data: ''
                })
                    .then(success)
                    ['catch'](exception.catcherHttp());
            }

            function success(response) {
                return response;
            }
        }

        function getCreditDrill (UUID){

            if(UUID != null) {

                return $http({
                    method: 'GET',
                    url: config.chip.chips + '?_summary=true&uuid=' + UUID,
                    headers: {'Content-Type': 'application/json'},
                    data: ''
                })
                    .then(success)
                    ['catch'](exception.catcherHttp());
            }

            function success(response) {
                return response.data;
            }
        }

        function getBuyinTransaction (topologyNodeId, gamingDay, start, limit, filterArray, sortObject){
            if (gamingDay != null) {
                var url = config.cage.route +
                    'transactions?gamingDay=' + gamingDay +
                    '&txnTypes=BUYIN&topologyIds=' + topologyNodeId +
                    '&start=' + start +
                    '&limit=' + limit;

                url += filterParse(filterArray);

                if(sortObject && sortObject.sortField && sortObject.sortOrder) {
                    url += '&' + "sortField" + '=' + sortObject.sortField;
                    url += '&' + "sortOrder" + '=' + sortObject.sortOrder;
                }

                return $http({
                    method: 'GET',
                    url: url,
                    headers: {'Content-Type': 'application/json'},
                    data: ''
                })
                    .then(success)
                    ['catch'](exception.catcherHttp());
            }

            function success(response) {
                return response;
            }
        }

        function getBuyinDrill (UUID){

            if(UUID !== null) {

                return $http({
                    method: 'GET',
                    url: config.chip.chips + '/summary?uuid=' + UUID,
                    headers: {'Content-Type': 'application/json'},
                    data: ''
                })
                    .then(success)
                    ['catch'](exception.catcherHttp());
            }

            function success(response) {
                console.log('fill drill data - ' + JSON.stringify(response));
                return response.data;
            }
        }

        function filterParse (filterArray) {
            var reqString = '';

            if (filterArray && filterArray.length > 0) {
                for (var i = 0; i < filterArray.length; i++) {
                    var keys = Object.keys(filterArray[i]);
                    var value = keys === 'playerNames' || 'playerName' ? filterArray[i][keys]: filterArray[i][keys].replace(' ', '');

                    if (value) {
                        reqString += '&' + keys + '=' + value;
                    }
                }
            }

            return reqString;
        }

        function getTransactionFilters (topologyNodeId, gamingDay, txnType) {
            if (gamingDay !== null) {
                var url = config.cage.route +
                    'filters?gamingDay=' + gamingDay +
                    '&txnType='+txnType+'&toplogyNodeId=' + topologyNodeId;

                return $http({
                    method: 'GET',
                    url: url,
                    headers: {'Content-Type': 'application/json'},
                    data: ''
                })
                    .then(success)
                    ['catch'](exception.catcherHttp());
            }

            function success(response) {
                var totalRecords = parseInt(response.headers()['totalrecords']);
                return response.data;
            }
        }

        function bulkEnrollProgress(){

            return $http({
                method: 'GET',
                url:config.cage.route+'isEnrollprocess',
                headers: {'Content-Type': 'application/json'}

            }).then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

    }
})();

