(function () {
    'use strict';

    var app = angular.module('wdts.gameDetail', []);
    app.directive('gameDetail', gameDetail);

    /* @ngInject */

    function gameDetail() {
        return {
            bindToController: true,
            controller: gameDetailController,
            controllerAs: 'vm',
            restrict: 'EA',
            scope: {
                gamePlayed: '=',
                tableId: '=',
                calendarDate: '=',
                sessionStatus: '=',
                swipedPositions: "="
            },
            templateUrl: function (elem, attr) {
                return 'bower_components/wdts-common-ui/src/client/app/blocks/gameDetail/game_detail.html';
            }
        };

        gameDetailController.$inject = ['$scope', 'jwtTokenKey', '$rootScope', 'tableDashboardService', 'commonService', 'store', 'jwtHelper', 'config', 'logger', 'authService', 'gameService', '$q','$translate', 'configurationService'];

        /* @ngInject */
        function gameDetailController($scope, jwtTokenKey, $rootScope, tableDashboardService, commonService, store, jwtHelper, config, logger, authService, gameService, $q, $translate, configurationService) {
            var vm = this;
            vm.allData = commonService.getAllData();

            vm.showBets = showBets;
            vm.updatePPId = updatePPId;
            vm.ratePlayer = ratePlayer;
            vm.swapItemSelection = swapItemSelection;
            vm.onRateClick = onRateClick;
            vm.updateSession = updateSession;
            vm.cancelUpdateSession = cancelUpdateSession;

            vm.independentBetsPopupIDs = ['independent-bp-players-details', 'independent-pp-players-details', 'independent-tie-players-details', 'independent-l6-players-details'];
            vm.activePopup = null;
            $scope.activePopupLength = 0;
            $scope.start = 0;
            $scope.showLimit = 5;
            $scope.sessionIdForDisplay = null;
            $scope.gameResultString = '';
            $scope.independentPP = [];
            $scope.independentBP = [];
            $scope.independentTie = [];
            $scope.independentL6 = [];
            $scope.playerWLMap = null;
            $scope.updatePlayerData = {};
            $scope.isCBPTEnabled = false;
            $scope.includeBackBets = false;
            var decodedJwt2 = store.get(jwtTokenKey);
            var decodedJwt = jwtHelper.decodeToken(decodedJwt2);
            var permissions2 = decodedJwt.authorities[0].permissions;
            checkForLucky6();
            checkForCBPTStatus(); //Change for CN1-89 : Changes in Player Dashboard when CPBT is turned off

            if (_.contains(permissions2, "UPDATE_OPEN_KNOWN_SESSION") || decodedJwt.superuser){
                $scope.hasUpdateOpenKnownPerm = true;
            }

            if (_.contains(permissions2, "UPDATE_OPEN_ANONYMOUS_SESSION") || decodedJwt.superuser){
                $scope.hasUpdateOpenAnonPerm = true;
            }

            if (_.contains(permissions2, "RATE_OPEN_KNOWN_SESSION") || decodedJwt.superuser){
                $scope.hasRateOpenKnownPerm = true;
            }

            configurationService.isLuckyChipEnable().then(function (data) {
                if(!data){
                    $scope.isluckyChipEnable = false;
                }
            });

            configurationService.checkForGEnabledInsurance().then(function (data) {
                if (data.data) {
                    $scope.isGEnabledInsurance = true;
                }else{
                    $scope.isGEnabledInsurance = false;
                }
            });
            if(jwtTokenKey == 'jwt_tbldash') {
                $scope.isNPPT = $rootScope.tableObj.NPPT;
            }

            $rootScope.$on('rootval', function (event, data) {
                $scope.mydata = data;
                console.log($scope.mydata);
            });
            $('#update-user-modal').on('shown.bs.modal', function () {
                $scope.$broadcast('modal-open', true);
            });
            $('#update-user-modal').on('hidden.bs.modal', function () {
                $scope.$broadcast('modal-open', false);
            });
            $scope.showGameDetails = function () {
                if (vm.gamePlayed) {
                    $scope.playerWLMap = new Map();
                    vm.tablePositions = vm.allData.tablePositionMap.get(parseInt(vm.tableId));
                    $scope.independentBets_PP_Total = 0;
                    $scope.independentBets_BP_Total = 0;
                    $scope.independentBets_Tie_Total = 0;
                    $scope.independentBets_L6_Total = 0;
                    $scope.independentPP = [];
                    $scope.independentBP = [];
                    $scope.independentTie = [];
                    $scope.pArray = [];
                    $scope.gameId = vm.gamePlayed.id;
                    $scope.shoeId = vm.gamePlayed.shoeUuid;
                    $scope.shoeIdForDisplay = vm.gamePlayed.shoeUuidForDisplay;

                    $scope.gameOut = vm.gamePlayed.outcome.split(',');
                    $scope.gameResultString = '';

                    for (var i = 0; i < $scope.gameOut.length; i++) {

                        if ($scope.gameOut[i] == 'BANKER') {
                            $scope.gameResultString += 'B';

                            if (i + 1 != $scope.gameOut.length) {
                                $scope.gameResultString += '/';
                            }
                        }
                        else if ($scope.gameOut[i] == 'PLAYER') {
                            $scope.gameResultString += 'P';
                            if (i + 1 != $scope.gameOut.length) {
                                $scope.gameResultString += '/';
                            }
                        }
                        else if ($scope.gameOut[i] == 'TIE') {
                            $scope.gameResultString += 'T';
                            if (i + 1 != $scope.gameOut.length) {
                                $scope.gameResultString += '/';
                            }
                        }
                        else if ($scope.gameOut[i] == 'VOID') {
                            $scope.gameResultString = 'VOID';
                        }

                        if($scope.gameResultString.indexOf('VOID') == -1) {
                            if (vm.gamePlayed.isPlayerPair == true) {
                                if ($scope.gameOut.length >= 1) {
                                    $scope.gameResultString += '/PP';
                                }
                                else {
                                    $scope.gameResultString += 'PP';
                                }
                            }

                            if (vm.gamePlayed.isBankerPair == true) {
                                if ($scope.gameOut.length >= 1) {
                                    $scope.gameResultString += '/BP';
                                }

                                else {
                                    $scope.gameResultString += 'BP';
                                }
                            }
                        }
                    }

                    $scope.setheight = false;
                    $scope.sessionsIds = [];
                    $scope.main = false;
                    $scope.secondary = true;
                    $scope.front = true;
                    $scope.back = false;
                    $scope.gameResult = vm.gamePlayed.outcome;

                    $scope.playerCards = [];
                    $scope.playerCard = [];
                    $scope.bankerCards = [];
                    $scope.bankerCard = [];

                    if (vm.gamePlayed.cardP1) {
                        $scope.playerCard.push(vm.gamePlayed.cardP1);
                        $scope.playerCards.push({
                            value: vm.gamePlayed.cardP1[0],
                            class: vm.gamePlayed.cardP1[1],
                            footer: '1'
                        });
                    }
                    if (vm.gamePlayed.cardP2) {
                        $scope.playerCard.push(vm.gamePlayed.cardP2);
                        $scope.playerCards.push({
                            value: vm.gamePlayed.cardP2[0],
                            class: vm.gamePlayed.cardP2[1],
                            footer: '2'
                        });
                    }

                    if (vm.gamePlayed.cardB1) {
                        $scope.bankerCard.push(vm.gamePlayed.cardB1);
                        $scope.bankerCards.push({
                            value: vm.gamePlayed.cardB1[0],
                            class: vm.gamePlayed.cardB1[1],
                            footer: '5'
                        });
                    }
                    if (vm.gamePlayed.cardB2) {
                        $scope.bankerCard.push(vm.gamePlayed.cardB2);
                        $scope.bankerCards.push({
                            value: vm.gamePlayed.cardB2[0],
                            class: vm.gamePlayed.cardB2[1],
                            footer: '6'
                        });

                    }

                    if (vm.gamePlayed.numCardsDrawn > 4) {

                        if (vm.gamePlayed.cardP3 != null) {
                            $scope.playerCard.push(vm.gamePlayed.cardP3);
                            $scope.playerCards.push({
                                value: vm.gamePlayed.cardP3[0],
                                class: vm.gamePlayed.cardP3[1],
                                footer: '3'
                            });
                        }

                        if (vm.gamePlayed.cardB3 != null) {
                            $scope.bankerCard.push(vm.gamePlayed.cardB3);
                            $scope.bankerCards.push({
                                value: vm.gamePlayed.cardB3[0],
                                class: vm.gamePlayed.cardB3[1],
                                footer: '7'
                            });
                        }
                    }
                    $scope.playerTotal = vm.gamePlayed.playerScore;
                    $scope.bankerTotal = vm.gamePlayed.bankerScore;

                    $scope.bets = [];
                    tableDashboardService.getBetsForGame(vm.gamePlayed.uuid).then(function (data) {

                        $scope.playersData = data.successObj;
                        $scope.betsData = $scope.playersData;

                        $scope.bets = [];
                        $scope.betsPlayer = [];

                        $scope.independentBets_PP_Total = 0;
                        $scope.independentBets_BP_Total = 0;
                        $scope.independentBets_Tie_Total = 0;
                        $scope.independentBets_L6_Total = 0;

                        for (var i = 0; i < vm.tablePositions; i++) {
                            var x = {
                                positionIdx: i + 1,
                                numBets: 0,
                                player: []
                            };
                            $scope.bets.push(x);
                        }

                        for (var i = 0; i < $scope.betsData.length; i++) {

                            for (var j = 0; j < $scope.bets.length; j++) {

                                if ($scope.bets[j].positionIdx == $scope.betsData[i].positionIdx) {
                                    $scope.getData($scope.betsData[i], j, $scope.bets[j]);
                                    $scope.bets[j].numBets += 1;
                                }

                            }

                            if ($scope.betsData[i].positionIdx === 0) {

                                if ($scope.betsData[i].betType === 'BANKER_PAIR') {
                                    $scope.independentBets_BP_Total += parseInt($scope.betsData[i].wager);
                                    $scope.setDataBP($scope.betsData[i]);
                                }

                                else if ($scope.betsData[i].betType === 'PLAYER_PAIR') {
                                    $scope.independentBets_PP_Total += $scope.betsData[i].wager;
                                    $scope.setDataPP($scope.betsData[i]);
                                }

                                else if ($scope.betsData[i].betType === 'TIE') {
                                    $scope.independentBets_Tie_Total += $scope.betsData[i].wager;
                                    $scope.setDataTie($scope.betsData[i]);
                                }

                                else if ($scope.betsData[i].betType === 'LUCKY_SIX') {
                                    $scope.independentBets_L6_Total += $scope.betsData[i].wager;
                                    $scope.setDataL6($scope.betsData[i]);
                                    if ($scope.betsData[i].status.toLowerCase() === 'win' && $scope.gameResultString.indexOf('L6') === -1) {
                                        $scope.gameResultString += '/L6';
                                    }
                                }

                            }
                        }

                    });
                }
            };

            $scope.$on('playerUpdateclick', function (value) {
                if(value){
                    $scope.showGameDetails();
                }
            });

            $scope.getData = function (betsData, j, bet) {
                gameService.getSessionById(betsData.sessionId).then(function (data) {
                    $scope.swap = false;
                    if (data.successObj[0].clockInEventDtm) {
                        $scope.swap = true;
                        $scope.getSessionBuyIn(data.successObj[0], data.successObj[0].player.playerId);
                    }

                    if (data.successObj.length >= 1) {
                        $scope.calculateGameWinLoss(betsData, data.successObj[0].player.playerId);

                        if (data.successObj[0].isKnownPlayer == true) {
                            var obj = data.successObj[0];
                            var player = data.successObj[0].player.casinoPlayer;
                            obj.playerName = player.firstName !== null ? player.firstName + ' ' + player.lastName : '';
                            obj.casinoPlayerId = player.casinoPlayerId;
                            obj.imgUrl = player.imageUrl;
                        }

                        var lengthPlayerArr;
                        var addNew = false;

                        if ($scope.bets[j].player.length == 0) {
                            $scope.bets[j].player.push(data.successObj[0]);
                            lengthPlayerArr = $scope.bets[j].player.length - 1;
                            $scope.bets[j].player[lengthPlayerArr].betType = [];
                            $scope.bets[j].player[lengthPlayerArr].betsOnPosition = {
                                betsOnPositionP: [],
                                betsOnPositionB: [],
                                betsOnPositionBP: [],
                                betsOnPositionPP: [],
                                betsOnPositionT: [],
                                betsOnPositionL6: [],
                                betsOnPositionI: []
                            };
                        }

                        else if ($scope.bets[j].player.length > 0) {
                            for (var trueLength = 0; trueLength < $scope.bets[j].player.length; trueLength++) {
                                if ($scope.bets[j].player[trueLength].sessionId == betsData.sessionId) {
                                    lengthPlayerArr = trueLength;
                                    addNew = true;
                                    break;
                                }
                            }
                            if (!addNew) {
                                $scope.bets[j].player.push(data.successObj[0]);
                                lengthPlayerArr = $scope.bets[j].player.length - 1;
                                $scope.bets[j].player[lengthPlayerArr].betType = [];
                                $scope.bets[j].player[lengthPlayerArr].betsOnPosition = {
                                    betsOnPositionP: [],
                                    betsOnPositionB: [],
                                    betsOnPositionBP: [],
                                    betsOnPositionPP: [],
                                    betsOnPositionT: [],
                                    betsOnPositionL6: [],
                                    betsOnPositionI: []
                                };
                            }
                        }

                        $scope.bets[j].player[lengthPlayerArr].betType.push(betsData.betType);

                        if (betsData.betType === 'PLAYER') {
                            $scope.bets[j].player[lengthPlayerArr].betsOnPosition.betsOnPositionP.push(betsData);
                        }

                        else if (betsData.betType === 'BANKER') {
                            $scope.bets[j].player[lengthPlayerArr].betsOnPosition.betsOnPositionB.push(betsData);
                        }

                        else if (betsData.betType === 'BANKER_PAIR') {
                            $scope.bets[j].player[lengthPlayerArr].betsOnPosition.betsOnPositionBP.push(betsData);
                        }

                        else if (betsData.betType === 'PLAYER_PAIR') {
                            $scope.bets[j].player[lengthPlayerArr].betsOnPosition.betsOnPositionPP.push(betsData);
                        }

                        else if (betsData.betType === 'TIE') {
                            $scope.bets[j].player[lengthPlayerArr].betsOnPosition.betsOnPositionT.push(betsData);
                        }

                        else if (betsData.betType === 'LUCKY_SIX') {
                            $scope.bets[j].player[lengthPlayerArr].betsOnPosition.betsOnPositionL6.push(betsData);
                            if (betsData.status.toLowerCase() === 'win' && $scope.gameResultString.indexOf('L6') === -1) {
                                $scope.gameResultString += '/L6';
                            }
                        } else if (betsData.betType === 'T4_BAKULAN' || betsData.betType === 'T5_BAKULAN') {
                            $scope.bets[j].player[lengthPlayerArr].betsOnPosition.betsOnPositionI.push(betsData);
                        }

                        if ($scope.swap === true) {
                            var temp = $scope.bets[j].player[0];
                            $scope.bets[j].player[0] = data.successObj[0];
                            $scope.bets[j].player[lengthPlayerArr] = temp;
                        }
                    }

                    return data.successObj[0];
                });
            };

            $scope.getSessionBuyIn = function (player, playerId) {
                if (playerId != null) {
                    if (player && player.sessionStartDtm) {
                        tableDashboardService.playerSessionBuyIn(playerId, vm.calendarDate, vm.tableId, player.sessionStartDtm, player.sessionEndDtm).then(function (data) {
                            player.sessionBuyIn = data[0].txnValueSum;
                        });
                    }
                }
            };

            $scope.calculateGameWinLoss = function (bet, playerId, positionLabel) {
                if (bet && playerId) {
                    const position = positionLabel ? positionLabel : bet.positionIdx;
                    var win = $scope.playerWLMap.get(playerId + '_' + bet.sessionId + '_' + position);
                    var gameWin = win ? win : 0;
                    gameWin += (bet.casinoWin * -1);
                    $scope.playerWLMap.set(playerId + '_' + bet.sessionId + '_' + position, gameWin);
                }
            };


            $scope.setDataBP = function (betsData) {
                $scope.sessionsIds.push(betsData.sessionId);
                gameService.getSessionById(betsData.sessionId).then(function (data) {

                    if (data.successObj.length >= 1) {

                        $scope.getSessionBuyIn(data.successObj[0], data.successObj[0].player.playerId);
                        $scope.calculateGameWinLoss(betsData, data.successObj[0].player.playerId, data.successObj[0].positionLabel);

                        if (data.successObj[0].isKnownPlayer == true) {
                            var obj = data.successObj[0];
                            var player = data.successObj[0].player.casinoPlayer;
                            obj.playerName = player.firstName !== null ? player.firstName + ' ' + player.lastName : '';
                            obj.casinoPlayerId = player.casinoPlayerId;
                            obj.imgUrl = player.imageUrl;
                        }

                        data.successObj[0].betType = betsData.betType;
                        data.successObj[0].wager = betsData.wager;
                        $scope.independentBP.push(data.successObj[0]);

                    }
                });
            };

            $scope.setDataPP = function (betsData) {

                $scope.sessionsIds.push(betsData.sessionId);
                gameService.getSessionById(betsData.sessionId).then(function (data) {

                    if (data.successObj.length >= 1) {
                        $scope.getSessionBuyIn(data.successObj[0], data.successObj[0].player.playerId);
                        $scope.calculateGameWinLoss(betsData, data.successObj[0].player.playerId, data.successObj[0].positionLabel);
                        if (data.successObj[0].isKnownPlayer == true) {
                            var obj = data.successObj[0];
                            var player = data.successObj[0].player.casinoPlayer;
                            obj.playerName = player.firstName !== null ? player.firstName + ' ' + player.lastName : '';
                            obj.casinoPlayerId = player.casinoPlayerId;
                            obj.imgUrl = player.imageUrl;
                        }
                        data.successObj[0].betType = betsData.betType;
                        data.successObj[0].wager = betsData.wager;
                        $scope.independentPP.push(data.successObj[0]);
                    }
                });
            };

            $scope.setDataTie = function (betsData) {

                $scope.sessionsIds.push(betsData.sessionId);
                gameService.getSessionById(betsData.sessionId).then(function (data) {

                    if (data.successObj.length >= 1) {
                        $scope.getSessionBuyIn(data.successObj[0], data.successObj[0].player.playerId);
                        $scope.calculateGameWinLoss(betsData, data.successObj[0].player.playerId, data.successObj[0].positionLabel);
                        if (data.successObj[0].isKnownPlayer == true) {
                            var obj = data.successObj[0];
                            var player = data.successObj[0].player.casinoPlayer;
                            obj.playerName = player.firstName !== null ? player.firstName + ' ' + player.lastName : '';
                            obj.casinoPlayerId = player.casinoPlayerId;
                            obj.imgUrl = player.imageUrl;
                        }
                        data.successObj[0].betType = betsData.betType;
                        data.successObj[0].wager = betsData.wager;
                        $scope.independentTie.push(data.successObj[0]);
                    }
                });
            };

            $scope.setDataL6 = function (betsData) {

                $scope.sessionsIds.push(betsData.sessionId);
                gameService.getSessionById(betsData.sessionId).then(function (data) {

                    if (data.successObj.length >= 1) {
                        $scope.getSessionBuyIn(data.successObj[0], data.successObj[0].player.playerId);
                        $scope.calculateGameWinLoss(betsData, data.successObj[0].player.playerId, data.successObj[0].positionLabel);
                        if (data.successObj[0].isKnownPlayer === true) {
                            let obj = data.successObj[0];
                            let player = data.successObj[0].player.casinoPlayer;
                            obj.playerName = player.firstName !== null ? player.firstName + ' ' + player.lastName : '';
                            obj.casinoPlayerId = player.casinoPlayerId;
                            obj.imgUrl = player.imageUrl;
                        }
                        data.successObj[0].betType = betsData.betType;
                        data.successObj[0].wager = betsData.wager;
                        $scope.independentL6.push(data.successObj[0]);
                    }
                });
            };

            $scope.showNextBets = function () {

                var newStart = $scope.start + 5;
                var popup = vm.activePopup;
                var totalLength = $scope.activePopupLength;

                if (newStart < totalLength) {
                    $scope.start = newStart;
                }
            };

            $scope.showPrevBets = function () {
                var newStart = $scope.start - 5;
                var popup = vm.activePopup;
                var totalLength = $scope.activePopupLength;

                if (newStart >= 0) {
                    $scope.start = newStart;
                }
            };

            $scope.openPlayerDashboard = function (event, player) {
                if(!$scope.isCBPTEnabled){
                    return;
                }
                event && event.stopPropagation();
                var playerId = player.player.playerId;
                var decodedJwt1 = store.get(jwtTokenKey);
                var decodedJwt = jwtHelper.decodeToken(decodedJwt1);
                $rootScope.jwtUserName = decodedJwt.userId;
                if ($rootScope.jwtUserName || decodedJwt.superuser == true) {
                    var queryString = "client_id=plr";
                    authService.getRefreshedToken(queryString).then(function (data) {
                        if (data.access_token != null) {
                            $scope.jwt = data;
                            var url = config.openPDUrl + "#/player/session/" + playerId + '/' + vm.calendarDate + '?access_token=' + $scope.jwt.access_token;
                            console.log(url);
                            window.open(url);
                        }
                    });
                }
            };

            $scope.checkBetsLength = function (popup) {
                if (popup == 'independent-bp-players-details') {
                    $scope.activePopupLength = $scope.independentBP.length;
                    if ($scope.independentBP.length > 0) {
                        return true;
                    }
                }
                else if (popup == 'independent-pp-players-details') {
                    $scope.activePopupLength = $scope.independentPP.length;
                    if ($scope.independentPP.length > 0) {
                        return true;
                    }
                }
                else if (popup == 'independent-tie-players-details') {
                    $scope.activePopupLength = $scope.independentTie.length;
                    if ($scope.independentTie.length > 0) {
                        return true;
                    }
                }
                else if (popup === 'independent-l6-players-details') {
                    $scope.activePopupLength = $scope.independentL6.length;
                    return ($scope.independentL6.length > 0);
                }

                return false;
            };

            $scope.isUpdateSessionConfirmVisible = false;


            $scope.isPlayersSelected = function () {
                if($scope.playerList){
                    return $scope.playerList.some(function (player) {
                        return player._selected;
                    });
                }
            };

            $scope.showUpdateSessionConfirm = function () {

                $scope.isUpdateSessionConfirmVisible = true;
                /*$scope.selectedplayer:::{"casinoPlayerId":"123005","playerId":"1001","playerName":"Chan, Susan","PlayerWl":"2000.00","handle":"2000.00","AvgBet":"2000.00","banned":false,"$$hashKey":"object:361"}*/
                if (!$scope.selectedplayer.banned) {
                    $scope.showConfirm = true;
                }
                else{
                    $scope.showConfirm = false;
                    logger.warn("The searched player: "+$scope.updatePlayerData.updatedPlayerId +" is banned");
                }

                vm.playerDataOnConfirm = {
                    oldPlayers:$scope.updatePlayerData.oldCcasId,
                    playerToBeUpdated:$scope.updatePlayerData.updatedPlayerId,
                    newPlayerName: $scope.selectedPlayerNewName
                };

            };
            $scope.updatesessionCancel =function(){
                $rootScope.$broadcast('reload-select-user-screen', true);
                $('#game-detail-modal').css({ 'opacity' : 1});
            };

            $scope.$on('CLOSE_MODAL', () => {
                $('#update-user-modal').modal('hide');
                $('#game-detail-modal').css({'opacity': 1});
                $scope.updatesessionCancel();
            });

            $scope.selectedPlayer = function(player){
                if(!player.banned) {
                    $scope.selectedPlayerNewName = player.playerName;
                    $scope.showupdatebtn = true;
                    $scope.selectedplayer = player;
                    $scope.updatePlayerData.updatedPlayerId = player.casinoPlayerId;
                    $scope.showUpdateSessionConfirm();
                }
                else{
                    $scope.showupdatebtn = false;
                    logger.warn($translate.instant('application.app.CAM_CASHIER_LABELS.COMMON_LOGGERMESSAGES.BANNEDPLAYER'));
                }

            };

            $scope.playerlistPopulated = function(){
                $scope.showupdatebtn = false;
                $scope.isUpdateSessionConfirmVisible = false;
            };
            function swapItemSelection (player, index, isMultiple) {
                if(player.isKnownPlayer && !$scope.hasUpdateOpenKnownPerm && !$scope.hasRateOpenKnownPerm){
                    return;
                }
                if(!player.isKnownPlayer && !$scope.hasUpdateOpenAnonPerm){
                    return;
                }
                // if (vm.swipedPositions.indexOf(index+1) === -1) {
                    //Reset the selected value.
                    $scope.bets.forEach(function (bet) {
                        bet.player.forEach(function (player) {
                            player._selected = false;
                        })
                    });
                    var positionLabel = Number(player.positionLabel || 1);
                    var postionIndex;
                    var clockedInPlaeryerOnBackbetting = [];
                    if (!index) {
                        postionIndex = positionLabel <= 3 ? positionLabel - 1 : positionLabel - 2;
                        clockedInPlaeryerOnBackbetting = _.pluck($scope.bets[postionIndex].player, "clockInEventId").filter(function (e) {
                            return e
                        });

                    }

                    if (isMultiple) {
                        index = index - 1;
                        let players = $scope.bets[index].player;
                        for (let i = 0; i < players.length; i++) {
                            if (players[i].clockInEventId && !players[0].clockOutEventId) {
                                clockedInPlaeryerOnBackbetting.push(players[i].clockInEventId);
                            }
                        }
                    }

                    var decodedJwt1 = store.get(jwtTokenKey);
                    var decodedJwt = jwtHelper.decodeToken(decodedJwt1);
                    var permissions = decodedJwt.authorities[0].permissions;

                    if (!player.clockInEventDtm && clockedInPlaeryerOnBackbetting.length < 1 && decodedJwt.authorities[0].applicationCode === "TABLE_DASH") {
                        if (player.status === "IN_PROGRESS" && ( _.contains(permissions, "UPDATE_OPEN_ANONYMOUS_SESSION") || _.contains(permissions, "UPDATE_OPEN_KNOWN_SESSION") || _.contains(permissions, "RATE_OPEN_KNOWN_SESSION") || decodedJwt.superuser)) {
                            $scope.updatePlayerData.isKnownPlayer = player.isKnownPlayer;
                            $scope.updatePlayerData.positionLabel = index > 2 ? index + 2 : index + 1;
                            $scope.updatePlayerData.positionId = index + 1;
                            $scope.updatePlayerData.topologyId = player.tableId;
                            $scope.updatePlayerData.gamingDay = $rootScope.calendarDate;
                            $scope.updatePlayerData.oldCcasId = player.player.playerId;
                            $scope.updatePlayerData.sessionIds = player.sessionId;
                            $scope.updatePlayerData.identifier = 1;

                            if (!player.player.anonymous) {
                                $scope.updatePlayerData.updatedPlayerId = player.player.casinoPlayer.casinoPlayerId;
                            }


                            player._selected = !player._selected;
                            $scope.hideRate_update = false;
                        } else {
                            //$scope.openPlayerDashboard(null, player);
                        }
                    } else {
                        //$scope.openPlayerDashboard(null, player);
                    }
                // }
            }


            function onRateClick (e) {
                e.preventDefault();
                e.stopPropagation();
                $scope.isRateConfirmVisible = true;
                $scope.hideRate_update = true;
            }

            $scope.closeUpdateOption = function (e,index) {
                e.preventDefault();
                e.stopPropagation();
                $scope.bets[index].player[0]._selected = false;
            }

            $scope.closeBackbetUpdateOption = function (e, betPosIndex, index) {
                e.preventDefault();
                e.stopPropagation();
                $scope.bets[betPosIndex-1].player[index]._selected = false;
            };

            function updateSession () {
                $scope.showupdatebtn = false;
            }

            function cancelUpdateSession () {
                $scope.isUpdateSessionConfirmVisible = false;
            }

            function showBets(id) {
                vm.activePopup = id;
                $scope.start = 0;
                $scope.showLimit = 5;
                var showPopup = $scope.checkBetsLength(id);
                if (showPopup) {
                    $('#' + id).modal('show');
                }
                return id;
            }


            //start here
            $scope.showGameDetails();

            function ratePlayer(player) {

                var deferred = $q.defer();
                if (Math.round(Math.random())){
                    deferred.resolve();
                } else {
                    deferred.reject();
                }
                $scope.isRateConfirmVisible = false;
                return deferred.promise;
            }

            function updatePPId (player) {
                $scope.sessionIdForDisplay = player.sessionId;
                $scope.showupdatebtn = false;
                $('#game-detail-modal').css({ 'opacity' : 0});
                $('#update-user-modal').modal('show');
                $scope.playerList = [];
                $scope.isUpdateSessionConfirmVisible = false;
            }

            function checkForLucky6() {
                configurationService.isLucky6Enabled($rootScope.tableObj.topologyId).then(function (res) {
                    $scope.isLucky6 = res;
                });
            }

            function checkForCBPTStatus() { //Change for CN1-89 : Changes in Player Dashboard when CPBT is turned off
                configurationService.isCBPTEnabled().then(function (data) {
                    $scope.isCBPTEnabled = data;
                });
            }

        }
    }

    app.filter('myLimitTo', function () {
        return function (input, limit, begin) {
            return input.slice(begin, begin + limit);
        }
    });
})();
