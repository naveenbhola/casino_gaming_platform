(function () {
    'use strict';

    angular
        .module('wdts.playerSearch',[])
        .directive('playerSearch', playerSearch);

    /* @ngInject */

    function playerSearch() {
        return {
            bindToController: true,
            controller: playerSearchController,
            controllerAs: 'vm',
            restrict: 'EA',
            scope: {
                jwtName : '='
            },
            templateUrl: function (elem, attr) {
                return 'bower_components/wdts-common-ui/src/client/app/blocks/playerSearch/playerSearch.html';
            }
        };

        playerSearchController.$inject = ['$scope', 'logger', '$rootScope', 'overviewService', 'commonService', 'store', 'jwtHelper', 'config', 'authService', '$translate', '$stateParams', 'configurationService'];

        /* @ngInject */
        function playerSearchController($scope, logger, $rootScope, overviewService, commonService, store, jwtHelper, config, authService, $translate, $stateParams, configurationService) {
            var vm = this;
            vm.allData = commonService.getAllData();

            $scope.showPlayerCardView = true;
            $scope.showPlayerNameView = false;
            $scope.showPlayerIdView = false;
            $scope.isCBPTOn = false;
            $scope.allTopologyData = commonService.getAllData().dataTree;
            getCBPTStatus(); //Change for CN1-89 : Changes in Player Dashboard when CPBT is turned off

            if(vm.jwtName == 'jwt_trs'){
                $scope.gamingDay = vm.allData.gamingDay;
            }if(vm.jwtName == 'jwt_cmr'){
                $scope.gamingDay = vm.allData.gamingDayFromURL;
            }if(vm.jwtName == 'jwt_tbldash'){
                $scope.gamingDay = $stateParams.date || vm.allData.gamingDayFromURL;
            }

            function getCBPTStatus () { //Change for CN1-89 : Changes in Player Dashboard when CPBT is turned off
                configurationService.isCBPTEnabled().then(function (data) {
                  $scope.isCBPTOn = data;
                });
            }

            vm.showPlayerCardView = function () {
                $scope.inpFirstName = '';
                $scope.inpLastName = '';
                $scope.inpPlrId = '';
                $scope.showPlayerCardView = true;
                $scope.showPlayerNameView = false;
                $scope.showPlayerIdView = false;

            };

            vm.showPlayerNameView = function () {
                $scope.inpFirstName = '';
                $scope.inpLastName = '';
                $scope.inpPlrId = '';
                $scope.showPlayerCardView = false;
                $scope.showPlayerNameView = true;
                $scope.showPlayerIdView = false;
            };

            vm.showPlayerIdView = function () {
                $scope.inpFirstName = '';
                $scope.inpLastName = '';
                $scope.inpPlrId = '';
                $scope.showPlayerCardView = false;
                $scope.showPlayerNameView = false;
                $scope.showPlayerIdView = true;
            };
            $('#modalPlayerSearch').on('hidden.bs.modal', function () {
                document.onkeypress = function (e) {};
            });
            commonService.autoDetectCardSwipe(function (cardVal) {
                overviewService.getSwipedPlayer(cardVal).then(function (data) {
                    if(data.length > 0){
                        overviewService.getSearchedPlayerById(data[0].casinoPlayer.casinoPlayerId, $scope.gamingDay).then(function (data) {
                            if (data && data.length) {
                                $scope.searchedPlrobj = data;
                                $scope.showplayersearchresults = true;
                            } else {
                                logger.info($translate.instant('application.app.common.labels.TOPNAV.PLAYER_NOT_FOUND'));
                            }
                        });
                    }else{
                        logger.info($translate.instant('application.app.common.labels.TOPNAV.PLAYER_NOT_FOUND'));
                    }

                });
            });

            vm.plrSrchByNameClk = function () {
                if (!$scope.inpFirstName && !$scope.inpLastName) {
                    return;
                }

                $scope.searchedPlrobj = [];
                $rootScope.searchedPlrobj = [];

                if (!$scope.inpFirstName) {
                    $scope.inpFirstName = ''
                }

                if (!$scope.inpLastName) {
                    $scope.inpLastName = ''
                }
                $("#modalPlayerSearch").focus();
                overviewService.getSearchedPlayerByName($scope.inpFirstName, $scope.inpLastName, $scope.gamingDay).then(function (data) {
                    $scope.searchedPlrobj = data;
                    $rootScope.searchedPlrobj = $scope.searchedPlrobj;
                    $scope.showplayersearchresults = true

                });


            };

            vm.plrSrchByIdClk = function () {
                $scope.searchedPlrobj = [];
                $("#modalPlayerSearch").focus();
                overviewService.getSearchedPlayerById($scope.inpPlrId, $scope.gamingDay).then(function (data) {
                    if (data && data.length) {
                        $scope.searchedPlrobj = data;
                        $rootScope.searchedPlrobj = $scope.searchedPlrobj;
                        $scope.showplayersearchresults = true
                    } else {
                        logger.info($translate.instant('application.app.common.labels.TOPNAV.PLAYER_NOT_FOUND'));
                    }
                });

            };

            $scope.showDashboard = function(tableId){
                let tableIP;
                for (let i = 0; i < $scope.allTopologyData.length; i++) {
                    if ($scope.allTopologyData[i].nodeId === tableId) {
                        tableIP = $scope.allTopologyData[i].host;
                    }
                }

                overviewService.getCurrentGamingDay(tableId).then(function (data1) {
                    const gamingDay = data1['successObj'];
                    const tbUrl = config.tableUIProtocol + tableIP + ':' + config.singleTablePort +
                        '/tabledashboard/' + gamingDay + '/session';
                    window.open(tbUrl);
                    /*if(data1 !=null) {
                        var decodedJwt1 = store.get(vm.jwtName);
                        var decodedJwt = jwtHelper.decodeToken(decodedJwt1);
                        $rootScope.jwtUserName = decodedJwt.userId;
                        if(($rootScope.jwtUserName || decodedJwt.superuser == true) && !jwtHelper.isTokenExpired(store.get(vm.jwtName))){
                            var queryString = "client_id=tab";
                            authService.getRefreshedToken(queryString).then(function(data){
                                $scope.jwt = data.access_token;
                                var url = config.openTDUrl + "#/tabledashboard/" + tableId + '/' + data1.successObj + '/sessions?access_token=' + $scope.jwt;
                                window.open(url);
                            });
                        }
                        else{
                            var open = config.openTDUrl + "#/tabledashboard/" + tableId + '/' + data1.successObj + '/sessions';
                            window.open(open);
                        }

                    }
                    else{
                        var tdUrl = config.openTDUrl + "#/tabledashboard/" + tableId + '/' + data1.successObj + '/sessions';
                        window.open(tdUrl);
                    }*/

                });

            };

            $scope.showPDashboard = function(plrId){
                if(!$scope.isCBPTOn){
                    return;
                }
                var queryString = "client_id=plr";
                authService.getRefreshedToken(queryString).then(function(data){
                    var jwtdata = data;
                    var decodedJwt = jwtHelper.decodeToken(jwtdata.access_token);
                    var url;
                    if(!decodedJwt.authorities && vm.jwtName != 'jwt_trs'){
                        queryString = "client_id=plr&inheritTop=true";
                        authService.getRefreshedToken(queryString).then(function(data){
                            jwtdata =data;
                            $scope.jwt = jwtdata;
                            url  = config.openPDUrl + "#/player/session/" + plrId + '/' + $scope.gamingDay + '?access_token=' + jwtdata.access_token;
                            window.open(url);
                        });
                    }else{
                        $scope.jwt = jwtdata;
                        url  = config.openPDUrl + "#/player/session/" + plrId + '/' + $scope.gamingDay + '?access_token=' + jwtdata.access_token;
                        window.open(url);
                    }
                });
            };
        }
    }
})();
