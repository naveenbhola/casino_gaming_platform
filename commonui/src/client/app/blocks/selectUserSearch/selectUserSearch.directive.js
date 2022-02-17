(function () {
    'use strict';

    angular
        .module('wdts.commonui.blocks.selectUserSearch')
        .directive('selectUserSearch', selectUserSearch);

    selectUserSearch.$inject = ['playerService','logger', '$translate', '$rootScope', '$state', 'commonService', '$stateParams','tableDashboardService'];

    function selectUserSearch(playerService, logger, $translate,$rootScope, $state, commonService, $stateParams,tableDashboardService) {
        return {
            restrict: 'EA',
            scope: {
                playerList: '=list'
            },
            templateUrl: 'bower_components/wdts-common-ui/src/client/app/blocks/selectUserSearch/selectUserSearch.html',
            link: link
        };

        function link($scope) {
            $scope.loader = false;
            $scope.player = "";
            $scope.filterTypeTranslated = 'application.app.common.labels.PLAYERID';
            $scope.$on('updateSearchKey',function (event, data) {
                $scope.player = "";
            });

            let reloadSelectUserScreen = $rootScope.$on('reload-select-user-screen', (event) => { selectFilterType('id'); });
            $scope.isSwipeCardHit = false;
            $scope.selectFilterType = selectFilterType;
            $scope.createSearchPlayer = createSearchPlayer;
            $scope.getSwipeCardData = getSwipeCardData;
            $scope.$on('modal-open',function (event,modalStatus) {
                $scope.player = "";
                if(modalStatus){
                    commonService.autoDetectCardSwipe(function (cardVal) {
                        $scope.isSwipeCardHit = true;
                        getSwipeCardData.call(this,cardVal);
                    });
                }else{
                    document.onkeypress =  (e) => {}
                }
            })

            function getSwipeCardData(cardData) {
                    $scope.playerList = [];
                    $scope.gamingDay = $rootScope.calendarDate?$rootScope.calendarDate:$stateParams.gamingDay;
                    $scope.topologyId = $state.params.tableId;
                    if(!$scope.topologyId){
                        var vm = this;
                        vm.allData = commonService.getAllData();
                        $scope.topologyId = vm.allData.rootNodeId
                        playerService.getSwipedPlayer(cardData).then(_success, _error);
                    }else{
                        tableDashboardService.getSwipedPlayer(cardData).then(_success, _error);
                }

            }

            selectFilterType('id');

            function createSearchPlayer() {
                console.log("createSearchPlayer");
                $scope.error = false;
                $scope.loader = true;
                $scope.gamingDay = $rootScope.calendarDate?$rootScope.calendarDate:$stateParams.gamingDay;
                $scope.topologyId = $state.params.tableId;
                if(!$scope.topologyId){
                    var vm = this;
                    vm.allData = commonService.getAllData();
                    $scope.topologyId = vm.allData.rootNodeId
                }
                if ($scope.filterType == 'First Name') {
                    if($scope.player.length >= 3) {
                        playerService.getPlayerbyFirstLastName($scope.player, null).then(_success, _error);
                    }
                    else{
                        $scope.loader = false;
                        logger.warn($translate.instant('application.app.CAM_CASHIER_LABELS.COMMON_LOGGERMESSAGES.SEARCHPLAYER'));
                    }
                } else if ($scope.filterType == 'Last Name') {
                    if($scope.player.length >= 3) {
                        playerService.getPlayerbyFirstLastName(null, $scope.player).then(_success, _error);
                    }
                    else{
                        $scope.loader = false;
                        logger.warn($translate.instant('application.app.CAM_CASHIER_LABELS.COMMON_LOGGERMESSAGES.SEARCHPLAYER'));
                    }
                } else if ($scope.filterType == 'Player ID') {
                    playerService.getPlayerbyID($scope.player).then(_success, _error);
                }
            }

            function _success(data) {
                if (data != null) {
                    if (data) {
                        $scope.playerList = [];
                        for(var i=0; i<data.length; i++){
                            var playerObj = {
                                casinoPlayerId: data[i].casinoPlayer.casinoPlayerId,
                                playerName: data[i].casinoPlayer.firstName +" "+data[i].casinoPlayer.lastName,
                                preferredName:data[i].casinoPlayer.preferredName,
                                dateOfBirth:data[i].casinoPlayer.dateOfBirth,
                                city:data[i].casinoPlayer.city,
                                state:data[i].casinoPlayer.state,
                                country:data[i].casinoPlayer.country,
                                stopCodes:data[i].casinoPlayer.stopCodes,
                                banned:data[i].casinoPlayer.banned

                            };
                            $scope.playerList.push(playerObj);
                        }
                        if(data.length > 0 && $scope.isSwipeCardHit){
                            $scope.player = data[0].casinoPlayer.lastName + ', ' + data[0].casinoPlayer.firstName + ' (#' + data[0].casinoPlayer.casinoPlayerId + ')';

                        }
                        if(data.length == 0){
                            $scope.player ='';
                            logger.info($translate.instant('application.app.common.labels.PLAYERNOTFOUND'));
                        }
                    } else {
                        $scope.player ='';
                        logger.info($translate.instant('application.app.common.labels.PLAYERNOTFOUND'));
                    }
                    $scope.loader = false;
                } else {
                    $scope.player ='';
                    logger.info($translate.instant('application.app.common.labels.PLAYERNOTFOUND'));
                    $scope.error = true;
                }
            }
            function _error() {
                $scope.player='';
                $scope.isSwipeCardHit = false;
                logger.info($translate.instant('application.app.common.labels.PLAYERNOTFOUND'));
                $scope.error = true;
                $scope.loader = false;
            }

            function selectFilterType(arg) {

                if (arg == 'id') {
                    $scope.filterType = 'Player ID';
                    $scope.filterTypeTranslated = 'application.app.common.labels.PLAYERID';
                }
                else if (arg == 'fn') {
                    $scope.filterType = 'First Name';
                    $scope.filterTypeTranslated = 'application.app.common.labels.FIRST_NAME';
                }

                else if (arg == 'ln') {
                    $scope.filterType = 'Last Name';
                    $scope.filterTypeTranslated = 'application.app.common.labels.LAST_NAME';
                }

                else if (arg == 'swipe') {
                    $scope.filterType = 'Card Swipe';
                    $scope.filterTypeTranslated = 'application.app.common.labels.CARD_SWIPE';
                    setTimeout(function() {
                        $("[autofocus]").focus();
                    }, 0);
                }

            }

            $scope.$on("$destroy", reloadSelectUserScreen);
        }
    }
})();
