(function () {
    'use strict';

    angular
        .module('wdts.commonui.services')
        .factory('overviewService', overviewService);

    overviewService.$inject = ['$http', '$q', 'logger', 'config','store','exception','$translate', 'jwtTokenKey'];

    function overviewService($http, $q, logger, config,store,exception,$translate,jwtTokenKey) {
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
           // getTableGridStats:getTableGridStats,
            getSearchedPlayerById: getSearchedPlayerById,
            getSearchedPlayerByName: getSearchedPlayerByName,
            getAnonymousPlayerById: getAnonymousPlayerById,
            getChipsInfo: getChipsInfo,
            getCageTransactions : getCageTransactions,
            setRollDTM: setRollDTM,
            getTransactionDetails : getTransactionDetails,
            getChipTrayScanDetails : getChipTrayScanDetails,
            setNodeData:setNodeData,
            getNodeData:getNodeData,
            setBackName:setBackName,
            getBackName:getBackName,
            setLoadTree: setLoadTree,
            getLoadTree: getLoadTree,
            getGamingDays:getGamingDays,
            createVirtualGroup:createVirtualGroup,
            getVirtualGroup: getVirtualGroup,
            getAllVirtualGroups:getAllVirtualGroups,
            updateVirtualGroup:updateVirtualGroup,
            deleteVirtualGroup:deleteVirtualGroup,
            getVirtualGroupStats: getVirtualGroupStats,
            getVirtualGroupById:getVirtualGroupById,
            getUserNameFromJWT:getUserNameFromJWT,
            getSwipedPlayer:getSwipedPlayer,
            getUsersById:getUsersById,
            getUsersByFirstName:getUsersByFirstName,
            getUsersByLastName:getUsersByLastName,
            getUsersByFLName:getUsersByFLName,
            getUserByUserName:getUserByUserName,
            getRefreshedToken:getRefreshedToken,
            ppMasterLogout:ppMasterLogout,
            getChipsInfoTreasury:getChipsInfoTreasury,
            getFiltersLabelsCageTransaction:getFiltersLabelsCageTransaction,
            getNode:getNode,
            setNode:setNode,
            getStatus:getStatus,
            setStatus:setStatus,
            getKnownPlayer:getKnownPlayer,
            getTableInactiveStatus:getTableInactiveStatus
        };

        service.node = null;
        service.backName = null;
        service.loadTree = true;
        service.nodePlayer = {
            "PLAYER_CASINO_WIN": '-',
            "THEO_WIN_PLAYER_PROFILE" : '-',
            "PLAYER_LAST_LOCATION" : '-',
            "PLAYER_LAST_TIME": '-',
            "PLAYER_TOTAL_TIME_PLAYED" : '-',
            "PLAYER_BANKROLL_VALUE": '-'
        };

        service.status = '-';

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

        //http://192.168.1.164:8150/api/cage/v1/topologyRollInfo?topologyId=3
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


        //http://localhost:8150/api/cage/v1/currentgamingday?topolgyId=9
        //localGamingDay?topologyId=4
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

        function getTableStats(gd, nodesId, viewId) {

            if (gd != null) {

                //var nodeIds = nodesId.toString();
                if (!viewId) {
                    service.url = config.casino.route + '?gamingDay=' + gd + '&topologyIds=' + nodesId;
                }
                else {
                    service.url = config.casino.route8 + '?gamingDay=' + gd + '&topologyIds=' + nodesId + '&viewId=' + viewId
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
                // console.log("Table stats"+JSON.stringify(response));
                return response.data;
            }
        }

        //function getTableGridStats(gd, nodesId, viewId) {
        //
        //    if (gd != null && nodesId) {
        //
        //        service.url = 'http://' +  config.webserver + '/api/casinomanager/v1/topologyStatisticsWithCount?gamingDay=' + gd + '&topologyIds=' + nodesId + '&viewId=' + viewId;
        //
        //        return $http({
        //
        //            method: 'GET',
        //            url: service.url,
        //            data: ''
        //
        //        })
        //        // This is currently breaking unit tests.  If I need it,
        //        // I will need to create some sort of override where I can
        //        // pass in the datetime for unit testing.  I don't think it
        //        // is needed for IE8 since I am turning cache off at the server.
        //        //params: {nocache: new Date().getTime()}})
        //
        //            .then(success)
        //            ['catch'](exception.catcherHttp());
        //    }
        //
        //    function success(response) {
        //        // console.log("Table stats"+JSON.stringify(response));
        //        return response.data;
        //    }
        //}

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
                if (response.data.length) {
                    return response.data;
                }

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
                if (!response.data.length || !response.data[0].lastSessionStatus) {
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

        function getAnonymousPlayerById (plrid, gd) {
            if (gd != null) {

                service.url = config.casino.route9 + '?playerId=' + plrid + '&gamingDay=' + gd;
                return $http({
                    method: 'GET',
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
                return response.data;
            }

            function fail(e) {
                if (e.status == 404){
                    logger.info($translate.instant('application.app.common.labels.TOPNAV.PLAYER_NOT_FOUND'));
                }

                return $q.reject(e);
            }
        }

        function getChipsInfo() {
            return $http({
                method: 'GET',
                url: config.chip.chips + '?_summary=true',
                data: ''

            }).then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                // console.log("Table stats"+JSON.stringify(response));
                return response.data;
            }
        }
        function getChipsInfoTreasury(filterArray,start,limit) {
            var uri = config.chip.chips + '?_summary=true'
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

            console.log("uri:::"+uri);

            return $http({
                method: 'GET',
                url: uri,
                data: ''

            }).then(success)['catch'](exception.catcherHttp());

            function success(response) {
                // console.log("Table stats"+JSON.stringify(response));
                return response.data;
            }
        }


        function getCageTransactions(cageId, date,start,limit,filterArray, sortObject) {
            if(date && cageId){
                var uri = config.cage.route + 'transactions?'+ 'gamingDay='+date;
                if(start && limit){
                    uri += '&start='+start+'&limit='+limit;
                }
                if(filterArray){
                    if(filterArray.length > 0){
                        for(var i=0; i<filterArray.length; i++){

                            var keys = Object.keys(filterArray[i]);
                            if (filterArray[i][keys] == "BUY IN"){
                                filterArray[i][keys] = "BUYIN";
                            }

                            if(keys=="toplogyNodeId")
                            {
                                cageId = filterArray[i][keys];
                            }
                            else{
                                uri += '&' + keys + '=' + filterArray[i][keys];
                            }

                        }
                    }
                }
                uri+='&toplogyNodeId='+cageId;
                // if (uri.indexOf('Anonymous')!=-1) {
                //     if(uri.indexOf(',Anonymous,')!=-1){
                //         uri = uri.replace(",Anonymous,", ",")
                //     }
                //     if(uri.indexOf('Anonymous,')!=-1){
                //         uri = uri.replace("Anonymous,", "")
                //     }
                //     if(uri.indexOf(',Anonymous')!=-1){
                //         uri = uri.replace(",Anonymous", "")
                //     }
                //     if(uri.indexOf('Anonymous')!=-1){
                //         uri = uri.replace("Anonymous", "")
                //         uri = uri.replace("playerNames=&", "")
                //     }
                //     uri = uri +"&playerTypes=ANONYMOUS"
                // }

                if(sortObject && sortObject.sortField && sortObject.sortOrder) {
                    uri += '&' + "sortField" + '=' + sortObject.sortField;
                    uri += '&' + "sortOrder" + '=' + sortObject.sortOrder;
                }
                return $http({
                    method: 'GET',
                    url: uri,
                    data: '',
                    headers: {'Content-Type': 'application/json'}

                }).then(success)
                    ['catch'](exception.catcherHttp());
            }

            function success(response) {
                if(response.data.successObj.length){
                    angular.forEach(response.data.successObj,function(item){
                        if(item.type === 'UPDATE_OWNER'){
                            item.type = 'TRANSFER';
                        }
                    })
                }
                return response;
            }
        }


        function setRollDTM(data){
            return $http({
                method: 'POST',
                url: config.cage.route + 'nextRollDtm',
                data: data,
                headers: {'Content-Type': 'application/json'}

            }).then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                // console.log("Table stats"+JSON.stringify(response));
                return response.data;
                //return demoJson;
            }
        }

        function getTransactionDetails(transId){
            return $http({
                method: 'GET',
                url: config.chip.chips + '?_summary=true&uuid='+transId,
                data: ''

            }).then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                // console.log("Table stats"+JSON.stringify(response));
                return response.data;
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
                // console.log("Table stats"+JSON.stringify(response));
                return response.data;
            }
        }

        function getGamingDays(siteId){
            return $http({
                method: 'GET',
                url: config.cage.route + 'localGamingDaysInHierarchy?topologyId='+siteId

            }).then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                console.log("Table stats"+JSON.stringify(response.data));
                return response.data;
            }
        }

        function createVirtualGroup(node){
            return $http.post(config.topologyGroups.route+"/api/topology/v1/topologyGroups/", node)
                .then(success)
                ['catch'](fail);

            function success(response) {
                return response.data;
            }

            function fail(e) {
                console.log(e.data[0]);
                var isGroupExist = e.data[0].code === 40300 && e.data[0].status === 403;
                if (isGroupExist) {
                    logger.info($translate.instant('application.app.CONFIGURATION_LABELS.CHIPSETS.MESSAGE.GROUP_WITH_SAME_NAME_EXIST'));
                } else {
                    logger.fatal('XHR Failed for adding virtual group', e);
                }
                return $q.reject(e);
            }
        }

        function getVirtualGroup(userId) {
            return $http({
                method: 'GET',
                url: config.topologyGroups.route + "/api/topology/v1/topologyGroups/?groupType=VIRTUAL&userId=" + userId
            })
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                console.log(response);
                return response.data;
            }
        }

        function getAllVirtualGroups() {
            return $http({
                method: 'GET',
                url: config.topologyGroups.route + "/api/topology/v1/topologyGroups/?groupType=VIRTUAL"
            })
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                console.log(response);
                return response.data;
            }
        }

        function getVirtualGroupById(id) {
            return $http({
                method: 'GET',
                url: config.topologyGroups.route + "/api/topology/v1/topologyGroups/" + id
            })
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                console.log(response);
                return response.data;
            }
        }

        function updateVirtualGroup(groupId,object){

            var url = config.topologyGroups.route + "/api/topology/v1/topologyGroups/" + groupId;

            return $http({
                method: 'PUT',
                url: url,
                data: object,
                headers: {'Content-Type': 'application/json'}

            }).then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                //logger.info('result is --' + response);
                return response.data;
            }
        }


        function getVirtualGroupStats(gd, grpId) {

            if (gd != null) {

                service.url = config.casino.route5 + 'topologyStatisticsForVirtualGroup?gamingDay='+ gd +'&topologyGroupId=' + grpId +'&viewId=12';

                return $http({

                    method: 'GET',
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
        function setNode(arg){
            service.nodePlayer = arg;
        }

        function getNode(){
            return service.nodePlayer;
        }


        function setNodeData(arg){
            service.node = arg;
        }

        function getNodeData(){
            return service.node;
        }
        function setStatus(arg){
            service.status = arg;
        }

        function getStatus(){
            return service.status;
        }

        function setBackName(arg){
            service.backName = arg;
        }

        function getBackName(){
            return service.backName;
        }

        function setLoadTree(arg){
            service.loadTree = arg;
        }

        function getLoadTree(){
            return service.loadTree;
        }

        //this is by username
        function getUserNameFromJWT(username){
            return $http({
                method: 'GET',
                url: config.user.users + '/?userName='+username,
                data: ''

            }).then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return(response.data);
            }
        }
        function getKnownPlayer(id){
            if(id != null) {

                return $http({
                    method: 'GET',
                    url: config.player.route + id + '?fetch=true',
                    headers: {'Content-Type': 'application/json'},
                    data: ''
                })
                    .then(success)
                    ['catch'](exception.catcherHttp());
            }
            function success(response) {
                console.log('known player data - ' + JSON.stringify(response));
                return response.data;
            }
        }

        function getUserByUserName(username,title,auth){
            return $http({
                method: 'GET',
                url: config.auth.users + '/?userName='+username+ '&userType=' + title,
                headers:{'Authorization':auth},
                data: ''

            }).then(success)
                ['catch'](fail);

            function success(response) {
                return(response.data);
            }

            function fail(e) {
                console.log('XHR Failed for get user by username', e);
                if(e.status == 404){
                    logger.info($translate.instant('application.app.common.labels.TOPNAV.USER_NOT_FOUND'));
                }
                return $q.reject(e);
            }

        }


        function getUsersById(arg,title,auth){

            return $http({
                method: 'GET',
                url: config.auth.users + '/?employeeId='+arg+ '&userType=' + title,
                headers:{'Authorization':auth},
                data: ''

            }).then(success)
                ['catch'](fail);

            function success(response) {
                return(response.data);
            }

            function fail(e) {
                console.log('XHR Failed for get user by id', e);
                if(e.status == 404){
                    logger.info($translate.instant('application.app.common.labels.TOPNAV.USER_NOT_FOUND'));
                }
                return $q.reject(e);
            }

        }
        function getUsersByFirstName(arg,title,auth){

            return $http({
                method: 'GET',
                url: config.auth.users + '/?firstName='+ arg+ '&userType=' + title,
                headers:{'Authorization':auth},
                data: ''

            }).then(success)
                ['catch'](fail);

            function success(response) {
                return(response.data);
            }

            function fail(e) {
                console.log('XHR Failed for get user by first name', e);
                if(e.status == 404){
                    logger.info($translate.instant('application.app.common.labels.TOPNAV.USER_NOT_FOUND'));
                }
                return $q.reject(e);
            }

        }
        function getUsersByLastName(arg,title,auth){

            return $http({
                method: 'GET',
                url: config.auth.users + '/?lastName='+ arg + '&userType=' + title,
                headers:{'Authorization':auth},
                data: ''

            }).then(success)
                ['catch'](fail);

            function success(response) {
                return(response.data);
            }

            function fail(e) {
                console.log('XHR Failed for get user by last name', e);
                if(e.status == 404){
                    logger.info($translate.instant('application.app.common.labels.TOPNAV.USER_NOT_FOUND'));
                }
                return $q.reject(e);
            }

        }

        function getUsersByFLName(fname, lname,title,auth) {

            return $http({
                method: 'GET',
                url: config.auth.users + '/?lastName='+ lname + '&firstName='+ fname + '&userType=' + title,
                headers:{'Authorization':auth},
                data: ''

            }).then(success)
                ['catch'](fail);

            function success(response) {
                return(response.data);
            }

            function fail(e) {
                console.log('XHR Failed for get user by firrst and last name', e);
                if(e.status == 404){
                    logger.info($translate.instant('application.app.common.labels.TOPNAV.USER_NOT_FOUND'));
                }
                return $q.reject(e);
            }
        }

        function deleteVirtualGroup(groupId,node){

            var url = config.topologyGroups.route + "/api/topology/v1/topologyGroups/" + groupId;

            return $http({
                method: 'DELETE',
                url: url,
                data: node,
                headers: {'Content-Type': 'application/json'}

            }).then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                //logger.info('result is --' + response);
                return response.data;
            }
        }

        function getRefreshedToken(qrStr) {
            console.log("getSuperUserToken:::::");
            return $http({
                method: 'POST',
                url: config.auth.oauthRefresh + '?'+qrStr,
                headers: {
                    'Content-Type': 'application/json','Authorization': "Bearer " + store.get(jwtTokenKey)
                }
            })
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                //console.log('received data: ' + JSON.stringify(response.data));
                return response.data;
            }
        }

        function ppMasterLogout(){
            return $http({
                method: 'POST',
                url: config.auth.oauthLogout,
                headers: {
                    'Content-Type': 'application/json','Authorization': "Bearer " + store.get(jwtTokenKey)
                }
            })
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                //console.log('received data: ' + JSON.stringify(response.data));
                return response.data;
            }
        }

        function getFiltersLabelsCageTransaction(cageId, date) {
            if(date && cageId){
                var uri = config.cage.route + 'filters?'+ 'gamingDay='+date+'&toplogyNodeId='+cageId;
                return $http({
                    method: 'GET',
                    url: uri,
                    data: '',
                    headers: {'Content-Type': 'application/json'}

                }).then(success)
                    ['catch'](exception.catcherHttp());
            }

            function success(response) {
                return response.data;
            }
        }

        function getTableInactiveStatus(tabletopologyId){
            if(tabletopologyId) {

                return $http({
                    method: 'GET',
                    url: config.topologyNodes.route+tabletopologyId,
                    headers: {'Content-Type': 'application/json'}
                })
                    .then(success)
                    ['catch'](exception.catcherHttp());
            }
            function success(response) {
                return response.data;
            }
        }
    }
})();
