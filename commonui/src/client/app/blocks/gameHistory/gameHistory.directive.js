(function () {
    'use strict';

    var app = angular.module('wdts.gameHistory', []);
    app.directive('gameHistory', gameHistory);

    /* @ngInject */

    function gameHistory() {
        return {
            bindToController: true,
            controller: gameHistoryController,
            controllerAs: 'vm',
            restrict: 'E',
            scope: {
                type: '@',  //Allowed types: 'BY_GAMING_DAY', 'BY_SESSION_ID'
                topologyId: '=',
                sessionId: '=',
                shoeId: '=',
                tableIp: '=',
                shoeIdRef: '='
            },
            templateUrl: function () {
                return 'bower_components/wdts-common-ui/src/client/app/blocks/gameHistory/gameHistory.html';
            }
        };

        gameHistoryController.$inject = ['$rootScope', '$scope', '$timeout', '$filter', 'gameService','commonService','$state', 'configurationService'];

        /* @ngInject */
        function gameHistoryController ($rootScope, $scope, $timeout, $filter, gameService,commonService, $state, configurationService) {
            var vm = this;
            vm.gamePlayed = {};
            vm.showGameDetail = false;
            vm.filterDiv = false;
            vm.fetchingData = false;
            vm.gameDataStart = 1;
            vm.gameDataLimit = 10;
            vm.totalCount = 0;
            vm.gameData = [];
            vm.filterArray = [];
/*            vm.gameFilterObj = {
                dealerNames: [],
                supervisorNames: [],
                limits: []
            };*/

            $scope.sortObj = {
                sortField: 'gameId',
                sortOrder: 'DESC'
            };

            vm.getGameHistory = getGameHistory;
            vm.orderGame = orderGame;
            vm.showFilter = showFilter;
            vm.applyFilter = applyFilter;
            vm.clearFilter = clearFilter;
            vm.showGameDetails = showGameDetails;

            commonService.getNonPPTables().then(function(data){
                var currentTableID = parseInt($state.params.tableId);
                $scope.NPPT = _.contains(data,currentTableID);

            });

            angular.element(document).ready(function () {
                getLuckyChipEnabled();
                getGameHistory();
            });

            function getLuckyChipEnabled() {
                configurationService.isLuckyChipEnable().then(function (data) {
                    if(!data){
                        $scope.isluckyChipEnable = false;
                    }
                });
            }

            function getGameHistory () {
                vm.fetchingData = true;
                switch (vm.type) {
                    case 'BY_GAMING_DAY':
                        return getByGamingDay();
                        break;
                    case 'BY_SESSION_ID':
                        $scope.sortObj.sortField = 'gameId';
                        return getBySessionId();
                        break;
                    case 'BY_SHOE_ID':
                        return getByShoeId();
                        break;
                }
            }

            function getByShoeId(){
                return gameService
                    .getGameDataForShoe(vm.topologyId, vm.shoeIdRef, vm.gameDataStart, vm.gameDataLimit, vm.filterArray, $scope.sortObj)
                    .then(onSuccess);
            }

            function getByGamingDay () {
                return gameService
                    .getGameData(vm.topologyId, $rootScope.calendarDate, vm.gameDataStart, vm.gameDataLimit, vm.filterArray, $scope.sortObj)
                    .then(onSuccess);
            }

            function getBySessionId () {
                return gameService
                    .getPaginatedGameDataForSession(vm.topologyId, $rootScope.calendarDate, vm.sessionId, vm.gameDataStart, vm.gameDataLimit, vm.filterArray, $scope.sortObj, vm.tableIp)
                    .then(onSuccess);
            }

            function onSuccess (data) {
                var arrSupervisiorNames = [],
                    arrDealerNames = [],
                    dealaername = "",
                    gameData = data.data.successObj.results,
                    i, g, name;

                vm.fetchingData = false;

                for (g = 0; g < gameData.length; g++) {
                    name = '';
                    switch(gameData[g].outcome) {
                        case 'VOID': name += 'VOID'; break;
                        case 'BANKER': name += 'B'; break;
                        case 'TIE': name += 'T'; break;
                        case 'PLAYER': name += 'P'; break;
                    }
                    if(gameData[g].isPlayerPair){
                        name += '/PP';
                    }
                    if(gameData[g].isBankerPair){
                        name += '/BP';
                    }
                    gameData[g].outcomeName = name;
                }

                vm.gameData = gameData;
                if(vm.type=='BY_SESSION_ID'){
                    $scope.sessionShoeId = vm.gameData[0].shoeUuidForDisplay;
                }
                vm.gameFilterObj = data.data.successObj.filters;

                //Remove repeating items
                let tmpDealer = angular.copy(vm.gameFilterObj.dealer),
                    tmpSupervisor = angular.copy(vm.gameFilterObj.supervisor);
                vm.gameFilterObj.dealerUsers = _.filter(vm.gameFilterObj.dealerUsers, function(item){
                    let index = tmpDealer.indexOf(item.userId);
                    if(index !== -1){
                        tmpDealer.splice(index, 1);
                        return item;
                    }
                });
                vm.gameFilterObj.supervisorUsers = _.filter(vm.gameFilterObj.supervisorUsers, function(item){
                    let index = tmpSupervisor.indexOf(item.userId);
                    if(index !== -1){
                        tmpSupervisor.splice(index, 1);
                        return item;
                    }
                });

                for (i = 0; i < vm.gameFilterObj.dealerUsers.length; i++) {
                    dealaername = vm.gameFilterObj.dealerUsers[i].userId == -17 ? '(Blanks)': vm.gameFilterObj.dealerUsers[i].lastName + ", " + vm.gameFilterObj.dealerUsers[i].firstName + " (" + vm.gameFilterObj.dealerUsers[i].employeeNumber + ")";
                    arrDealerNames.push(dealaername);
                }
                for (i = 0; i < vm.gameFilterObj.supervisorUsers.length; i++) {
                    dealaername = vm.gameFilterObj.supervisorUsers[i].userId == -17 ?'(Blanks)' : vm.gameFilterObj.supervisorUsers[i].lastName + ", " + vm.gameFilterObj.supervisorUsers[i].firstName + " (" + vm.gameFilterObj.supervisorUsers[i].employeeNumber + ")";
                    arrSupervisiorNames.push(dealaername);
                }
                vm.gameFilterObj.dealerNames = arrDealerNames;
                vm.gameFilterObj.supervisorNames = arrSupervisiorNames;

                vm.totalCount = parseInt(data.headers()['totalrecords']);
                for (i = 0; i < vm.gameData.length; i++) {

                    if (vm.gameData[i].supervisorLastName && vm.gameData[i].supervisorFirstName) {
                        vm.gameData[i].supervisorName = vm.gameData[i].supervisorLastName + ", " + vm.gameData[i].supervisorFirstName;
                    }
                    if (vm.gameData[i].supervisorEmployeeNumber) {
                        vm.gameData[i].supervisorName += " (" + vm.gameData[i].supervisorEmployeeNumber + ")";
                    }
                    if (!vm.gameData[i].supervisorName) {
                        vm.gameData[i].supervisorName = '-';
                    }

                    if (vm.gameData[i].dealerLastName && vm.gameData[i].dealerFirstName) {
                        vm.gameData[i].dealerName = vm.gameData[i].dealerLastName + ", " + vm.gameData[i].dealerFirstName;
                    }
                    if (vm.gameData[i].dealerEmployeeNumber) {
                        vm.gameData[i].dealerName += " (" + vm.gameData[i].dealerEmployeeNumber + ")";
                    }
                    if (!vm.gameData[i].dealerName) {
                        vm.gameData[i].dealerName = '-';
                    }
                }

                return data;
            }

            $scope.$on('EMIT_START_LIMIT', function (event, startLimitData) {
                if (startLimitData.viewName == 'gameData') {
                    vm.gameDataStart = startLimitData.startLength;
                    vm.gameDataLimit = startLimitData.pageLimit;
                    getGameHistory();
                }
            });

            $scope.$on('SELECTED_FILTER_OBJECT', function (event, filterObj, columnName, viewName) {
                var i, keys;
                if (viewName == 'gameData') {
                    $scope.isGameUpdated = true;
                    if (filterObj[columnName].toUpperCase() == 'ALL') {
                        for (i = 0; i < vm.filterArray.length; i++) {
                            keys = Object.keys(vm.filterArray[i]);
                            if (columnName == keys) {
                                vm.filterArray.splice(i, 1);
                            }

                        }
                    } else {
                        for (i = 0; i < vm.filterArray.length; i++) {
                            keys = Object.keys(vm.filterArray[i]);
                            if (columnName == keys) {
                                vm.filterArray.splice(i, 1);
                            }
                        }
                        if (columnName == "supervisor") {
                            getUserIds(filterObj, vm.filterArray, vm.gameFilterObj.supervisorUsers, filterObj.supervisor, columnName)
                        }
                        else if (columnName == "dealer") {
                            getUserIds(filterObj, vm.filterArray, vm.gameFilterObj.dealerUsers, filterObj.dealer, columnName)
                        } else {
                            vm.filterArray.push(filterObj);
                        }

                    }
                }

                function getUserIds(filterObj, filterArr, gameFilterObj, propNames) {
                    var arr = propNames.split(",");
                    var arrEmp = [];
                    var i, j, keys;
                    for (i = 0; i < arr.length; i++) {
                        var index1 = arr[i].indexOf("(") + 1;
                        var empNo = arr[i].substring(index1, arr[i].length - 1);
                        arrEmp.push(empNo);
                    }

                    var strUserId = "";
                    for (i = 0; i < gameFilterObj.length; i++) {
                        for (j = 0; j < arrEmp.length; j++) {
                            if (arrEmp[j]) {
                                if (gameFilterObj[i].employeeNumber == arrEmp[j]) {
                                    strUserId += gameFilterObj[i].userId + ","
                                }
                            }
                        }
                    }
                    if (columnName == "supervisor") {
                        for (i = 0; i < filterArr.length; i++) {
                            keys = Object.keys(filterArr[i]);
                            if ("supervisorUsers" == keys) {
                                filterArr.splice(i, 1);
                            }
                        }
                        var suprName = propNames == '(Blanks)' ? { "supervisor": '-17' } : { "supervisor": strUserId.substr(0, strUserId.length - 1) };
                        filterArr.push(suprName);
                    }
                    if (columnName == "dealer") {
                        for (i = 0; i < filterArr.length; i++) {
                            keys = Object.keys(filterArr[i]);
                            if ("dealerUsers" == keys) {
                                filterArr.splice(i, 1);
                            }
                        }
                        var dealerName = propNames == '(Blanks)' ? {"dealer": '-17'}:{"dealer": strUserId.substr(0, strUserId.length - 1)};
                        filterArr.push(dealerName);
                    }
                }
            });

            function orderGame (predicate) {
                vm.predicate = predicate;
                vm.reverse = (vm.predicate === predicate) ? !vm.reverse : false;
                vm.gameData = orderBy(vm.gameData, predicate, vm.reverse);
            }

            function showFilter () {
                vm.filterDiv = !vm.filterDiv;
            }

            function applyFilter () {
                vm.totalCount = 0;
                vm.gameDataStart = 1;
                getGameHistory();
            }

            function clearFilter () {
                $scope.$broadcast('CLEAR_FILTERS', ['supervisor', 'dealer', 'limits']);
                vm.filterArray = [];
                $scope.isGameUpdated = false;
                vm.applyFilter();
            }

            $scope.$on('EMIT_SORT_CHANGE', function (event, sortObj) {
                if (sortObj.viewName == 'gameData') {
                    $scope.sortObj.sortField = sortObj.sortField;
                    $scope.sortObj.sortOrder = sortObj.sortOrder;
                    getGameHistory();
                }
            });

            function showGameDetails (game) {
                vm.gamePlayed = game;
                vm.tableId = game.tableId || vm.topologyId;
                vm.calendarDate = $rootScope.calendarDate;
                vm.showGameDetail = false;
                $rootScope.tableObj = $rootScope.tableObj ? angular.extend($rootScope.tableObj, {topologyId: vm.tableId}) : {topologyId: vm.tableId};
                gameService.getAllSwipedPositions(vm.tableIp).then((res) => {
                    vm.showGameDetail = true;
                    vm.swipedPos = res.data.successObj;
                    $timeout(() => {
                        $('#game-detail-modal').modal('show');
                    });
                });
            }

        }
    }
})();
