(function () {
    'use strict';

    angular
        .module('wdts.alertCount',[])
        .directive('alertCount', alertCount);

    /* @ngInject */

    function alertCount() {
        return {
            bindToController: true,
            controller: alertCountController,
            controllerAs: 'vm',
            restrict: 'EA',
            scope: {
                jwtName : '='
            },
            templateUrl: function (elem, attr) {
                return 'bower_components/wdts-common-ui/src/client/app/blocks/alertCount/alertCount.html';
            }
        };

        alertCountController.$inject = ['$scope', 'logger', '$rootScope', 'overviewService', 'store', 'jwtHelper', 'config', '$stateParams', 'messagingService', 'alertsService', '$state', 'authService'];

        /* @ngInject */
        function alertCountController($scope, logger, $rootScope, overviewService, store, jwtHelper, config, $stateParams, messagingService, alertsService, $state, authService) {
            var vm = this;
            $scope.appAccess = true;
            $scope.topics = [];
            var decodedJwt = {};
            if(store.get(vm.jwtName) != null) {
                decodedJwt = store.get(vm.jwtName);
                decodedJwt = jwtHelper.decodeToken(decodedJwt);
            }


            $scope.$on('$stateChangeSuccess', function() {
                $scope.updateAlertCount();
            });

            $scope.startSubscription = function () {
                $scope.endpointUrl = config.alert.socketAlert;
                $scope.topicToSend = '/topic/alert-count-update';
                var newEndPoint = messagingService.initialize($scope.endpointUrl,$scope.topicToSend);

                if (newEndPoint) {
                    messagingService.connectionStarted($scope.topicToSend).then(null, null, function () {
                        if ($scope.topicToSend) {
                            try{
                                messagingService.startListener($scope.topicToSend);
                                $scope.topics.push($scope.topicToSend);
                                $scope.topicToSend = "";
                            }catch(e){
                                //alert(e);
                            }
                        }
                    });
                }
                else {
                    messagingService.startListener($scope.topicToSend);
                }
                messagingService.receiveMessage($scope.topicToSend).then(null, null, function (data) {

                    if(data.topic == '/topic/alert-count-update'){


                        var dataValue = data.value;

                        var topologyIndex = -1;

                        for (var i = 0; i < dataValue.length; i++) {
                            if (dataValue[i].topologyId == $scope.alertTopplogyId) {
                                topologyIndex = i;
                                break;
                            }
                        }


                        if(topologyIndex!=-1) {
                            $scope.alertCounts = dataValue[topologyIndex];
                        }

                    }
                });

            };

            $scope.updateAlertCount = function () {

                if($scope.appAccess) {

                    $scope.startSubscription();
                    if(vm.jwtName == 'jwt_trs'){
                        $scope.alertTopplogyId = $stateParams.tableId ? $stateParams.tableId : ( $stateParams.cageId ? $stateParams.cageId : $stateParams.treasuryId);
                    }else if(vm.jwtName == 'jwt_tbldash'){
                        $scope.alertTopplogyId = $state.params.tableId;
                    }else if(vm.jwtName == 'jwt_cmr'){
                        $scope.alertTopplogyId = $rootScope.alertTopologyId;
                    }

                    var topologyIdGroupStr = $rootScope.decodedJwt.authorities[0].topologyGroups ? $rootScope.decodedJwt.authorities[0].topologyGroups.toString() : '';

                    if($scope.alertTopplogyId != null) {
                        alertsService.getAlertCounts($scope.alertTopplogyId, topologyIdGroupStr).then(function (data) {
                            if (data.status == 404) {
                                $scope.alertCounts = {highCount: 0, criticalCount: 0, lowCount: 0};
                            } else {
                                $scope.alertCounts = data[0];
                            }

                        },function error(){
                            $scope.alertCounts = {highCount: 0, criticalCount: 0, lowCount: 0};
                        });
                    }
                }
            };

            $scope.updateAlertCount();


            $scope.openAlerts = function(saverity){
                var alerts = '';

                if(vm.jwtName == 'jwt_trs'){
                    if($stateParams.tableId){
                        alerts = config.openAlertsUrl + '#/alert/table/' + $scope.alertTopplogyId + '?app=treasury&severity=' + saverity;
                    }else{
                        alerts = config.openAlertsUrl + '#/alert/treasury/' + $scope.alertTopplogyId + '?app=treasury&severity=' + saverity;
                    }
                }else if(vm.jwtName == 'jwt_tbldash'){
                    alerts = config.openAlertsUrl + '#/alert/table/' + $scope.alertTopplogyId + '?app=table&severity=' + saverity;
                }else if(vm.jwtName == 'jwt_cmr'){
                    alerts = config.openAlertsUrl + '#/alert/table/' + $scope.alertTopplogyId + '?app=casino&severity=' + saverity;
                }

                var queryString = "client_id=alrt";
                authService.getRefreshedToken(queryString).then(function(data){
                    var jwtdata = data;
                    var decodedJwt = jwtHelper.decodeToken(jwtdata.access_token);
                    var app = _.findWhere(decodedJwt.authorities, {"applicationCode": "ALERTS"});
                    var url;
                    if(app){
                        if((app.topologyIds == null || app.topologyIds.length == 0)) {
                            queryString = "client_id=alrt&inheritTop=true";
                            overviewService.getRefreshedToken(queryString).then(function (data) {
                                jwtdata = data;
                                $scope.jwt = jwtdata;
                                url = alerts + '&access_token=' + jwtdata.access_token;
                                window.open(url);
                            });
                        }
                        else{
                            $scope.jwt = jwtdata;
                            url  = alerts + '&access_token=' + jwtdata.access_token;
                            window.open(url);
                        }
                    }else{
                        $scope.jwt = jwtdata;
                        url  = alerts + '&access_token=' + jwtdata.access_token;
                        window.open(url);
                    }
                });
            };
        }
    }
})();
