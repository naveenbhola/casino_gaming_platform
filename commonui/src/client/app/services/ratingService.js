(function () {
    'use strict';

    angular
        .module('wdts.commonui.services')
        .factory('ratingService', ratingService);

    ratingService.$inject = ['$http', '$q', 'config', 'exception'];

    function ratingService($http, $q, config, exception) {
        var service = {};

        /**
         * @deprecated
         */
        service.getManualRatings = function (gd, ids) {
            if (ids != null) {

                var tId = ids.toString();
                var url = config.game.route + 'manualRatings?gamingDay=' + gd + '&tableIds=' + tId;

                return $http({
                    method: 'GET',
                    url: url,
                    headers: {'Content-Type': 'application/json'},
                    data: ''
                })
                // This is currently breaking unit tests.  If I need it,
                // I will need to create some sort of override where I can
                // pass in the datetime for unit testing.  I don't think it
                // is needed for IE8 since I am turning cache off at the server.
                //params: {nocache: new Date().getTime()}})
                    .then(success)
                    ['catch'](exception.catcherHttp());
            }

            function success(response) {
                console.log('manual rating data - ' + JSON.stringify(response));
                return response.data;
            }
        };

        service.searchManualRatings = function (gd, ids, filtersData, sortObj) {
            var tId, uri = config.game.route + 'searchManualRatings?gamingDay=' + gd;

            if (ids) {
                tId = ids.toString();
                uri += '&tableIds=' + tId;
            }

            if(sortObj && sortObj.sortField && sortObj.sortOrder){
                uri += '&sortField=' + sortObj.sortField + '&sortOrder=' + sortObj.sortOrder;
            }

            return $http({
                method: 'POST',
                url: uri,
                headers: {'Content-Type': 'application/json'},
                data: formatDataForFilterAndPagination(filtersData || {})
            })
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                console.log('manual rating data - ' + JSON.stringify(response));
                return response.data;
            }
        };

        service.paginatedSearchManualRatings = function (gd, ids, filtersData, sortObj, start, limit, playerid) {
            var tId, uri = config.game.route + 'paginatedSearchManualRatings?gamingDay=' + gd;

            if (ids && ids != 0) {
                tId = ids.toString();
                uri += '&tableIds=' + tId;
            }
            if(playerid){
                uri += '&playerId='+playerid;
            }


            if(start && limit){
                uri += '&start=' + start + '&limit=' + limit;
            }

            if(sortObj && sortObj.sortField && sortObj.sortOrder){
                uri += '&sortField=' + sortObj.sortField + '&sortOrder=' + sortObj.sortOrder;
            }

            return $http({
                method: 'POST',
                url: uri,
                headers: {'Content-Type': 'application/json'},
                data: formatDataForFilterAndPagination(filtersData || {})
            })
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                console.log('manual rating data - ' + JSON.stringify(response));
                return response;
            }
        };

        //http://172.31.3.106:8140/api/player/v1/players/120?fetch=true
        service.getKnownPlayer = function (id) {

            if (id != null) {

                return $http({
                    method: 'GET',
                    url: config.player.route + id + '?fetch=true',
                    headers: {'Content-Type': 'application/json'},
                    data: ''
                })
                // This is currently breaking unit tests.  If I need it,
                // I will need to create some sort of override where I can
                // pass in the datetime for unit testing.  I don't think it
                // is needed for IE8 since I am turning cache off at the server.
                //params: {nocache: new Date().getTime()}})
                    .then(success)
                    ['catch'](exception.catcherHttp());
            }

            function success(response) {
                console.log('known player data - ' + JSON.stringify(response));
                return response.data;
            }

        };

        service.updateManualRating = function (id, data) {
            if (id != null) {

                return $http({
                    method: 'POST',
                    url: config.game.route + 'manualRatings/' + id,
                    headers: {'Content-Type': 'application/json'},
                    data: data
                })
                // This is currently breaking unit tests.  If I need it,
                // I will need to create some sort of override where I can
                // pass in the datetime for unit testing.  I don't think it
                // is needed for IE8 since I am turning cache off at the server.
                //params: {nocache: new Date().getTime()}})
                    .then(success)
                    ['catch'](exception.catcherHttp());
            }

            function success(response) {
                console.log('manual rating data updated - ' + JSON.stringify(response));
                return response.data;
            }
        };

        service.createManualRatingNote = function (data) {
            if (data != null) {

                return $http({
                    method: 'POST',
                    url: config.game.route + 'manualRatingNote',
                    headers: {'Content-Type': 'application/json'},
                    data: data
                })
                // This is currently breaking unit tests.  If I need it,
                // I will need to create some sort of override where I can
                // pass in the datetime for unit testing.  I don't think it
                // is needed for IE8 since I am turning cache off at the server.
                //params: {nocache: new Date().getTime()}})
                    .then(success)
                    ['catch'](exception.catcherHttp());
            }

            function success(response) {
                console.log('manual rating note created - ' + JSON.stringify(response));
                return response.data;
            }
        };

        service.getManualRatingById = function (id) {
            if (id != null) {

                return $http({
                    method: 'GET',
                    url: config.game.route + 'manualRatings/' + id,
                    headers: {'Content-Type': 'application/json'},
                    data: ''
                })
                // This is currently breaking unit tests.  If I need it,
                // I will need to create some sort of override where I can
                // pass in the datetime for unit testing.  I don't think it
                // is needed for IE8 since I am turning cache off at the server.
                //params: {nocache: new Date().getTime()}})
                    .then(success)
                    ['catch'](exception.catcherHttp());
            }

            function success(response) {
                console.log('manual rating data by id - ' + JSON.stringify(response));
                return response.data;
            }
        };

        service.getManualRatingByPlayerId = function(gamingDayFromURL, topologyIdList ,pId, filters, sortObj){
            var uri = "";
            if (pId != null) {
                if (topologyIdList) {
                    var tId = topologyIdList.toString();
                    uri = config.game.route + 'searchManualRatings?gamingDay=' + gamingDayFromURL + '&tableIds=' + tId + '&playerId=' + pId;
                }else{
                    uri = config.game.route + 'searchManualRatings?gamingDay=' + gamingDayFromURL + '&playerId=' + pId;
                }

                if(sortObj && sortObj.sortField && sortObj.sortOrder){
                    uri += '&sortField=' + sortObj.sortField + '&sortOrder=' + sortObj.sortOrder;
                }

                return $http({
                    method: 'POST',
                    url: uri,
                    headers: {'Content-Type': 'application/json'},
                    data: formatDataForFilterAndPagination(filters || {})
                })
                // This is currently breaking unit tests.  If I need it,
                // I will need to create some sort of override where I can
                // pass in the datetime for unit testing.  I don't think it
                // is needed for IE8 since I am turning cache off at the server.
                //params: {nocache: new Date().getTime()}})
                    .then(success)
                    ['catch'](exception.catcherHttp());
            }

            function success(response) {
                console.log('manual rating data by player Id - ' + JSON.stringify(response));
                return response.data;
            }
        };

        /**
         * @deprecated
         */
        service.getPlrSessionsData = function (gamingDay, plrId, tIds, start, limit, filterArray) {
            var uri = config.game.route + 'paginatedSessions?includeBuyIns=true&gamingDay=' + gamingDay + '&playerId=' + plrId + '&start=' + start + '&limit=' + limit;
            if (filterArray.length > 0) {
                for (var i = 0; i < filterArray.length; i++) {
                    var keys = Object.keys(filterArray[i]);
                    uri += '&' + keys + '=' + filterArray[i][keys];
                }
            }
            return $http({
                method: 'POST',
                url: uri,
                headers: {'Content-Type': 'application/json'},
                data: tIds
            })
            // This is currently breaking unit tests.  If I need it,
            // I will need to create some sort of override where I can
            // pass in the datetime for unit testing.  I don't think it
            // is needed for IE8 since I am turning cache off at the server.
            //params: {nocache: new Date().getTime()}})
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                console.log('session data - ' + JSON.stringify(response));
                return response.data;
            }
        };

        service.getPlayerSessionsData = function (gamingDay, plrId, tIds, start, limit, filterArray, sortObj) {
            var uri = config.game.route + 'paginatedSessions?includeBuyIns=true&gamingDay=' + gamingDay + '&playerId=' + plrId + '&start=' + start + '&limit=' + limit;
            if (filterArray.length > 0) {
                for (var i = 0; i < filterArray.length; i++) {
                    var keys = Object.keys(filterArray[i]);
                    uri += '&' + keys + '=' + filterArray[i][keys];
                }
            }

            if(sortObj && sortObj.sortField && sortObj.sortOrder){
                uri += '&sortField=' + sortObj.sortField + '&sortOrder=' + sortObj.sortOrder;
            }

            return $http({
                method: 'POST',
                url: uri,
                headers: {'Content-Type': 'application/json'},
                data: tIds
            })
            // This is currently breaking unit tests.  If I need it,
            // I will need to create some sort of override where I can
            // pass in the datetime for unit testing.  I don't think it
            // is needed for IE8 since I am turning cache off at the server.
            //params: {nocache: new Date().getTime()}})
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response;
            }
        };

        function formatDataForFilterAndPagination(filters){
            var data = {};
            if(filters.start && filters.limit){
                data.start = filters.start;
                data.limit = filters.limit;
            }
            if(filters.filterArray && filters.filterArray.length){
                for(var i=0; i<filters.filterArray.length; i++){
                    var key = Object.keys(filters.filterArray[i])[0];
                    var list = filters.filterArray[i][key].split(',');
                    if(['playerId', 'createdByUser', 'approvedByUser'].indexOf(key) >= 0){
                        data[key] = [];
                        for(var j=0; j < list.length; j++){
                            if(list[j]){
                                var obj = {};
                                obj[key === 'playerId' ? 'playerId' : 'userId'] = list[j];
                                data[key].push(obj);
                            }
                        }
                    }else if(list[0] && list[0]!== ""){
                        data[key] = list;
                    }else{
                        data[key] = [];
                    }
                }
            }
            return data;
        }

        return service;

    }
})();
