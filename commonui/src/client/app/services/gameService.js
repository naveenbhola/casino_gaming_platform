(function () {
    'use strict';

    angular
    .module('wdts.commonui.services')
    .factory('gameService', gameService);
    gameService.$inject = ['$http', '$q', 'logger', 'config', '$rootScope', 'exception', '$stateParams'];

    function gameService($http, $q, logger, config, $rootScope, exception, $stateParams) {
        var service = {
            children: [],
            map: []
        };

        service.getAllSwipedPositions = function(tableIp){
            return $http({
                method: 'GET',
                url: config.tableUIProtocol + tableIp + ':' + config.singleTablePort + '/api/game/v1/swipedPositions',
                headers: {'Content-Type': 'application/json'}
            })
                .then(success)
                ['catch'](exception.catcherHttp());
            function success(response) {
                return response;
            }
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

        function updateMap() {
            $rootScope.$broadcast('setmapdata');
        }

        service.getGameData = function (tableId, gamingDay, start, limit, filterArray, sortObj) {
            if (tableId != null && gamingDay != null) {
                var uri = config.game.route + 'paginatedGames?includeVoidGames=true&gamingDay=' + gamingDay + '&topologyId=' + tableId;
                if (start && limit) {
                    uri += '&start=' + start + '&limit=' + limit;
                }
                if (filterArray) {
                    if (filterArray.length > 0) {
                        for (var i = 0; i < filterArray.length; i++) {

                            var keys = Object.keys(filterArray[i]);

                            uri += '&' + keys + '=' + filterArray[i][keys];
                        }
                    }
                }

                if(sortObj && sortObj.sortField && sortObj.sortOrder){
                    uri += '&sortField=' + sortObj.sortField + '&sortOrder=' + sortObj.sortOrder;
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
                return response;
            }
        };

        service.getLastGameData = function (tableId, gamingDay) {

            if (tableId != null && gamingDay != null) {

                return $http({
                    method: 'GET',
                    url: config.game.route + 'lastPlayedGame?gamingDay=' + gamingDay + '&topologyId=' + tableId,
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

        service.getSessionData = function (tableIds, gamingDay, start, limit, filterArray, sortObj) {

            if (tableIds != null && gamingDay != null) {
                var uri = config.game.route + 'paginatedSessions?includeBuyIns=true&gamingDay=' + gamingDay;
                if (start && limit) {
                    uri += '&start=' + start + '&limit=' + limit;
                }

                if (filterArray) {
                    if (filterArray.length > 0) {
                        for (var i = 0; i < filterArray.length; i++) {

                            var keys = Object.keys(filterArray[i]);

                            uri += '&' + keys + '=' + filterArray[i][keys];
                        }
                    }
                }

                if(sortObj && sortObj.sortField && sortObj.sortOrder){
                    uri += '&sortField=' + sortObj.sortField + '&sortOrder=' + sortObj.sortOrder;
                }

                return $http({
                    method: 'POST',
                    url: uri,
                    headers: {'Content-Type': 'application/json'},
                    data: tableIds
                })
                .then(success)
                    ['catch'](exception.catcherHttp());
            }

            function success(response) {
                return decorateFilters(response);

            }
        };

        service.getGameDataForSession = function (tableId, gamingDay, sessionId, start, limit) {
            if (tableId != null && gamingDay != null && sessionId != null) {
                var uri = config.game.route + 'games?' + 'sessionId=' + sessionId;
                if (start && limit) {
                    uri += '&start=' + start + '&limit=' + limit;
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
                console.log('session game data - ' + JSON.stringify(response));
                return response;
            }
        };

        service.getPaginatedGameDataForSession = function (tableId, gamingDay, sessionId, start, limit, filterArray, sortObj, tableIp) {
            if (tableId != null && gamingDay != null && sessionId != null) {
                var uri = config.tableUIProtocol + tableIp + ':' + config.singleTablePort + '/api/game/v1/paginatedGames?&includeVoidGames=true&shoeIds=ALL&sessionId=' + sessionId + '&start=' + start + '&limit=' + limit;
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
                    method: 'GET',
                    url: uri,
                    headers: {'Content-Type': 'application/json'},
                    data: ''
                })
                .then(success)
                    ['catch'](exception.catcherHttp());
            }

            function success(response) {
                console.log('session game data - ' + JSON.stringify(response));
                return response;
            }
        };

        service.getShoeDetails = function (tableId, shoeUuid) {

            if (tableId != null && shoeUuid != null) {
                var url = config.game.route + 'shoeDetail?topologyId=' + tableId + '&shoeUuid=' + shoeUuid;

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

        service.getGameDataForShoe = function (tableId, shoeUId, start, limit, filterArray, sortObj) {

            if (tableId != null && shoeUId != null) {
                var uri = config.game.route + 'paginatedGames?includeVoidGames=true&topologyId=' + tableId + '&shoeUuId=' + shoeUId;
                if (start && limit) {
                    uri += '&start=' + start + '&limit=' + limit;
                }
                if (filterArray) {
                    if (filterArray.length > 0) {
                        for (var i = 0; i < filterArray.length; i++) {

                            var keys = Object.keys(filterArray[i]);

                            uri += '&' + keys + '=' + filterArray[i][keys];
                        }
                    }
                }

                if(sortObj && sortObj.sortField && sortObj.sortOrder){
                    uri += '&sortField=' + sortObj.sortField + '&sortOrder=' + sortObj.sortOrder;
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
                console.log('session game data - ' + JSON.stringify(response));
                return response;
            }
        };

        service.getShoeData = function (tableId, gamingDay, sortObject, start, limit) {

            if (tableId != null && gamingDay != null) {
                var url = config.game.route + 'shoes?topologyId=' + tableId + '&gamingDay=' + gamingDay;
                if (start && limit) {
                    url += '&start=' + start + '&limit=' + limit;
                }
                if(sortObject && sortObject.sortField && sortObject.sortOrder) {
                    url += '&' + "sortField" + '=' + sortObject.sortField;
                    url += '&' + "sortOrder" + '=' + sortObject.sortOrder;
                }
                return $http({
                    method: 'GET',
                    url:url,
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

        service.getShoeSessionData = function (tableIds, shoeUUId, start, limit, filterArray, sortObj) {

            if (tableIds != null && shoeUUId != null) {
                var url = config.game.route +
                    'paginatedShoeSessions?includeBuyIns=true&shoeUuId=' + shoeUUId +
                    '&start=' + start +
                    '&limit=' + limit +
                    '&reqFilter=1';

                url += filterParse(filterArray);

                if(sortObj && sortObj.sortField && sortObj.sortOrder){
                    url += '&sortField=' + sortObj.sortField + '&sortOrder=' + sortObj.sortOrder;
                }

                return $http({
                    method: 'POST',
                    url: url,
                    headers: {'Content-Type': 'application/json'},
                    data: tableIds
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
                return response;
            }
        };

        service.createSessionNote = function (data) {
            if (data != null) {

                return $http({
                    method: 'POST',
                    url: config.game.route + 'sessionNote',
                    headers: {'Content-Type': 'application/json'},
                    data: data
                })
                .then(success)
                    ['catch'](fail);
            }

            function success(response) {
                console.log('manual session note created - ' + JSON.stringify(response));
                return response.data;
            }

            function fail(e) {
                logger.fatal($translate.instant('application.app.TABLE_DASH_LABELS.MESSAGE.CANNOT_CREATE_RATING'));
                return $q.reject(e);
            }
        };

        service.getSessionById = function (sessionId) {

            if (sessionId != null) {

                return $http({
                    method: 'GET',
                    url: config.tableUIProtocol + $stateParams.tableIp + ':' + config.singleTablePort + '/api/game/v1/sessionsByIds?sessionIds=' + sessionId + '&identifier=0',
                    headers: {'Content-Type': 'application/json'},
                    data: ''
                })
                .then(success)
                    ['catch'](exception.catcherHttp());
            }

            function success(response) {
                console.log('session data by id - ' + JSON.stringify(response));
                return response.data;
            }
        };

        service.getOpenerCloser = function (topologyId, date) {
            return $http({
                method: 'GET',
                url: config.cage.route + 'chipTrayOpenerCloser?topologyId=' + topologyId + '&gamingDay=' + date,
                headers: {'Content-Type': 'application/json'}
            })
            .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        };
        //MNF -32 start
        service.updateIrcNumber = function (ircReqData) {
            return $http({
                method: 'POST',
                url: config.tableUIProtocol + ircReqData.tableIp + ':' + config.singleTablePort +'/api/game/v1/updateIrcNumber',
                headers: { 'Content-Type': 'application/json' },
                data: ircReqData
            }).then(success)['catch'](fail);

            function fail(e) {
                logger.warn($translate.instant('application.app.TABLE_DASH_LABELS.SESSIONS.MESSAGE.IRC_MESSAGE_UPDATE_FAILED'));
                return $q.reject(e);;
            }
            function success(response) {
                return response;
            }
        };
        //MNF -32 end

        function decorateFilters(response) {
            var filters = response.data.successObj.filters;
            if (filters != null) {
                if (filters.ratingFlag && filters.ratingFlag.length) {
                    filters.ratingFlag.reverse();
                }
            }
            return response;
        }

        return service;

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


    }
})();
