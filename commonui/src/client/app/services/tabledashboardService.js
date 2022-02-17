(function () {
    'use strict';

    angular
        .module('wdts.commonui.services')
        .factory('tableDashboardService', tableDashboardService);
    tableDashboardService.$inject = ['$http', '$q', 'logger', 'config','$rootScope','exception', '$stateParams'];

    function tableDashboardService($http, $q, logger, config,$rootScope,exception, $stateParams) {
        var service = {
            children: [],
            map: []
        };

        service.setData = function (arg) {
            service.children = arg;
            updateData();
        };

        service.getData = function () {
            return service.children;
        };

        service.setMap = function (arg) {
            service.map = arg;
            updateMap();
        };

        service.getMap = function () {
            return service.map;
        };

        function updateData() {
            $rootScope.$broadcast('tabledata');  // broadcasts the update to listeners
        }
        function updateMap(){
            $rootScope.$broadcast('setmapdata');
        }

        service.getShoeData = function(tableId,gamingDay){

            if(tableId != null && gamingDay != null) {

                return $http({
                    method: 'GET',
                    url: config.game.route + 'shoes?topologyId=' + tableId + '&gamingDay=' + gamingDay,
                    headers: {'Content-Type': 'application/json'},
                    data: ''
                })
                    .then(success)
                    ['catch'](exception.catcherHttp());
            }

            function success(response) {
                return response.data;
            }
        };

        service.getBetsForGame = function(gameUUId){

            if(gameUUId != null) {

                return $http({
                    method: 'GET',
                    url: config.tableUIProtocol + $stateParams.tableIp + ':' + config.singleTablePort + '/api/game/v1/bets?gameUuid=' + gameUUId,
                    headers: {'Content-Type': 'application/json'},
                    data: ''
                })
                    .then(success)
                    ['catch'](exception.catcherHttp());
            }

            function success(response) {
                return response.data;
            }
        };

        service.playerSessionBuyIn = function(playerId, gamingDay,topologyNode,fromDtm,endDtm){

            if(playerId != null && gamingDay != null && topologyNode != null) {
                var url = '';
                if(endDtm){
                    url = config.cage.route + 'transactionsaggregation?gamingDay=' + gamingDay + '&playerIds=' + playerId + '&txnTypes=BUYIN&topologyNodeIds=' + topologyNode
                        + '&fromDtm=' + fromDtm + '&toDtm=' + endDtm;
                }

                else{
                    url = config.cage.route + 'transactionsaggregation?gamingDay=' + gamingDay + '&playerIds=' + playerId + '&txnTypes=BUYIN&topologyNodeIds=' + topologyNode
                        + '&fromDtm=' + fromDtm;
                }
                return $http({
                    method: 'GET',
                    url: url
                })
                    .then(success)
                    ['catch'](exception.catcherHttp());
            }

            function success(response) {
                return response.data;
            }

        };


        service.getGameDataForShoe = function(tableId,gamingDay,shoeUId){
            if(tableId != null && gamingDay != null && shoeUId != null) {

                return $http({
                    method: 'GET',
                    url: config.game.route + 'games?&gamingDay=' + gamingDay + '&topologyId=' + tableId + '&shoeUuId=' + shoeUId,
                    headers: {'Content-Type': 'application/json'},
                    data: ''
                })
                    .then(success)
                    ['catch'](exception.catcherHttp());
            }

            function success(response) {
                return response.data;
            }
        };


        service.getFillTransaction = function (topologyNodeId, gamingDay, start, limit, filterArray) {
            if (gamingDay != null) {
                var url = config.cage.route +
                    'transactions?gamingDay=' + gamingDay +
                    '&txnTypes=FILL&topologyIds=' + topologyNodeId +
                    '&start=' + start +
                    '&limit=' + limit;

                url += filterParse(filterArray);

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
        };

        service.getCreditTransaction = function (topologyNodeId, gamingDay, start, limit, filterArray) {
            if (gamingDay != null) {
                var url = config.cage.route +
                    'transactions?gamingDay=' + gamingDay +
                    '&txnTypes=CREDIT&topologyIds=' + topologyNodeId +
                    '&start=' + start +
                    '&limit=' + limit;

                url += filterParse(filterArray);

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
        };

        service.getBuyinTransaction = function (topologyNodeId, gamingDay, start, limit, filterArray) {
            if (gamingDay != null) {
                var url = config.cage.route +
                    'transactions?gamingDay=' + gamingDay +
                    '&txnTypes=BUYIN&topologyIds=' + topologyNodeId +
                    '&start=' + start +
                    '&limit=' + limit;

                url += filterParse(filterArray);

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
        };

        service.getGameData = function(tableId,gamingDay){
            if(tableId != null && gamingDay != null) {

                return $http({
                    method: 'GET',
                    url: config.game.route + 'games?gamingDay=' + gamingDay + '&topologyId=' + tableId,
                    headers: {'Content-Type': 'application/json'},
                    data: ''
                })
                    .then(success)
                    ['catch'](exception.catcherHttp());
            }

            function success(response) {
                return response.data;
            }
        };

        service.getGameBetData = function(gameUUId, tableIp){

            if(gameUUId != null) {

                return $http({
                    method: 'GET',
                    url: config.tableUIProtocol + tableIp + ':' + config.singleTablePort + '/api/game/v1/bets?gameUuid=' + gameUUId,
                    headers: {'Content-Type': 'application/json'},
                    data: ''
                })
                    .then(success)
                    ['catch'](exception.catcherHttp());
            }

            function success(response) {
                return response.data;
            }
        };

        service.getChipTrayData = function(topologyId, gamingDay, start, limit, filterArray, sortObject){
            if (topologyId != null && gamingDay != null) {
                var url = config.cage.route + 'chipTrayScans/table/' + topologyId + '?reqFilter=1&gamingDay=' + gamingDay;

                if (start && limit) {
                    url += '&start=' + start + '&limit=' + limit;
                }

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
        };
        service.getShoeSessionData = function(tableIds,gamingDay,shoeUUId){

            if(tableIds != null && gamingDay != null && shoeUUId != null) {

                return $http({
                    method: 'POST',
                    url: config.game.route + 'sessions?shoeUuId=' + shoeUUId + '&gamingDay=' + gamingDay,
                    headers: {'Content-Type': 'application/json'},
                    data: tableIds
                })
                    .then(success)
                    ['catch'](exception.catcherHttp());
            }

            function success(response) {
                return response.data;
            }
        };

        service.getFillDrill = function(UUID) {

            if (UUID != null) {


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
        };

        service.getCreditDrill = function(UUID){

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
        };

        service.getBuyinDrill = function(UUID){

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
        };
        service.getKnownPlayer = function(id){

            if(id != null) {

                return $http({
                    method: 'GET',
                    url: config.player.route + id + '?fetch=true',
                    headers: {'Content-Type': 'application/json'},
                    data: ''
                })
                    .then(success,fail)
                    ['catch'](exception.catcherHttp());
            }

            function success(response) {
                return response.data;
            }

        };

        service.getManualRatings = function(gd,ids, filters){
            if(ids != null) {
                var tId = ids.toString();
                var uri = config.game.route + 'manualRatings?gamingDay=' + gd + '&tableIds=' + tId;
                if(filters){
                    uri += formatQueryParamsForFilterAndPagination(filters.start, filters.limit, filters.filterArray);
                }


                return $http({
                    method: 'GET',
                    url: uri,
                    headers: {'Content-Type': 'application/json'},
                    data: ''
                })
                    .then(success)
                    ['catch'](exception.catcherHttp());
            }

            function success(response) {
                return response.data;
            }
        };


        service.updateManualRating = function(id,data){
            if(id != null) {

                return $http({
                    method: 'POST',
                    url: config.game.route + 'manualRatings/' + id,
                    headers: {'Content-Type': 'application/json'},
                    data: data
                })
                    .then(success)
                    ['catch'](exception.catcherHttp());
            }

            function success(response) {
                return response.data;
            }
        };


        service.createManualRating = function(data){
            if(data != null) {

                return $http({
                    method: 'POST',
                    url: config.game.route + 'manualRatings',
                    headers: {'Content-Type': 'application/json'},
                    data: data
                })
                    .then(success)
                    ['catch'](exception.catcherHttp());
            }

            function success(response) {
                return response.data;
            }
        };

        service.createManualRatingNote = function(data){
            if(data != null) {

                return $http({
                    method: 'POST',
                    url: config.game.route + 'manualRatingNote',
                    headers: {'Content-Type': 'application/json'},
                    data: data
                })
                    .then(success)
                    ['catch'](exception.catcherHttp());
            }

            function success(response) {
                return response.data;
            }
        };

        service.getManualRatingById = function(id){
            if(id != null) {

                return $http({
                    method: 'GET',
                    url: config.game.route + 'manualRatings/' + id,
                    headers: {'Content-Type': 'application/json'},
                    data: ''
                })
                    .then(success)
                    ['catch'](exception.catcherHttp());
            }

            function success(response) {
                return response.data;
            }
        };

        service.getFilters = function (topologyNodeId, gamingDay, txnType) {
            if (gamingDay != null) {
                var url = config.cage.route + 'filters' +
                    '?gamingDay=' + gamingDay +
                    '&txnType=' + txnType +
                    '&toplogyNodeId=' + topologyNodeId;

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
                return response.data;
            }
        };

        function filterParse (filterArray) {
            var reqString = '';

            if (filterArray && filterArray.length > 0) {
                for (var i = 0; i < filterArray.length; i++) {
                    var keys = Object.keys(filterArray[i]);
                    var value = keys == 'playerNames' || 'playerName' ? filterArray[i][keys]: filterArray[i][keys].replace(' ', '');

                    if (value) {
                        reqString += '&' + keys + '=' + value;
                    }
                }
            }

            return reqString;
        }

        service.getPlayerByFirstLastName = function(firstName, gamingDay, topologyId) {
            console.log('in player function');
            if(gamingDay && topologyId){
                var uri = config.casino.route7 + 'playerSearch?' + 'firstName='+ firstName +'&fetch=true&viewId=17&gamingDay=' + gamingDay + '&topologyId=' + topologyId;
            }else{
                var uri = config.player.route + '/?' + 'firstName='+ firstName +'&fetch=true';
            }

            return $http({
                method: 'GET',
                url: uri

            })
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        };

        service.getPlayerByLastName = function(lastName, gamingDay, topologyId) {
            console.log('in player function');
            if(gamingDay && topologyId){
                var uri = config.casino.route7 + 'playerSearch?'+'lastName=' + lastName +'&fetch=true&viewId=17&gamingDay=' + gamingDay + '&topologyId=' + topologyId;
            }else{
                var uri = config.player.route + '/?'+'&lastName=' + lastName +'&fetch=true';
            }

            return $http({
                method: 'GET',
                url: uri

            })
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        };

        service.getPlayerByCasinoPlayerId = function (casinoPlayerId, gamingDay, topologyId) {
            console.log('in player function');

            if(gamingDay && topologyId){
                var uri = config.casino.route7 + 'playerSearch?' + 'casinoPlayerId='+ casinoPlayerId + '&fetch=true&viewId=17&gamingDay=' + gamingDay + '&topologyId=' + topologyId;
            }else{
                var uri = config.player.route + '/?' + 'casinoPlayerId=' + casinoPlayerId + '&fetch=true';
            }

            return $http({
                method: 'GET',
                url: uri

            }).then(success)['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        };

        service.getSwipedPlayer =  function(cardData, gamingDay, topologyId) {
            var uri = config.casino.route7 + 'playerSearch?' + 'casinoCardData='+ cardData + '&fetch=true&viewId=17&gamingDay=' + gamingDay + '&topologyId=' + topologyId;

            return $http({
                method: 'GET',
                url:uri
                //config.routes.playerServiceTotalChipsGetUrl
            })
            // This is currently breaking unit tests.  If I need it,
            // I will need to create some sort of override where I can
            // pass in the datetime for unit testing.  I don't think it
            // is needed for IE8 since I am turning cache off at the server.
            //params: {nocache: new Date().getTime()}})
                .then(success)['catch']();

            function success(response) {
                return response.data;
            }
        }

        function formatQueryParamsForFilterAndPagination(start, limit, filterArray){
            var queryParams = '';
            if(start && limit){
                queryParams += '&start='+start+'&limit='+limit;
            }
            if(filterArray && filterArray.length > 0){
                for(var i=0; i<filterArray.length; i++){
                    var keys = Object.keys(filterArray[i]);
                    queryParams += '&' + keys + '=' + filterArray[i][keys];
                }
            }
            return queryParams;
        }


        return service;

    }
})();
