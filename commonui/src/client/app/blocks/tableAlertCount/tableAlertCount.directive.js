(function () {
    'use strict';


    function tableAlertCount(jwtHelper, overviewService, config) {
        return {
            restrict: 'E',
            scope: {
                topologyId: '=',
                tablesAlertData: '='
            },
            templateUrl: 'bower_components/wdts-common-ui/src/client/app/blocks/tableAlertCount/tableAlertCount.html',
            link: ($scope, $elem, attr) => {
                const self = this;
                $scope.topologyAlertCount = $scope.tablesAlertData.find((alertCount) => {
                    return parseInt(alertCount.topologyId) === parseInt($scope.topologyId);
                });

                $scope.openAlerts = (arg, saverity) => {

                    var queryString = "client_id=alrt";
                    overviewService.getRefreshedToken(queryString).then(function (data) {
                        var jwtdata = data;
                        var decodedJwt = jwtHelper.decodeToken(jwtdata.access_token);
                        var url;
                        if (!decodedJwt.authorities) {
                            queryString = "client_id=alrt&inheritTop=true";
                            overviewService.getRefreshedToken(queryString).then(function (data) {
                                jwtdata = data;
                                $scope.jwt = jwtdata;
                                url = config.openAlertsUrl + '#/alert/table/' + arg + '?app=casino&severity=' + saverity + '&access_token=' + jwtdata.access_token;

                                window.open(url);
                            });
                        } else {
                            $scope.jwt = jwtdata;
                            url = config.openAlertsUrl + '#/alert/table/' + arg + '?app=casino&severity=' + saverity + '&access_token=' + jwtdata.access_token;

                            window.open(url);
                        }
                    });
                };
            }
        };
    }

    let app = angular.module('wdts.tableAlertCount', []);
    app.directive('tableAlertCount',
        ['jwtHelper', 'overviewService', 'config',
            tableAlertCount]);

})();
