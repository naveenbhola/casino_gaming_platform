(function () {
    'use strict';

    angular
        .module('wdts.commonui.services')
        .factory('casinoManagerService', casinoManagerService);

    casinoManagerService.$inject = ['$http', '$q', 'logger', 'config','exception','$translate','jwtTokenKey','store'];

    function casinoManagerService($http, $q, logger, config,exception,$translate, jwtTokenKey, store) {
        var service = {
            getCasinoOverview: getCasinoOverview,
            getCasinoOverviewHead: getCasinoOverviewHead,
            getWinningPlayers: getWinningPlayers,
            getLosingPlayers: getLosingPlayers,
            getVirtualGroupWinningPlayers:getVirtualGroupWinningPlayers,
            getVirtualGroupLosingPlayers:getVirtualGroupLosingPlayers,
            getCurrentGamingDay: getCurrentGamingDay,
            getCurrentLocalGamingDay: getCurrentLocalGamingDay,
            getMapping: getMapping,
            getTableStats: getTableStats,
            getTableGridStats:getTableGridStats,
            getSearchedPlayerById: getSearchedPlayerById,
            getSearchedPlayerByName: getSearchedPlayerByName,
            topologyStatsByTableType: topologyStatsByTableType,
            getPlrProfileData:getPlrProfileData,
            updatePlayer:updatePlayer,
            cancelUpdateSession:cancelUpdateSession,
            getPlrData: getPlrData,
            getPlrDataDynamic: getPlrDataDynamic,
            getPlrFilterData: getPlrFilterData,
            getTableStatsFilters: getTableStatsFilters,
            getFCData: getFCData
        };

        service.node = null;
        service.backName = null;
        service.loadTree = true;

        return service;

        function getCasinoOverviewHead(gd, parentId) {

            if (gd != null && parentId != null) {

                console.log(parentId);
                var id = parentId.toString();
                return $http({

                    method: 'GET',
                    url: config.casino.route + '?gamingDay=' + gd + '&topologyIds=' + id,
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
                //console.log("overview head--"+JSON.stringify(response));
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
                // This is currently breaking unit tests.  If I need it,
                // I will need to create some sort of override where I can
                // pass in the datetime for unit testing.  I don't think it
                // is needed for IE8 since I am turning cache off at the server.
                //params: {nocache: new Date().getTime()}})

                    .then(success)
                    ['catch'](exception.catcherHttp());
            }

            function success(response) {
                //console.log("overview head--"+JSON.stringify(response));
                return response.data.successObj.currentGamingDayInLocalTimeZone;
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
                // This is currently breaking unit tests.  If I need it,
                // I will need to create some sort of override where I can
                // pass in the datetime for unit testing.  I don't think it
                // is needed for IE8 since I am turning cache off at the server.
                //params: {nocache: new Date().getTime()}})

                    .then(success)
                    ['catch'](exception.catcherHttp());
            }

            function success(response) {
                //console.log("overview head--"+JSON.stringify(response));
                return response.data;
            }

        }

        function getCasinoOverview(gd, nodesId, viewId) {

            if (gd != null && nodesId != null) {


                var nodeIds = nodesId.toString();
                if (!viewId) {
                    service.url = config.casino.route + '?gamingDay=' + gd + '&topologyIds=' + nodesId;
                }
                else {
                    service.url = config.casino.route6 + '?gamingDay=' + gd + '&topologyIds=' + nodesId + '&viewId=' + viewId
                }
                return $http({

                    method: 'GET',
                    //url: config.casino.route + '?gamingDay='+ gd + '&topologyIds=' + nodesId,
                    url: service.url,
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
                // console.log("overview"+JSON.stringify(response));
                return response.data;
            }

        }

        function getWinningPlayers(gd, topologyId) {
            var id = topologyId.toString();
            if (gd != null) {

                return $http({
                    method: 'GET',
                    url: config.casino.route1 + '?gamingDay=' + gd + '&topologyId=' + id,
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
                console.log("Top winning = " + JSON.stringify(response));
                return response.data;
            }
        }

        function getLosingPlayers(gd, topologyId) {
            var id = topologyId.toString();
            if (gd != null) {

                return $http({
                    method: 'GET',
                    url: config.casino.route2 + '?gamingDay=' + gd + '&topologyId=' + id,
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
                // console.log(JSON.stringify(response));
                return response.data;
            }
        }

        function getVirtualGroupLosingPlayers(gd, virtualGroupId){

            if (gd != null) {

                return $http({
                    method: 'GET',
                    url: config.casino.route7 + 'playerStats/topLosingPlayersVirtualGroup?gamingDay=' + gd + '&limit=10&topologyGroupId=' + virtualGroupId,
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
                // console.log(JSON.stringify(response));
                return response.data;
            }

        }

        function getVirtualGroupWinningPlayers(gd, virtualGroupId){

            if (gd != null) {

                //http://localhost:8100/api/casinomanager/v1/playerStats/topWinningPlayersVirtualGroup?gamingDay=2016-05-11&limit=10&topologyGroupId=1

                return $http({
                    method: 'GET',
                    url: config.casino.route7 + 'playerStats/topWinningPlayersVirtualGroup?gamingDay=' + gd + '&limit=10&topologyGroupId=' + virtualGroupId,
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
                // console.log(JSON.stringify(response));
                return response.data;
            }
        }

        function getMapping() {
            return $http({
                method: 'GET',
                url: 'app/core/mapping.json',
                data: ''

            })
            // This is currently breaking unit tests.  If I need it,
            // I will need to create some sort of override where I can
            // pass in the datetime for unit testing.  I don't think it
            // is needed for IE8 since I am turning cache off at the server.
            //params: {nocache: new Date().getTime()}})
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                // console.log(JSON.stringify(response));
                return response.data;
            }
        }

        // function getTableStats(gd, nodesId, viewId) {
        //
        //     if (gd != null) {
        //
        //         //var nodeIds = nodesId.toString();
        //         if (!viewId) {
        //             service.url = config.casino.route + '?gamingDay=' + gd + '&topologyIds=' + nodesId;
        //         }
        //         else {
        //             service.url = config.casino.route8 + '?gamingDay=' + gd + '&topologyIds=' + nodesId + '&viewId=' + viewId
        //         }
        //         return $http({
        //
        //             method: 'GET',
        //             //url: config.casino.route + '?gamingDay='+ gd + '&topologyIds=' + nodesId,
        //             url: service.url,
        //             data: ''
        //
        //         })
        //         // This is currently breaking unit tests.  If I need it,
        //         // I will need to create some sort of override where I can
        //         // pass in the datetime for unit testing.  I don't think it
        //         // is needed for IE8 since I am turning cache off at the server.
        //         //params: {nocache: new Date().getTime()}})
        //
        //             .then(success)
        //             ['catch'](exception.catcherHttp());
        //     }
        //
        //     function success(response) {
        //         // console.log("Table stats"+JSON.stringify(response));
        //         return response.data;
        //     }
        // }

        function getTableGridStats(gd, nodesId, viewId, paginationObj) {

            if (gd != null && nodesId) {

                service.url = config.casino.tableGridStatsRoute + gd + '&topologyIds=' + nodesId + '&viewId=' + viewId+ '&start=' + paginationObj.start + '&limit=' + paginationObj.limit;

                return $http({

                    method: 'GET',
                    url: service.url,
                    data: ''

                })

                    .then(success)
                    ['catch'](exception.catcherHttp());
            }

            function success(response) {
                return response;
            }
        }

        function getSwipedPlayer(cardData) {
            return $http({
                method: 'GET',
                url: config.playerPath + '/api/player/v1/players/?casinoCardData='+cardData+'&fetch=true'
                //config.routes.playerServiceTotalChipsGetUrl
            })
            // This is currently breaking unit tests.  If I need it,
            // I will need to create some sort of override where I can
            // pass in the datetime for unit testing.  I don't think it
            // is needed for IE8 since I am turning cache off at the server.
            //params: {nocache: new Date().getTime()}})
                .then(success)
                ['catch']();

            function success(response) {
                return response.data;
            }
        }

        function getSearchedPlayerById(plrid, gd) {

            if (gd != null) {

                //var nodeIds = nodesId.toString();

                service.url = config.casino.route9 + '?casinoPlayerId=' + plrid + '&gamingDay=' + gd;
                return $http({

                    method: 'GET',
                    //url: config.casino.route + '?gamingDay='+ gd + '&topologyIds=' + nodesId,
                    url: service.url,
                    data: ''

                })
                // This is currently breaking unit tests.  If I need it,
                // I will need to create some sort of override where I can
                // pass in the datetime for unit testing.  I don't think it
                // is needed for IE8 since I am turning cache off at the server.
                //params: {nocache: new Date().getTime()}})

                    .then(success)
                    ['catch'](fail);
            }

            function success(response) {
                if (!response.data.length) {
                    logger.info($translate.instant('application.app.common.labels.TOPNAV.PLAYER_NOT_FOUND'));
                }

                return response.data;
            }

            function fail(e) {
                if (e.status == 404){
                    logger.info($translate.instant('application.app.common.labels.TOPNAV.PLAYER_NOT_FOUND'));
                }

                return $q.reject(e);
            }


        }

        function getSearchedPlayerByName(plrFname, plrLname, gd) {

            if (gd != null) {

                //var nodeIds = nodesId.toString();

                service.url = config.casino.route9 + '?playerFirstName=' + plrFname + '&playerLastName=' + plrLname + '&gamingDay=' + gd;
                //alert(service.url)
                return $http({

                    method: 'GET',
                    //url: config.casino.route + '?gamingDay='+ gd + '&topologyIds=' + nodesId,
                    url: service.url,
                    data: ''

                })
                // This is currently breaking unit tests.  If I need it,
                // I will need to create some sort of override where I can
                // pass in the datetime for unit testing.  I don't think it
                // is needed for IE8 since I am turning cache off at the server.
                //params: {nocache: new Date().getTime()}})

                    .then(success)
                    ['catch'](fail);
            }

            function success(response) {
                if (!response.data.length) {
                    logger.info($translate.instant('application.app.common.labels.TOPNAV.PLAYER_NOT_FOUND'));
                }

                return response.data;
            }

            function fail(e) {
                if (e.status == 404){
                    logger.info($translate.instant('application.app.common.labels.TOPNAV.PLAYER_NOT_FOUND'));
                }

                return $q.reject(e);
            }


        }

        function topologyStatsByTableType(gamingDay, topologyId){

            return $http({
                method: 'get',
                url: config.casino.route7 + 'topologyStatsByTableType?gamingDay=' + gamingDay +
                '&topologyId=' + topologyId +'&viewId=11',
                data: ''
            })
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }
        function getPlrProfileData(gamingDay,tid,plrId) {
            return $http({
                method: 'get',
                //url: config.casino.route7+ 'playerProfile?gamingDay=' + gamingDay + '&playerId=' +plrId + '&viewId=4',
                url: config.casino.route7+ 'playerProfile?gamingDay=' + gamingDay + '&topologyId=' + tid + '&playerId=' +plrId + '&viewId=4',
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

            function success(response) {
                console.log('profile data - ' + JSON.stringify(response));
                return response.data;
            }
        }
        function updatePlayer(UpdatedPlayerId, gamingDay, topologyId, positionId, positionLabel, userId, updateTime, sessionIds, identifier, ircNumbers, includeBackBets, ip){ 
            var url = ""; 
            if(identifier ===1){ 
                url = config.tableUIProtocol + ip + ':' + config.singleTablePort +'/api/game/v1/updatePlayer';
            }else { 
                url = config.tableUIProtocol + ip + ':' + config.singleTablePort +'/api/game/v1/updatePlayer';
            }
            var payLoad = {
                updatedPlayerId: UpdatedPlayerId,
                gamingDay: gamingDay,
                topologyId: topologyId,
                positionId: positionId,
                positionLabel: positionLabel,
                userId: userId,
                updateTime: updateTime,
                sessionIds: sessionIds,
                identifier: identifier,
                ircNumbers: ircNumbers,
                isCMSUp:true,
                updatedCardId:''
            };
            if(includeBackBets === 'true'){
                url += '&mergeBackBets=1';
            }
            return $http({ 
                method: 'POST', 
                url: url, 
                headers: { 
                    'Content-Type': 'application/json','Authorization': "Bearer " + store.get(jwtTokenKey) 
                }, 
                data: payLoad 
            }) 
                .then(success) 
                ['catch'](exception.catcherHttp());  
            function success(response) { 
                console.log('profile data - ' + JSON.stringify(response)); 
                return response.data;     } 
        }
        function cancelUpdateSession(sessionIds, topologyId, gamingDay, identifier){ 
            return $http({ 
                method: 'POST', 
                url: config.casino.cancelUpdateSession+ '?'+'sessionIds=' + sessionIds +'&topologyId='+topologyId+'&gamingDay='+gamingDay+'&identifier='+identifier, 
                headers: { 
                    'Content-Type': 'application/json','Authorization': "Bearer " + store.get(jwtTokenKey) 
                }, 
                data: '' 
            }) 
                .then(success) 
                ['catch'](exception.catcherHttp());  
            function success(response) { 
                console.log('profile data - ' + JSON.stringify(response)); 
                return response.data;     } 
        }


        function getPlrData(gd, tIds) {
            return $http({

                method: 'GET',
                url: config.casino.route5 + 'playerStats?gamingDay=' + gd + '&&topologyIds=' + tIds,
                data: ''
            }).then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        function getPlrDataDynamic(gd, tIds, start, limit, filterArray, sortObj) {
            if(tIds != 'undefined') {
                var uri = config.casino.route5 + 'playerStatistics?gamingDay=' + gd + '&topologyId=' + tIds + '&viewId=10' + '&start=' + start + '&limit=' + limit;
                if (filterArray.length > 0) {
                    uri = config.casino.route5 + 'playerStatistics?gamingDay=' + gd + '&topologyId=' + tIds + '&viewId=10' + '&filter=true' + '&start=' + start + '&limit=' + limit
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
                console.log("overview" + JSON.stringify(response));
                return response;
            }
        }

        function getPlrFilterData(gd, tIds) {
            var uri = config.casino.route5 + 'playerFilter?gamingDay=' + gd + '&topologyId=' + tIds + '&viewId=10';

            return $http({
                method: 'GET',
                url: uri,
                data: ''
            }).then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        function getTableStatsFilters(gd, nodesId, viewId) {
            if (gd !== null) {
                var url = config.casino.pitViewFilters,
                    params = {
                        gamingDay: gd,
                        viewId: viewId,
                        topologyIdList: nodesId
                    };
                return $http({
                    method: 'GET',
                    url: url,
                    params: params
                }).then(success)['catch'](exception.catcherHttp());
            }

            function success(response) {
                return response.data;
            }
        }

        function getTableStats(gd, nodesId, viewId, data,sortObj) {
            if (gd !== null) {
                if (!viewId) {
                    service.url = config.casino.route + '?gamingDay=' + gd + '&topologyIds=' + nodesId;
                }
                else {
                    service.url = config.casino.route8 + '?gamingDay=' + gd + '&topologyIds=' + nodesId + '&viewId=' + viewId
                }

                if (data) {
                    service.url += "&reqFilter=1";
                    service.url += formatQueryParamsForFilterAndPagination(data.start, data.limit, data.filterArray);
                }

                if(sortObj && sortObj.sortField && sortObj.sortOrder){
                    service.url += '&sortField=' + sortObj.sortField + '&sortOrder=' + sortObj.sortOrder;
                }

                return $http({
                    method: 'GET',
                    url: service.url,
                    data: ''
                }).then(success)
                    ['catch'](exception.catcherHttp());
            }

            function success(response) {
                return response;
            }
        }

        function formatQueryParamsForFilterAndPagination(start, limit, filterArray) {
            var queryParams = '';
            if (start && limit) {
                queryParams += '&start=' + start + '&limit=' + limit;
            }
            if (filterArray && filterArray.length > 0) {
                for (var i = 0; i < filterArray.length; i++) {
                    var keys = Object.keys(filterArray[i]);
                    queryParams += '&' + keys + '=' + filterArray[i][keys];
                }
            }
            return queryParams;
        }

        function getFCData(gd, tIds, filterArray, sortObj, start, limit) {
            if (tIds != 'undefined') {
                var uri = config.casino.route10 + '?gamingDay=' + gd + '&topologyId=' + tIds;
                if (filterArray.length > 0) {
                    uri = config.casino.route10 + '?gamingDay=' + gd + '&topologyId=' + tIds;
                    for (var i = 0; i < filterArray.length; i++) {

                        var keys = Object.keys(filterArray[i]);

                        uri += '&' + keys + '=' + filterArray[i][keys];
                    }
                }

                if (sortObj && sortObj.sortField && sortObj.sortOrder) {
                    uri += '&sortField=' + sortObj.sortField + '&sortOrder=' + sortObj.sortOrder;
                }

                if (start && limit) {
                    uri += '&start=' + start + '&limit=' + limit;
                }

                return $http({
                    method: 'GET',
                    url: uri,
                    data: '',
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                // This is currently breaking unit tests.  If I need it,
                // I will need to create some sort of override where I can
                // pass in the datetime for unit testing.  I don't think it
                // is needed for IE8 since I am turning cache off at the server.
                //params: {nocache: new Date().getTime()}})

                    .then(success)['catch'](exception.catcherHttp());
            }

            function success(response) {
                console.log("overview" + JSON.stringify(response));
                return response;
            }
        }



    }
})();
