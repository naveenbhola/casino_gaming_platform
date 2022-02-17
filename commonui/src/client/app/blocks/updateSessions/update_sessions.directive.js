(function () {
    var app = angular.module('wdts.updateSessions', ['xeditable']);
    app.directive('updateSessionsModal', UpdateSessionsModal);

    function UpdateSessionsModal(editableOptions, editableThemes) {
        return {
            templateUrl: 'bower_components/wdts-common-ui/src/client/app/blocks/updateSessions/update_sessions.html',
            restrict: 'E',
            replace: true,
            scope: true,
            link: function postLink(scope, element, attrs) {
                editableOptions.theme = 'bs3';
                editableThemes['bs3'].submitTpl = '<button type="submit" translate="application.app.common.labels.SAVE"></button>';
                editableThemes['bs3'].cancelTpl = '<button type="button" ng-click="$form.$cancel()" translate="application.app.common.labels.CANCEL"></button>';

                scope.$watch(attrs.visible, function (value) {
                    if (value == true)
                        $(element).modal('show');
                    else
                        $(element).modal('hide');
                });

                $(element).on('shown.bs.modal', function () {
                    scope.sessionIds = [];
                    scope.confirmShows = false;
                    scope.confirmed = false;
                    scope.$broadcast('modal-open', true);
                    scope.$apply(function () {
                        scope.$parent[attrs.visible] = true;
                    });
                });

                $(element).on('hidden.bs.modal', function () {
                    scope.$broadcast('modal-open', false);
                    scope.$apply(function () {
                        scope.$parent[attrs.visible] = false;
                    });
                });
            },

            controller: ["$scope", "$filter", "$q", "$state", "$rootScope", "logger", "$translate", "jwtHelper", "store", "jwtTokenKey", function ($scope, $filter, $q, $state, $rootScope, logger, $translate, jwtHelper, store, jwtTokenKey) {
                var vm = this;

                init();
                function init(){
                    vm.updatePlayerData = {};
                    $scope.checkedSessionIds = [];
                    $scope.tableIp = [];
                    $scope.ircNumbers = [];
                    $scope.playerSession = {};
                    $scope.tableSessionMap = null;
                    $scope.tableIds = [];
                    $scope.checkAll = false;
                    $scope.playerList = [];
                    $scope.showupdateBtn = false;
                    $scope.searchPlayerSelected = false;
                    $scope.sessionChecked = false;
                    $scope.confirmShows = false;
                    $scope.hideSearchbar = false;
                    $scope.playerSelected = null;
                    $scope.selectedPlayerNewName = null;
                    $scope.includeBackBets = false;
                    var decodedJwt = jwtHelper.decodeToken(store.get(jwtTokenKey));
                    var permissions = decodedJwt.authorities[0].permissions;
                    if (_.contains(permissions, "RATE_CLOSED_KNOWN_SESSION_TABLE") || _.contains(permissions, "RATE_CLOSED_KNOWN_SESSION") || decodedJwt.superuser){
                        $scope.hasRatePermission = true;
                    }

                }

                vm.updateIrc = function(field, item){
                    let IRC_LABEL_MAX_LENGTH = 30;
                    if(field <= 0){
                        if (field === null) {
                            item.irc = 'null';
                            item.ircLabel = $translate.instant('application.app.common.labels.EDIT');
                            vm.sessionSelected(item, true);
                        } else {
                            logger.warn($translate.instant('application.app.TABLE_DASH_LABELS.SESSIONS.MESSAGE.IRC_LABEL_NOT_ZERO'));
                        }
                    }else {

                        if (field > Math.pow(9, IRC_LABEL_MAX_LENGTH)) {
                            logger.warn($translate.instant('application.app.TABLE_DASH_LABELS.SESSIONS.MESSAGE.IRC_LABEL_CANNOT_EXCEED'));
                        } else {
                            item.irc = field;
                            item.ircLabel = field;
                            vm.sessionSelected(item, true);
                        }
                    }
                };

                vm.orderBy = function (predicate) {
                    $scope.reverse = $scope.predicate === predicate ? !$scope.reverse : false;
                    $scope.predicate = predicate;
                    $scope.sessionsForFilter = $filter('orderBy')($scope.sessionsForFilter, predicate, $scope.reverse);
                };

                vm.sessionSelected = function (sessionObj, isUpdate) {

                    if ($scope.checkAll) {
                        if (!$scope.sessionIds[sessionObj.sessionId]) {
                            if (_.contains($scope.checkedSessionIds, sessionObj.sessionId)) {
                                $scope.checkedSessionIds = _.without($scope.checkedSessionIds, sessionObj.sessionId);
                                $scope.ircNumbers = _.without($scope.ircNumbers, sessionObj.irc);
                                $scope.tableIp = _.without($scope.tableIp,sessionObj.tableIp);
                            }
                        } else {
                            if (!(_.contains($scope.checkedSessionIds, sessionObj.sessionId)) && !isUpdate) {
                                $scope.checkedSessionIds.push(sessionObj.sessionId);
                                $scope.ircNumbers.push(sessionObj.irc);
                                $scope.tableIp.push(sessionObj.tableIp);
                            }else{
                                $scope.ircNumbers[$scope.checkedSessionIds.indexOf(sessionObj.sessionId)] = sessionObj.irc;
                            }
                        }

                    } else {
                        $scope.playerSession = sessionObj;
                        if ($scope.sessionIds[sessionObj.sessionId] && !isUpdate) {
                            $scope.checkedSessionIds.push(sessionObj.sessionId);
                            $scope.ircNumbers.push(sessionObj.irc);
                            $scope.tableIp.push(sessionObj.tableIp);
                        } else if(isUpdate){
                            $scope.ircNumbers[$scope.checkedSessionIds.indexOf(sessionObj.sessionId)] = sessionObj.irc;
                        }
                        else {
                            $scope.checkedSessionIds = _.without($scope.checkedSessionIds, sessionObj.sessionId);
                            $scope.ircNumbers = _.without($scope.ircNumbers, sessionObj.irc);
                            $scope.tableIp = _.without($scope.tableIp,sessionObj.tableIp);
                        }
                    }
                    $scope.sessionChecked = $scope.checkedSessionIds.length > 0;
                    $scope.showupdateBtn = $scope.searchPlayerSelected && $scope.sessionChecked;
                    $scope.currentSessionObj = sessionObj;
                    playerToUpdate();

                };


                vm.checkAll = function (checkAll) {
                    $scope.checkedSessionIds = [];
                    $scope.tableSessionMap = new Map();
                    $scope.tableIp = [];
                    $scope.ircNumbers = [];

                    for (var i = 0; i < $scope.sessionsForFilter.length; i++) {
                        if ($scope.sessionsForFilter[i].status != 'IN_PROGRESS' && !$scope.sessionsForFilter[i].clockInEventId) {
                            $scope.sessionIds[$scope.sessionsForFilter[i].playerId] = !!checkAll;
                        }
                    }
                    $scope.showupdateBtn = checkAll ? true : false;
                    if (checkAll) {
                        for (var i = 0; i < $scope.sessionsForFilter.length; i++) {
                            if ($scope.sessionsForFilter[i].status != 'IN_PROGRESS' && !$scope.sessionsForFilter[i].clockInEventId) {
                                if(($scope.sessionsForFilter[i].isKnownPlayer == false && $scope.updateClosedAnonSessionPermission) || ($scope.sessionsForFilter[i].isKnownPlayer == true && $scope.updateClosedKnownSessionPermission)) {
                                    $scope.checkedSessionIds.push($scope.sessionsForFilter[i].sessionId);
                                    $scope.ircNumbers.push($scope.sessionsForFilter[i].ircNumber);
                                    $scope.tableIp.push($scope.sessionsForFilter[i].tableIp);

                                    if ($scope.tableSessionMap.get($scope.sessionsForFilter[i].tableId) != null) {
                                        var sessionIdsForTable = [];
                                        sessionIdsForTable = $scope.tableSessionMap.get($scope.sessionsForFilter[i].tableId);
                                        sessionIdsForTable.push($scope.sessionsForFilter[i].sessionId);
                                    } else {
                                        var sessionIdsForTable = [];
                                        sessionIdsForTable.push($scope.sessionsForFilter[i].sessionId);
                                        $scope.tableSessionMap.set($scope.sessionsForFilter[i].tableId, sessionIdsForTable);
                                    }

                                    $scope.tableIds.push($scope.sessionsForFilter[i].tableId);
                                    vm.updatePlayerData.sessionM = $scope.tableSessionMap;
                                }
                            }
                        }
                    } else {
                        for (var i = 0; i < $scope.sessionsForFilter.length; i++) {
                            if ($scope.sessionsForFilter[i].status != 'IN_PROGRESS' && !$scope.sessionsForFilter[i].clockInEventId) {
                                $scope.sessionIds[$scope.sessionsForFilter[i].sessionId] = false;
                            }
                        }
                        $rootScope.$broadcast('hidepopup', true);
                    }
                };

                vm.updateSingle = function (sessionId) {
                    $scope.sessionIds[sessionId] = true;
                };


                vm.selectedPlayer = function (player) {
                    if (!player.banned) {
                        $scope.selectedPlayerNewName = player.playerName;
                        $scope.playerSelected = player.casinoPlayerId;
                        $scope.playerBanned = player.banned;
                        // $scope.searchPlayerSelected = player._selected;
                        $scope.showupdateBtn = $scope.checkAll || $scope.sessionChecked ? true : false;
                        if ($scope.showupdateBtn) {
                            vm.updateSession();
                        }
                    } else {
                        logger.warn($translate.instant('application.app.CAM_CASHIER_LABELS.COMMON_LOGGERMESSAGES.BANNEDPLAYER'));
                    }
                };

                vm.playerlistPopulated = function (playerlist) {
                    $scope.showupdateBtn = false;

                };
                vm.updateSession = function () {

                    if (!$scope.playerBanned) {
                        $scope.positionIds = [];
                        $scope.positionLabels = [];
                        vm.updatePlayerData.positionLabel = null;
                        vm.updatePlayerData.positionId = null;
                        vm.updatePlayerData.topologyId = $state.params.tableId ? $state.params.tableId : $scope.currentSessionObj ? $scope.currentSessionObj.tableId : null? $scope.playerSession.tableId:null;
                        vm.updatePlayerData.gamingDay = $state.params.date ? $state.params.date : $state.params.gamingDay;
                        vm.updatePlayerData.identifier = 2;

                        if($scope.tableSessionMap){
                            if($scope.tableSessionMap.size >=1){
                                vm.updatePlayerData.sessionM = $scope.tableSessionMap;
                            }

                            else{
                                vm.updatePlayerData.sessionM = null;
                            }
                        }
                        else{
                            vm.updatePlayerData.sessionM = null;
                        }

                        if((vm.updatePlayerData.topologyId || $scope.tableIds.length > 0) && vm.updatePlayerData.gamingDay){
                            playerToUpdate();
                            $scope.confirmShows = true;
                        }else {
                            $scope.showupdateBtn = false;
                        }
                    } else {
                        logger.warn("The searched player: " + $scope.playerSelected + " is banned");
                    }


                };
                function playerToUpdate() {

                    if (!$scope.playerBanned) {
                        var playersToBeUpdated = [];

                        vm.updatePlayerData.updatedPlayerId = $scope.playerSelected;
                        vm.updatePlayerData.sessionIds = $scope.checkedSessionIds.toString();
                        vm.updatePlayerData.ircNumbers = $scope.ircNumbers.toString();
                        vm.updatePlayerData.tableIp = $scope.tableIp.toString();

                        for (var i = 0; i < $scope.checkedSessionIds.length; i++) {
                            for (var j = 0; j < $scope.sessionsForFilter.length; j++) {
                                if ($scope.checkedSessionIds[i] === $scope.sessionsForFilter[j].sessionId) {
                                    if (playersToBeUpdated.indexOf($scope.sessionsForFilter[j].player.playerId) == -1) {
                                        playersToBeUpdated.push($scope.sessionsForFilter[j].player.playerId);
                                    }
                                }
                            }
                        }


                        vm.playerDataOnConfirm = {
                            oldPlayers: playersToBeUpdated.join(", "),
                            playerToBeUpdated: $scope.playerSelected,
                            newPlayerName: $scope.selectedPlayerNewName
                        };


                    } else {
                        logger.warn("The searched player: " + $scope.playerSelected + " is banned");
                    }
                }

                vm.rateKnownPlayer = function (sessionObj) {

                    $scope.checkAll = false;
                    $scope.sessionIds[sessionObj.sessionId] = true;
                    vm.sessionSelected(sessionObj);
                    $scope.checkedSessionIds = [];
                    if ($scope.sessionIds[sessionObj.sessionId]) {

                        $scope.playerSelected = sessionObj.player.casinoPlayer.casinoPlayerId;
                        $scope.playertoBeUpdated = $scope.playerSelected;
                        $scope.checkedSessionIds.push(sessionObj.sessionId);
                        vm.updateSession();
                        $scope.hideSearchbar = true;
                    }
                };

                vm.confirmUpdate = function () {
                    vm.closeUpdateSessionModal();
                };


                vm.closeUpdateSessionModal = function () {
                    init();
                    $('#modal-update-closed-sessions').modal('hide');
                    $rootScope.$broadcast('reload-select-user-screen', true);
                    $rootScope.$broadcast('reload-sessions-screen', true);
                };

                $scope.$on('CLOSE_MODAL', () => {
                    vm.closeUpdateSessionModal();
                });
            }],
            controllerAs: 'vm'
        }
    }
})();
