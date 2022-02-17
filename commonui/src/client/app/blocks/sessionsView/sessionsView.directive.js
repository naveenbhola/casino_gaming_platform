(function () {
    var app = angular.module('wdts.sessionsView', []);
    app.directive('sessionsView', SessionsView);

    function SessionsView() {
        var directive = {
            templateUrl: 'bower_components/wdts-common-ui/src/client/app/blocks/sessionsView/sessionsView.html',
            restrict: 'E',
            bindToController: true,
            scope: {
                updateClosedSessions: '=',
                filters: '=',
                columns: '=',
                tableId: '=',
                shoeId: '=',
                shoeIdForDisplay: '=',
                playerId: '=',
                topologyMap: '=',
                type: '@' //Possible values: TABLE_DASHBOARD_SESSIONS, TABLE_DASHBOARD_SHOE_SESSIONS, PLAYER_DASHBOARD_SESSIONS
            },
            controller: SessionsViewController,
            controllerAs: 'vm'
        };

        SessionsViewController.$inject = [
            '$rootScope', '$scope', '$filter', '$q', 'jwtHelper', 'commonService', 'tableDashboardService',
            'store', 'logger', 'jwtTokenKey', 'gameService', '$state', 'ratingService', '$translate', 'configurationService' ,'$timeout'
        ];

        function SessionsViewController(
            $rootScope, $scope, $filter, $q, jwtHelper, commonService, tableDashboardService,
            store, logger, jwtTokenKey, gameService, $state, ratingService, $translate, configurationService,$timeout
        ) {
            var vm = this;

            $scope.tableIds = [vm.tableId];
            $scope.sessionDataStart = 1;
            $scope.sessionDataLimit = 10;
            $scope.sessionFilterArray = [];
            $scope.totalCount = 0;
            $scope.fetchingData = false;
            $scope.showModal = false;
            $scope.calendarDate = $rootScope.calendarDate;
            $scope.sessionsForFilter =[];
            vm.sortObj = {
                sortField: 'SESSIONID',
                sortOrder: 'DESC'
            };

            $scope.isCBPTEnabled = true;

            // MNF-32 start
            function gameServiceCall(ircReqData){
                gameService.updateIrcNumber(ircReqData).then(function (res) {
                    if (res.status === 200) {
                        logger.success($translate.instant('application.app.TABLE_DASH_LABELS.SESSIONS.MESSAGE.IRC_MESSAGE_UPDATE_SUCCESS'));
                    } else {
                        logger.warn($translate.instant('application.app.TABLE_DASH_LABELS.SESSIONS.MESSAGE.IRC_MESSAGE_UPDATE_FAILED'));
                    }
                });
            }
            $scope.updateIrc = function (data, sessionObj) {

                var ircReqData = {
                    "sessionId": sessionObj.sessionId,
                    "ircNumber": data,
                    "tableIp" : sessionObj.tableIp
                };
                var regexNumber = '^[0-9]+$';

                if((data && !data.match(regexNumber)) || parseInt(data) <= 0){
                    return $translate.instant('application.app.TABLE_DASH_LABELS.SESSIONS.MESSAGE.IRC_VALUE_NUMBER_ONLY');
                }else{
                    gameServiceCall(ircReqData);
                }
            };
            //MNF-32 end

            activate();
            bindEvents();

            function bindEvents(){
                //Update session data once updateUser is successful
                var playerUpdateClick = $rootScope.$on('playerUpdateclick', function (event) {
                    isCBPTEnabled();
                });

                $rootScope.$on("$destroy", playerUpdateClick);
            }

            function activate() {
                $scope.updateRateClosedSessionPermission = getUpdateRateClosedSessionPermission();
                $rootScope.currentTabIsShoe = !!vm.shoeId;

                var promises = [getLuckyChipEnabled(), isCBPTEnabled()];

                return $q.all(promises).then(function () {});
            }

            function getLuckyChipEnabled() {
                configurationService.isLuckyChipEnable().then(function (data) {
                    if(!data){
                        $scope.isluckyChipEnable = false;
                    }
                });
            }

            function isCBPTEnabled(){
                return configurationService.isCBPTEnabled().then( data => {
                    $scope.isCBPTEnabled = data;
                    getSessionsData();
                });
            }

            function getUpdateRateClosedSessionPermission() {
                var decodedJwt = jwtHelper.decodeToken(store.get(jwtTokenKey));
                var permissions = decodedJwt.authorities[0].permissions;

                $scope.updateClosedKnownSessionPermission = false;

                if (vm.type == "TABLE_DASHBOARD_SHOE_SESSIONS") {
                    if(_.contains(permissions, "UPDATE_IRC_NUMBER") || decodedJwt.superuser){
                        $scope.updateIrcNumberSessionPermission = true;
                    }
                }

                if (vm.type == "TABLE_DASHBOARD_SESSIONS") {
                    if(_.contains(permissions, "UPDATE_CLOSED_ANONYMOUS_SESSION_TABLE") || decodedJwt.superuser){
                        $scope.updateClosedAnonSessionPermission = true;
                    }
                    if(_.contains(permissions, "UPDATE_CLOSED_KNOWN_SESSION_TABLE") || decodedJwt.superuser){
                        $scope.updateClosedKnownSessionPermission = true;
                    }
                    if(_.contains(permissions, "RATE_CLOSED_KNOWN_SESSION_TABLE") || decodedJwt.superuser){
                        $scope.rateClosedKnownSessionPermission = true;
                    }
                    if(_.contains(permissions, "UPDATE_IRC_NUMBER") || decodedJwt.superuser){
                        $scope.updateIrcNumberSessionPermission = true;
                    }
                    return _.contains(permissions, "RATE_CLOSED_KNOWN_SESSION_TABLE") || _.contains(permissions, "UPDATE_CLOSED_ANONYMOUS_SESSION_TABLE") || _.contains(permissions, "UPDATE_CLOSED_KNOWN_SESSION_TABLE") || decodedJwt.superuser;
                } else if (vm.type == "PLAYER_DASHBOARD_SESSIONS") {
                    if(_.contains(permissions, "UPDATE_IRC_NUMBER") || decodedJwt.superuser){
                        $scope.updateIrcNumberOnPlayerDashboardSessionPermission = true;
                    }
                    if(_.contains(permissions, "UPDATE_CLOSED_ANONYMOUS_SESSION") || decodedJwt.superuser){
                        $scope.updateClosedAnonSessionPermission = true;
                    }
                    if(_.contains(permissions, "UPDATE_CLOSED_KNOWN_SESSION") || decodedJwt.superuser){
                        $scope.updateClosedKnownSessionPermission = true;
                    }
                    if(_.contains(permissions, "RATE_CLOSED_KNOWN_SESSION") || decodedJwt.superuser){
                        $scope.rateClosedKnownSessionPermission = true;
                    }
                    return _.contains(permissions, "RATE_CLOSED_KNOWN_SESSION") || _.contains(permissions, "UPDATE_CLOSED_KNOWN_SESSION") || _.contains(permissions, "UPDATE_CLOSED_ANONYMOUS_SESSION") || decodedJwt.superuser;
                } else {
                    return false;
                }
            }

            function getSessionsData() {
                $scope.fetchingData = true;
                callSessionsService().then(function (data) {
                    $scope.fetchingData = false;
                    $scope.sessionData = [];
                    $scope.sessionObj1 = data.data.successObj.results;
                    $scope.sessionFilterObj = data.data.successObj.filters;

                    if(vm.type == "PLAYER_DASHBOARD_SESSIONS") {
                        var fTableIds = data.data.successObj.filters.tableId;
                        $scope.sessionFilterObj.fTableIds = [];

                        for (var tId = 0; tId < fTableIds.length; tId++) {
                            var itemId = fTableIds[tId];
                            $scope.sessionFilterObj.fTableIds.push({
                                name: vm.topologyMap.get(itemId),
                                filterValue: itemId
                            });
                        }
                    }
                    $scope.totalCount = parseInt(data.headers()['totalrecords']);

                    if ($scope.sessionObj1 != null) {

                        $rootScope.sessionCount = $scope.sessionObj1.length;
                        for (var i = 0; i < $scope.sessionObj1.length; i++) {
                            var k = $scope.sessionObj1[i];
                            var difference = $scope.sessionObj1[i].durationInMillis;

                            if (difference > 60000) {
                                var totalMinutes = Math.round(difference / 60000, 2);
                                var actualHours = Math.floor(totalMinutes / 60);
                                var actualMiinutes = totalMinutes % 60;
                                k.timePlayed = actualHours + "h " + actualMiinutes + "m";
                            }
                            else {
                                k.timePlayed = Math.round(difference / 60000, 2) + 's';
                            }

                            if (vm.topologyMap) {
                                k.tName = vm.topologyMap.get(k.tableId);
                            }

                            $scope.sessionData.push(k);
                            $scope.sessionData[i].casinoPlayerId = $scope.sessionData[i].player.casinoPlayer.casinoPlayerId;
                            if ($scope.sessionData[i].clockInEventDtm) {
                                $scope.sessionData[i].ratedFlag = "yes";
                            }
                            else {
                                $scope.sessionData[i].ratedFlag = "no";
                            }

                            if($scope.isCBPTEnabled) {
                                $scope.sessionData[i].sessionType = $scope.sessionData[i].isKnownPlayer ? "Known" : "Unknown";
                            } else {
                                $scope.sessionData[i].sessionType = $scope.sessionData[i].isKnownPlayer ? "Rated" : "Seated";
                            }

                            if ($scope.sessionData[i].isKnownPlayer) {
                                $scope.sessionData[i].plrName = $scope.sessionData[i].player.casinoPlayer.lastName +
                                    ", " + $scope.sessionData[i].player.casinoPlayer.firstName;
                            }
                            else {
                                $scope.sessionData[i].plrName = "Anonymous";
                            }
                            $scope.sessionData[i].ccasId = $scope.sessionData[i].player.playerId.toString();

                        }
                    }

                    $rootScope.sessionData = $scope.sessionData;
                    $scope.showFiltersFlag4 = true;
                });
            }

            function callSessionsService(update) {
                switch (vm.type) {
                    case 'TABLE_DASHBOARD_SESSIONS':
                        return gameService.getSessionData(
                            $scope.tableIds, $rootScope.calendarDate, update ? 1 : $scope.sessionDataStart,
                            update ? $scope.totalCount : $scope.sessionDataLimit, $scope.sessionFilterArray, vm.sortObj
                        );
                    case 'TABLE_DASHBOARD_SHOE_SESSIONS':
                        return gameService.getShoeSessionData(
                            $scope.tableIds, vm.shoeId, $scope.sessionDataStart,
                            $scope.sessionDataLimit, $scope.sessionFilterArray, vm.sortObj
                        );
                    case 'PLAYER_DASHBOARD_SESSIONS':
                        return ratingService.getPlayerSessionsData(
                            $rootScope.gamingDay, vm.playerId, [], update ? 1 : $scope.sessionDataStart,
                            update ? $scope.totalCount : $scope.sessionDataLimit, $scope.sessionFilterArray, vm.sortObj
                        );
                }
            }
            vm.showSessionFilter = function () {
                $scope.sessionfilterdiv = !$scope.sessionfilterdiv;
            };


            vm.gotoSelectedSession = function (sessionObj) {
                if(sessionObj.isManualRated){
                    logger.info($translate.instant('GAME_DATA_NOT_AVAIL_MANUAL_RATING'));
                    return;
                }
                var sessionId = sessionObj.sessionId;
                switch (vm.type) {
                    case "TABLE_DASHBOARD_SESSIONS":
                        $state.go("tabledashboard.game.sessions.games", {
                            tableId: vm.tableId,
                            sessionId: sessionId,
                            date: $scope.calendarDate
                        });
                        break;
                    case "TABLE_DASHBOARD_SHOE_SESSIONS":
                        $state.go("tabledashboard.game.shoe.sessions.games", {
                            sessionId: sessionId
                        });
                        break;
                    case "PLAYER_DASHBOARD_SESSIONS":
                        $state.go('player.game', {
                            sessionId: sessionId,
                            gamingDay: $rootScope.gamingDay,
                            playerId: vm.playerId,
                            tableIp: sessionObj.tableIp
                        });
                }
            };

            vm.updateClosedSessionsModal = function () {
                callSessionsService(true).then(function (data) {
                    $scope.showModal = false;
                    $scope.sessionsForFilter = data.data.successObj.results;
                    for (var j = 0; j < $scope.sessionsForFilter.length; j++) {
                        if($scope.sessionsForFilter[j].ratingStatus == 'PROVISIONAL_REJECT'){
                            $scope.sessionsForFilter.splice(j,1)
                        }
                    }
                    var len = $scope.sessionsForFilter.length;

                    while (len--) {
                        if ($scope.sessionsForFilter[len].status != 'IN_PROGRESS' && !$scope.sessionsForFilter[len].clockInEventId && $scope.sessionsForFilter[len].isKnownPlayer == false && !$scope.updateClosedAnonSessionPermission){
                            $scope.sessionsForFilter.splice(len,1);
                        }
                    }

                    var len = $scope.sessionsForFilter.length;

                    if(len >0){
                        while (len--) {
                            if ($scope.sessionsForFilter[len].status != 'IN_PROGRESS' && !$scope.sessionsForFilter[len].clockInEventId && $scope.sessionsForFilter[len].isKnownPlayer == true && !$scope.updateClosedKnownSessionPermission && !$scope.rateClosedKnownSessionPermission){
                                $scope.sessionsForFilter.splice(len,1);
                            }
                        }
                    }

                    $scope.sessionsForFilter.map((item)=>{
                        item.irc = 'null';
                        item.ircLabel = $translate.instant('application.app.common.labels.EDIT');
                    });

                    for (var i = 0; i < $scope.sessionsForFilter.length; i++) {

                        if ($scope.sessionsForFilter[i].status != 'IN_PROGRESS' && !$scope.sessionsForFilter[i].clockInEventId) {
                            $scope.showModal = true;
                            break;
                        }
                    }
                    if ($scope.showModal) {
                        $timeout(function () {
                            $("#change-focus-to-modal").focus();
                        }, 500);
                        $scope.showUpdateSessionsModal = !$scope.showUpdateSessionsModal;
                        $scope.$broadcast('updateSearchKey',{});
                    }
                    else {
                        logger.info($translate.instant('application.app.TABLE_DASH_LABELS.SESSIONS.NO_ELIGIBLE_SESSION'));
                    }
                });
            };

            //*Recieve Broadcast Message from common/filter service and update the object bind to the UI
            $scope.$on('FILTER_DATA_UPDATED', function (event, data, columnName) {
                if (commonService.getfilteredObjName() == "sessionData" || commonService.getfilteredObjName() == "shoeSessionData") {
                    $scope.sessionData = commonService.getTableData();
                }
            });
            //Recieve Broadcast Message from common/filter service and update the object bind to the UI*//

            //*Recieve Broadcast Message from pagination directive and update the object bind to the UI
            $scope.$on('EMIT_START_LIMIT', function (event, startLimitData) {
                if (startLimitData.viewName == 'sessionData' || startLimitData.viewName == 'shoeSessionData') {
                    $scope.sessionDataStart = startLimitData.startLength;
                    $scope.sessionDataLimit = startLimitData.pageLimit;
                    getSessionsData();
                }
            });

            //Recieve Broadcast Message from pagination directive and update the object bind to the UI*//

            $scope.$on('SELECTED_FILTER_OBJECT', function (event, filterObj, columnName, viewName) {
                if (viewName == 'sessionData' || viewName == 'shoeSessionData') {
                    updateFilterArray('sessionFilterArray', filterObj, columnName, viewName);
                }

                function updateFilterArray(arrayKey, filterObj, columnName, viewName) {
                    var keys;
                    if (filterObj[columnName].toUpperCase() === 'ALL') {
                        for (var i = 0; i < $scope[arrayKey].length; i++) {
                            keys = Object.keys($scope[arrayKey][i]);
                            if (columnName == keys) {
                                $scope[arrayKey].splice(i, 1);
                            }
                        }
                    } else {
                        for (var j = 0; j < $scope[arrayKey].length; j++) {
                            keys = Object.keys($scope[arrayKey][j]);
                            if (columnName == keys) {
                                $scope[arrayKey].splice(j, 1);
                            }
                        }
                        $scope[arrayKey].push(filterObj);
                    }
                }
            });

            //Recieve Broadcast Message from sorting directive and update the object bind to the UI*//

            $scope.$on('EMIT_SORT_CHANGE', function (event, sortObj) {
                if (sortObj.viewName == 'sessionData') {
                    vm.sortObj.sortField = sortObj.sortField;
                    vm.sortObj.sortOrder = sortObj.sortOrder;
                    getSessionsData();
                }
            });


            $scope.applySessionFilter = function () {
                $scope.totalCount = 0;
                $scope.sessionDataStart = 1;
                getSessionsData();
            };

            $scope.clearSessionFilter = function () {
                $scope.$broadcast('CLEAR_FILTERS', vm.filters);
                $scope.sessionFilterArray = [];
                $scope.isSessionChange = false;
                $scope.applySessionFilter();
            };

            vm.showSessionComments = function (session) {
                vm.addComment = '';
                $scope.selectedComments = session.notes;
                $scope.sessionNote = session;

                if (session.player.anonymous == false) {
                    $scope.playerName = session.player.casinoPlayer.lastName + ', ' +
                        session.player.casinoPlayer.firstName + ' (#' + session.player.casinoPlayer.casinoPlayerId + ')';
                } else {
                    $scope.playerName = ' Anonymous (#' + session.player.playerId+')';
                }
                $('#commentModal').modal('show');
            };

            vm.updateSessionComment = function () {
                if (vm.type == "PLAYER_DASHBOARD_SESSIONS"){
                    return;
                }
                var d = new Date();
                var x = d.toISOString().split('.000Z');
                var newNote = vm.addComment.replace(/\r?\n/g, '<br />');

                var obj = {
                    "note": newNote,
                    "sessionId": $scope.sessionNote.sessionId,
                    "user": {"userId": $rootScope.decodedJwt.userId},
                    "createDtm": x[0] + 'Z'
                };

                gameService.createSessionNote(obj).then(function (data) {
                    gameService.getSessionById($scope.sessionNote.sessionId).then(function (data) {
                        vm.addComment = '';
                        $scope.selectedComments = data.successObj[0].notes;
                        getSessionsData();
                    });
                });

            };
            $scope.getTrimmedString = function (value) {
                return value.trim();
            }
        }

        return directive;
    }
})();
