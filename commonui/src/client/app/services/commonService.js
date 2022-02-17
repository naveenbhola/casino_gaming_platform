/* jshint -W117 */
(function () {
    'use strict';

    angular
        .module('wdts.commonui.services')
        .service('commonService', commonService);

    commonService.$inject = ['$q', 'topologyService', 'overviewService', 'alertsService', '$rootScope', 'cageService', 'store', 'jwtHelper', 'jwtTokenKey', 'applicationCode','casinoManagerService','configurationService', '$http', 'config', 'exception'];

    /* @ngInject */
    function commonService($q, topologyService, overviewService, alertsService, $rootScope, cageService, store, jwtHelper, jwtTokenKey, applicationCode, casinoManagerService,configurationService, $http, config, exception) {
        // Topology Types Variables
        var deferred = $q.defer();
        var isTableDB = false;
        var playerData = {};
        this.playerData = {};
        var allData = {};
        var playerStatus = '';
        var cageAreas = [];
        var dataTree = [];
        var tableIds = [];
        var companyId;
        var tablePositionMap = new Map();
        let tableTopologies = [];
        let nonPPTables = [];
        let ppTables = [];
        let self = this;

        this.getDataTree = function () {
            return dataTree;
        };
        var dataFields = {};

        var topologyTypeMap;
        var topologyNodes = [];

        var virtualGroupMap = new Map();

        this.getTopologyTypeMap = function () {
            return topologyTypeMap;
        };

        var topologySubTypeMap = new Map();
        this.getTopologySubTypeMap = function () {
            return topologySubTypeMap;
        };
        var leafNodes = [];
        var dataActivated = false;
        //Topology Order Nodes


        var topologyMap = new Map();

        this.getTopologyMap = function () {
            return topologyMap;
        };

        //topologyIdMap ---- id : type
        var topologyIdMap = new Map();
        this.getTopologyIdMap = function () {
            return topologyIdMap;
        };

        //topologyParentMap --- id : parentId
        var topologyParentMap = new Map();
        this.getTopologyParentMap = function () {
            return topologyParentMap;
        };

        //topologyChildMap  --- id : [childIds]
        var topologyChildMap = new Map();
        this.getTopologyChildMap = function () {
            return topologyChildMap;
        };

        //topologyNodeMap --   id : object
        var topologyNodeMap = new Map();
        this.getTopologyNodeMap = function () {
            return topologyNodeMap;
        };

        //topologyPathMap ---- name : path
        var topologyPathMap = new Map();
        this.getTopologyPathMap = function () {
            return topologyPathMap;
        };

        //topologyNameMap --- shortname : id
        var topologyNameMap = new Map();
        this.getTopologyNameMap = function () {
            return topologyNameMap;
        };

        //topologyNameMap2 --- name : id
        var topologyNameMap2 = new Map();
        this.getTopologyIdMap2 = function () {
            return topologyNameMap2;
        };

        //topologyIdList -- child of current node array - []
        var topologyIdList = [];
        this.getTopologyIdList = function () {
            return topologyIdList;
        };

        var tablePositionMap = new Map();

        var topologyIdParent = [];
        this.getTopologyIdParent = function () {
            return topologyIdParent;
        };

        var siteId;
        this.getSiteId = function () {
            return siteId;
        };

        var companyName;
        this.getCompanyName = function () {
            return companyName;
        };

        var rootNodeId;
        this.getRootNodeId = function () {
            return rootNodeId;
        };

        this.getAllData = function () {
            return allData;
        };

        var filteredObjHolder = [];
        var gamingDay;

        //*filterService
        var updateFiltredObj = [];
        var colList = [];
        var colProps = [];
        var originalObj = [];
        var chked =false;
        var gameData = [];
        //*Broadcast to update the data on UI
        this.updateObjectOnScreen = function (filteredObj, filteredObjName) {
            filteredObjHolder = filteredObj;
            $rootScope.filteredObjName = filteredObjName;
            $rootScope.$broadcast('FILTER_DATA_UPDATED', filteredObj, filteredObjName);
        };
        //Broadcast to update the data on UI*//

        this.getTableData = function () {
            return filteredObjHolder;
        };

        this.getfilteredObjName = function () {
            return $rootScope.filteredObjName;
        };

        this.setUpdatedObj = function(filteredObjUpdated){
            updateFiltredObj = filteredObjUpdated;
        };

        /*clubbing features*/

        this.getColList = function () {
            return colList;
        };

        this.setColList = function (list) {
            colList = list;
        };

        this.getSelColProps = function () {
            return colProps;
        };

        this.setSelColProps = function (colprop) {
            colProps = colprop;
        };

        this.getUpdatedObj = function () {
            return updateFiltredObj;
        };

        this.setOriginalObj = function (obj) {
            originalObj = obj;
        };

        this.getOriginalObj = function (obj) {
            return originalObj;
        };
        this.setcheckboxclicked = function(chk){
            chked =chk;
        };
        this.getcheckboxclicked = function(){
            return chked;
        };

        /*clubbing features end*/

        //filterService*//

        //Underscore Mixin Object for filtering
        _.mixin({
            'findByValues': function(collection, property, values) {
                return _.filter(collection, function(item) {
                    return _.contains(values, String(item[property]));
                });
            },
            'findByStatus': function(collection, property, values) {
                return _.filter(collection, function(item) {
                    return _.contains(values, JSON.stringify(item[property]));
                });
            },
            'findByProps':function(collection,properties,values){

                var finalArr = [];
                angular.forEach(properties,function(value,key){
                    if(value && value!="-- SELECT --") {
                        var filterArr = _.findByValues(collection, value, values);
                        collection = filterArr;
                        if (key == (properties.length - 1)) {
                            return collection
                        }
                    }

                });

                return collection;
            }
        });
        //Underscore Mixin Object for filtering

        //globalTopologyId --- current topology


        //Initialize the common data
        this.init = function (isTable) {
            isTableDB = isTable;
            if (!this.isActivated()) {
                getTopologyTypes();
            } else {
                deferred.resolve(allData);
            }
            return deferred.promise;
        };
        this.getPlayer = function(argss, topologyData) {
            if(!this.isActivated()){
                getPlayer(argss, topologyData);
            } else {
                deferred.resolve(playerData);
            }
            return deferred.promise;
        };

        this.initAlerts = function () {
            if (!this.isActivated()) {
                this.setTopologyNodesData();
            } else {
                deferred.resolve(topologyNodes);
            }

            return deferred.promise;
        };

        //Initialize the common data
        this.currentAppPermissions = function() {
            var jwt_config = store.get(jwtTokenKey);
            var decodedJwt = jwtHelper.decodeToken(jwt_config);
            var app = _.findWhere(decodedJwt.authorities, {"applicationCode": applicationCode});
            return app;
        };

        this.isActivated = function () {
            return dataActivated;
        };

        function getTopologyTypes() {
            topologyService.getTopologyTypes().then(function (data) {
                topologyTypeMap = new Map();
                topologySubTypeMap = new Map();

                for (var i = 0; i < data.length; i++) {
                    topologyTypeMap.set(data[i].topologyTypeId, data[i].topologyType);
                    topologySubTypeMap.set(data[i].topologyTypeId, data[i].subTypeName);
                    if (data[i].childTypeIds.length == 0 && data[i].topologyType != "PLACEHOLDER_UNKNOWN") {
                        leafNodes.push(data[i].topologyTypeId);
                    }
                }
                setOrderNodes();
                getVirtualGroup();

            });
        }

        this.setTopologyNodesData = function () {
            topologyService.getTopologyDetails().then(function (data) {
                for (var i = 0; i < data.length; i++) {
                    topologyNodes.push(data[i]);
                }

                dataActivated = true;
                deferred.resolve(topologyNodes);
            });
        };

        this.getTopologyNodesData = function(){
            return topologyNodes;
        };

        function getVirtualGroup() {

            overviewService.getAllVirtualGroups().then(function (data) {
                virtualGroupMap = new Map();

                if (data != null && data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        virtualGroupMap.set(data[i].topologyGroupId, data[i].groupName);
                    }

                    allData.virtualGroupMap = virtualGroupMap;
                }
                else {
                    allData.virtualGroupMap = virtualGroupMap;
                }
            });
        }

        function setOrderNodes() {
            return topologyService.getTopologyNodes().then(function (data) {
                var promises = [];

                for (var i = 0; i < data.length; i++) {
                    topologyMap.set(data[i].nodeId, data[i].name);
                    topologyParentMap.set(data[i].nodeId, data[i].parentNodeId);
                    topologyIdMap.set(data[i].nodeId, data[i].type);
                    topologyPathMap.set(data[i].shortName, data[i].name);
                    topologyNodeMap.set(data[i].nodeId, data[i]);
                    topologyNameMap.set(data[i].shortName, data[i].nodeId);
                    topologyNameMap2.set(data[i].name, data[i].nodeId);

                    if (data[i].childNodesHrefs.length > 0) {
                        var nodes = [];
                        var children = data[i].childNodesHrefs;
                        for (var l = 0; l < children.length; l++) {
                            var childNodeId = children[l].split('/');
                            var nodeId = parseInt(childNodeId[childNodeId.length - 1]);
                            if (nodes.indexOf(nodeId) == -1) {
                                nodes.push(nodeId);
                            }
                        }
                        topologyChildMap.set(data[i].nodeId, nodes);
                    }
                    else {
                        topologyChildMap.set(data[i].nodeId, null);
                    }


                    /***
                     * calculate the SITE ID and get gaming day for it to be passed in all the other API requests
                     */

                    if (topologyTypeMap.get(data[i].type) == 'SITE') {
                        siteId = data[i].nodeId;
                        if (siteId) {
                            promises.push(getGamingDay(siteId));
                            promises.push(getGamingDays(siteId));
                        }

                    }
                    if(topologyTypeMap.get(data[i].type) == 'BACCARAT'){
                        tableIds.push(data[i].nodeId);
                    }
                    if(topologyTypeMap.get(data[i].type) == 'COMPANY_NAME'){
                        companyId = data[i].nodeId;
                    }
                }

                for (var i = 0; i < data.length; i++) {
                    if (data[i].parentNodeId == null && (data[i].globalKey == null || data[i].globalKey == 'ROOT')) {
                        rootNodeId = data[i].nodeId;
                        companyName = data[i].name;
                        topologyIdParent.push(rootNodeId);
                        topologyIdList = topologyChildMap.get(topologyIdParent[0]);

                        break;
                    }
                }

                //tableService.setMap($scope.topologyMap);

                data.sort(function (a, b) {
                    return (a.type > b.type) ? 1 : ((b.type > a.type) ? -1 : 0);
                });


                allData.topologyMap = topologyMap;
                allData.topologyTypeMap = topologyTypeMap;
                allData.topologySubTypeMap = topologySubTypeMap;
                allData.leafNodes = leafNodes;

                allData.topologyIdMap = topologyIdMap;
                allData.topologyParentMap = topologyParentMap;
                allData.topologyChildMap = topologyChildMap;
                $rootScope.topologyNodeMap = allData.topologyNodeMap = topologyNodeMap;
                allData.topologyPathMap = topologyPathMap;
                allData.topologyNameMap = topologyNameMap;
                allData.topologyNameMap2 = topologyNameMap2;
                allData.topologyIdList = topologyIdList;
                allData.topologyIdParent = topologyIdParent;
                allData.siteId = siteId;
                allData.companyId = companyId;
                allData.companyName = companyName;
                $rootScope.companyName = companyName;
                allData.rootNodeId = rootNodeId;
                allData.topologyIdMap.forEach(findCageAreas);
                allData.cageAreas = cageAreas;
                allData.cageAreas = cageAreas;

                promises.push(getTopologyNodes(data));

                dataActivated = true;

                $q.all(promises).then(function () {
                    deferred.resolve(allData);
                });

            });

        }

         this.getTablePositions = function(){
            return configurationService.getTablePositionMap(tableIds.toString()).then(function(data){
                var topologyPosObj = data;
                for(var i=0; i<topologyPosObj.length; i++){
                    for(var j=0; j<topologyPosObj[i].propertyValues.length; j++){
                        if(topologyPosObj[i].propertyValues[j].propertyCode === 'com.wdts.table.num.player.positions'){
                            tablePositionMap.set(topologyPosObj[i].topologyId,topologyPosObj[i].propertyValues[j].propertyValue);
                        }
                    }
                }
                allData.tablePositionMap = tablePositionMap;
            });
        };

        /*
        * @description: Get All NonPP Tables from the available topologyIds
        * */
        this.getNonPPTables = function() {
            let defer = $q.defer();
            if(!nonPPTables.length) {
                topologyService.getTopologyNodes().then((data) => {
                    tableTopologies = [];
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].type === 1200) {
                            tableTopologies.push(data[i].nodeId);
                        }
                    }
                    configurationService.getNonPPTopologyNodes(tableTopologies.toString()).then((data) => {
                        nonPPTables = [];
                        for (let _i = 0; _i < data.length; _i++) {
                            if (data[_i].propertyValues[1].propertyValue.toLowerCase() === "false") {
                                nonPPTables.push(data[_i].topologyId);
                            }
                        }
                        defer.resolve(nonPPTables);
                    });
                });
            }else{
                defer.resolve(nonPPTables);
            }

            return defer.promise;
        };

        /*
         * @description: Get All PP Tables from the available topologyIds
         * */
        this.getPPTables = function(){
            let defer = $q.defer();
            if(!ppTables.length) {
                self.getNonPPTables().then((data) => {
                    ppTables = tableTopologies.filter((value)=>{
                        return !data.includes(value)
                    });
                    defer.resolve(ppTables);
                });
            }else{
                defer.resolve(ppTables);
            }
            return defer.promise;
        };

        function getTopologyNodes(data) {

            var unassigned = [];
            var k = 0;
            var childNodes = [];
            dataFields = {
                id: 'nodeId',
                items: 'items',
                pid: 'parentNodeId',
                text: 'name'
            };
            /**
             * here we get the unassigned node by calling global/UNASSIGNED API
             */
            return topologyService.getTopologyNodeUnassigned().then(function (node) {

                var obj = node[0];
                obj.globalKey = "ROOT";
                obj.topologyTypeId = node[0].type;
                obj.name = node[0].name;
                //obj.checked = false;
                unassigned.push(obj);
                var unassignedName = obj.name;
                unassigned[0].items = [];
                if (node[0].childNodesHrefs.length > 0) {
                    obj.hasChildren = true;
                    obj.expanded = false;
                    var children = node[0].childNodesHrefs;
                    for (var l = 0; l < children.length; l++) {
                        var childNodeId = children[l].split('/');
                        childNodes.push(parseInt(childNodeId[childNodeId.length - 1]));
                    }
                }
                else {
                    obj.hasChildren = false;
                    obj.expanded = false;
                }

                /**
                 * work on ordered data returned from setOrderNodes function
                 * and find out unassigned items and put them under different tree
                 * and put down already assigned items in different tree
                 */

                for (var i = 0; i < data.length; i++) {
                    console.log('unassigned node name ' + unassignedName);
                    if (childNodes.indexOf(data[i].nodeId) === -1 && data[i].name != unassignedName) {
                        dataTree[k] = data[i];
                        dataTree[k].topologyTypeId = data[i].type;
                        dataTree[k].name = data[i].name;
                        dataTree[k].value = data[i].name;
                        //  dataTree[k].checked = false;
                        if (data[i].childNodesHrefs && data[i].childNodesHrefs.length > 0) {
                            dataTree[k].hasChildren = true;
                            dataTree[k].expanded = true;
                        }

                        k++;
                    }
                    else if (childNodes.indexOf(data[i].nodeId) != -1 && data[i].name != unassignedName) {
                        topologyService.getTopologyNode(data[i].nodeId).then(function (data) {
                            var child = data[0];
                            child.topologyTypeId = data[0].type;
                            child.hasChildren = false;
                            child.expanded = false;
                            unassigned[0].items.push(child);
                        });
                    }
                }
                /*
                 add data to topology tree - assigned nodes
                 */

                allData.dataTree = dataTree;
                allData.dataFields = dataFields;

                $rootScope.commonData = allData;

                return allData.dataTree;
            });
        }

        function findCageAreas(value, key, map) {
            if (allData.topologyTypeMap.get(allData.topologyIdMap.get(key)) == "CAGE_AREAS") {
                cageAreas.push(key);
            }

        }

        function getPlayer(arg, topologyData){
            playerData.playerId= arg.playerId;
            playerData.topologyIdUrl = arg.topologyId;
            playerData.gamingDay = arg.gamingDay;

            return casinoManagerService.getPlrProfileData(playerData.gamingDay, playerData.topologyIdUrl, playerData.playerId).then(function (data) {
                playerData.plrProfileobj = data;
                var array = playerData.plrProfileobj.data[0].stats;
                playerData.node = {
                    "PLAYER_CASINO_WIN": array[0],
                    "THEO_WIN_PLAYER_PROFILE" : array[1],
                    "PLAYER_LAST_LOCATION" : topologyData.topologyMap.get(parseInt(array[5])),
                    "PLAYER_LAST_TIME": array[6],
                    "PLAYER_TOTAL_TIME_PLAYED" : array[4],
                    "PLAYER_BANKROLL_VALUE": array[7]
                };

                overviewService.getSearchedPlayerById(playerData.playerId, playerData.gamingDay).then(function (data) {
                    playerData.searchedPlrobj = data[0];

                    if(playerData.searchedPlrobj.lastSessionStatus == 'IN_PROGRESS'){
                        playerStatus = 'ACTIVE';
                    }
                    else{
                        playerStatus = 'INACTIVE';
                    }
                    playerData.playerStatus =   playerStatus;
                });

                this.playerData = playerData;
                deferred.resolve(playerData);
            });
        }

        function getGamingDay(id) {
            return overviewService.getCurrentGamingDay(id).then(function (data) {
                allData.gamingDayFromURL = data.successObj;
                $rootScope.currentGamingDay = data.successObj;
                var d = data.successObj.split('T');
                gamingDay = d[0];
                allData.gamingDay = gamingDay;
                $rootScope.siteGamingDay = gamingDay;
                $rootScope.gamingDayFromURL = gamingDay;

            });
        }

        function getGamingDays(id) {
            return overviewService.getGamingDays(id).then(function (data) {
                allData.gamingDays = data.successObj;
                //deferred.resolve(allData);
            })
        }

        this.getUnqValsForFilters = function (obj, column) {
            var filteredArr = new Array();
            filteredArr = _.chain(obj).pluck(column).unique().value().toString().split(",");
            filteredArr.push("ANY");
            return filteredArr;
        };

        this.getUnqValsForFiltersAlernate = function (obj, column, isAny) {
            var filteredArr = new Array();
            var prevVal = '';
            angular.forEach(obj, function (value, key) {
                //console.log("key::"+key,value[column]);
                if (value[column] != '') {
                    if (prevVal == value[column] || (filteredArr.indexOf(value[column]) > -1)) {

                    }
                    else {
                        prevVal = value[column];
                        filteredArr.push(value[column]);
                    }
                }

            });
            filteredArr.push("ANY");
            return filteredArr;
        };

        this.filterByProps = function (collection, properties, values) {
            angular.forEach(properties, function (value, key) {
                if (value && value != "-- SELECT --") {
                    collection = _.findByValues(collection, value, values);
                    if (Number(key) == (properties.length - 1)) {
                        return collection
                    }
                }

            });

            return collection;
        };

        this.getUnqValsForDenoms = function (obj, column) {
            var filteredArr = [];
            filteredArr = _.chain(obj).pluck(column).unique().value().toString().split(",");
            return filteredArr;
        };

        this.orderGame = function (predicate) {
            $scope.predicate = predicate;
            $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
            //console.log("before--"+JSON.stringify($scope.sessionData))
            $scope.gameData = orderBy($scope.gameData, predicate, $scope.reverse);
            console.log("after--" + JSON.stringify($scope.gameData));
        };

        this.getFilterArray = function (list) {
            var filters = [];
            if(list && list.length){
                for (var i = 0; i < list.length; i++) {
                    filters.push({
                        name: (list[i].userId == -17) ? '(Blanks)' : this.getUserFormattedName(list[i]),
                        filterValue: list[i].userId
                    });
                }
            }
            return filters;
        };

        this.getUserFormattedName = function (item) {
            if(item.userId != -17) {
                return item.lastName + ', ' + item.firstName + '(' + item.employeeNumber + ')';
            }
        };

        this.getSiteIdByArg = function(arg)
        {
            var site = allData.topologyParentMap.get(parseInt(arg));
            var type = allData.topologyIdMap.get(parseInt(site));

            if (allData.topologyTypeMap.get(parseInt(type)) !== 'SITE') {
                this.getSiteIdByArg(allData.topologyParentMap.get(arg));
            }
            return site
        }

        this.autoDetectCardSwipe = (callback)=> {
            //Swipe card functionality without clicking "Swipe Player ID Card" button
            document.onkeypress =  (e) => {
                e = e || window.event;
                var charCode = typeof e.which == "number" ? e.which : e.keyCode;
                // store it , in this example, i use sessionStorage
                if (sessionStorage.getItem("card") && sessionStorage.getItem("card") != 'null') {
                    // append on every keypress
                    sessionStorage.setItem("card", sessionStorage.getItem("card") + String.fromCharCode(charCode));
                } else {
                    // remove sessionStorage if it takes 150 ms (you can set it)
                    sessionStorage.setItem("card", String.fromCharCode(charCode));
                    setTimeout(function () {
                        sessionStorage.removeItem("card");
                    }, 150);
                }
                // when reach on certain length within 150ms, it is not typed by a human being
                if (sessionStorage.getItem("card")) {
                    //console.log(sessionStorage.getItem("card"));
                    // do some validation
                    if (sessionStorage.getItem("card").charAt(0) == ';' && sessionStorage.getItem("card").charAt(sessionStorage.getItem("card").length - 1) == '?') {

                        var cardData = sessionStorage.getItem("card");
                        callback.call(this,cardData);
                    }
                }
            };
        }

    }
})();
