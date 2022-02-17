(function () {
    'use strict';

    function TableGridDirective(overviewService, $rootScope, alertsService, store, jwtTokenKey, jwtHelper, config, commonService ) {
        return {
            restrict: 'E',
            scope: {
                tableCardData: '=',
                tableStatus: '=',
                tableViewStats: '=',
                topologyMap: "=",
                tableTopologyList: '=',
                totalTableCardCount: '='
            },
            templateUrl: 'bower_components/wdts-common-ui/src/client/app/blocks/tableGrid/table-grid.html',
            link: ($scope, $elem, attr) => {
                $scope.playePositionIndx = $scope.tableCardData.statCodes.indexOf('PLAYER_POSITIONS');
                $scope.tableAlertData = [];
                $scope.allData = commonService.getAllData();

                $scope.openDashboard = function (tableId) {
                    let tableNavigationUrl;
                    const topologyData = $scope.allData.dataTree;
                    for (let i = 0; i < topologyData.length; i++) {
                        if (topologyData[i].nodeId === tableId) {
                            const tableIP = topologyData[i].host;
                            var jwtdata = localStorage.getItem('jwt_cmr');
                            var decodedJwt = jwtHelper.decodeToken(jwtdata);
                            if(decodedJwt.applications.includes('TABLE_DASH')){
                                tableNavigationUrl = config.tableUIProtocol + tableIP + ':' + config.singleTablePort + '/single-table-view?access_token='
                                    + jwtdata + '&externalRedirection=' + config.openCMUrl + '/#/overview&topologyId=' + topologyData[i].nodeId;
                                window.open(tableNavigationUrl);
                            } else {
                                logger.warn($translate.instant("application.app.common.labels.NO_ACCESS_TO_REQUESTED_PAGE"));
                            }
                        }
                    }
                };

                $scope.getNumPositions = function (num) {
                    return new Array(parseInt(num));
                };

                $scope.checkPosition = function (playerCounts, index) {
                    if (playerCounts) {
                        for (let i = 0; i < playerCounts.length; i++) {
                            if (parseInt(playerCounts[i].pos) === index) {
                                $scope.playerIndex = i;
                                return $scope.playerIndex.toString();
                            } else if (i === playerCounts.length - 1) {
                                return false;
                            }
                        }
                    }
                    return false;
                };

                $scope.totalPositions = function (index) {
                    return $scope.tableCardData.data[index].stats[$scope.playePositionIndx];
                };

                $scope.getTablesAlertCount = () => {
                    alertsService.getTablesAlertCount($scope.tableTopologyList.toString())
                        .then((data) => {
                            $scope.tableAlertData = data;
                        });
                };

                $scope.getTablesAlertCount();

                $scope.slider = function () {
                    return $rootScope.slider;
                };


                $scope.getTotalLength = function (swipedPlayers, knownPlayers, anonPlayers) {
                    let totalPlayertypes = [swipedPlayers.length > 0, knownPlayers.length > 0, anonPlayers.length > 0];
                    let totallenght = _.countBy(totalPlayertypes)[true];
                    $scope.totalplyrcount = swipedPlayers.length + knownPlayers.length + anonPlayers.length;
                    return totallenght;
                };

                $scope.showPlayersPopup = function (e, stats) {
                    e.stopPropagation();
                    if (stats) {
                        $scope.$emit('showPlayerPopup', stats);
                    }
                };
            }
        };

    }

    let app = angular.module('wdts.tableGrid', []);
    app.directive('tableGrid',
        ['overviewService', '$rootScope', 'alertsService', 'store', 'jwtTokenKey', 'jwtHelper', 'config', 'commonService',
            TableGridDirective]);
})();
