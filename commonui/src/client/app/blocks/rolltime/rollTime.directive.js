(function () {
    'use strict';

    angular
        .module('wdts.rolltime',[])
        .directive('rollTime', rollTime);

    /* @ngInject */

    function rollTime() {
        return {
            bindToController: true,
            controller: rollTimeController,
            controllerAs: 'vm',
            restrict: 'EA',
            scope: {
                jwtName : '=',
                topologyId: '='
            },
            templateUrl: function (elem, attr) {
                return 'bower_components/wdts-common-ui/src/client/app/blocks/rolltime/rolltime.html';
            }
        };

        rollTimeController.$inject = ['$translate','$filter','$scope', 'logger', '$rootScope', 'cageService', 'commonService', 'store', 'jwtHelper', 'configurationService'];

        /* @ngInject */
        function rollTimeController($translate,$filter,$scope, logger, $rootScope, cageService, commonService, store, jwtHelper, configurationService) {
            var vm = this;
            vm.allData = commonService.getAllData();

            $scope.updateRollTimePer = false;
            $scope.gamingDayRollTimeThreshold = '';

            $scope.getGamingDayRollTimeThreshold = function() {
                configurationService.getGamingDayRollTimeThreshold().then(function (data) {
                    if(data[0].propertyValues.length > 0){
                        $scope.gamingDayRollTimeThreshold = data[0].propertyValues[0].propertyValue;
                    }
                });
            }

            $scope.getRollTime = function() {
                $scope.selectMap = new Map();
                $scope.gamingDayMap = new Map();
                $scope.selectedAll = false;
                $scope.currentGamingDayAr = [];
                $scope.rollTimeNodes = [];

                cageService.getRollDTM(vm.topologyId).then(function (data) {
                    console.log(data);

                    if (data != null) {

                        for (var i = 0; i < data.length; i++) {

                            data[i].selected = false;
                            $scope.selectMap.set(data[i].topologyNode.nodeId,data[i].selected);
                            $scope.gamingDayMap.set(data[i].topologyNode.nodeId,data[i].currentGamingDay);
                            var d = [];
                            var time = data[i].nextRollDtm.split('T');
                            var d = data[i].nextRollDtm.split('Z');

                            data[i].defaultNextRollDtm  = data[i].nextRollDtm;

                            data[i].dat = new Date(d[0] + '.000Z');

                            console.log('data[i].dat' + data[i].dat);
                            var time1 = time[1].split(':');
                            data[i].time = time1[0] + ':' + time1[1];

                            if (data[i].topologyNode.path != "[]") {
                                var n = data[i].topologyNode.path.replace('[', '');
                                var n1 = n.replace(']', '');
                                data[i].pathAr = n1.split(',').reverse();
                            }
                            else {
                                data[i].pathAr = null;
                            }

                            if ($scope.currentGamingDayAr.indexOf(data[i].currentGamingDay) == -1) {
                                $scope.currentGamingDayAr.push(data[i].currentGamingDay);
                            }

                            $scope.currentGamingDayAr.sort(function (a, b) {
                                var c = new Date(a);
                                var d = new Date(b);
                                return c - d;
                            });

                            $scope.dateFilter = $scope.currentGamingDayAr[0];
                            $scope.buttonValue = $scope.currentGamingDayAr[0];
                        }
                        var selectedDate = $filter('date')($scope.currentGamingDayAr[0], "dd");
                        var currentGamingDay = $filter('date')($rootScope.siteGamingDay, "dd");

                        $scope.selectionDisabled = parseInt(selectedDate)>parseInt(currentGamingDay)?true:false;

                        $scope.rollTimeNodes = data;
                        $("#modalRollTime").modal("show");
                    }
                    else {
                        logger.info('No data found');
                    }
                });

            };

            $scope.permissionName = '';


            if(vm.jwtName){
                if(vm.jwtName == 'jwt_trs'){
                    $scope.jwt = jwtHelper.decodeToken(store.get('jwt_trs'));
                    $scope.permissionName = 'ROLL_TIME_UPDATE_TREAS';
                }if(vm.jwtName == 'jwt_cmr'){
                    $scope.jwt = jwtHelper.decodeToken(store.get('jwt_cmr'));
                    $scope.permissionName = 'ROLL_TIME_UPDATE_CMR';

                }if(vm.jwtName == 'jwt_tbldash'){
                    $scope.jwt = jwtHelper.decodeToken(store.get('jwt_tbldash'));
                    $scope.permissionName = 'ROLL_TIME_UPDATE_TBL';
                }
                if($scope.jwt.authorities){
                    $scope.appPermissions = $scope.jwt.authorities[0].permissions;

                    if($scope.appPermissions && $scope.appPermissions.length>0){
                        if($scope.jwt.superuser == true){
                            $scope.updateRollTimePer = true;
                        }else{
                            for(var i=0;i<$scope.appPermissions.length;i++){
                                if($scope.appPermissions[i]== $scope.permissionName){
                                    $scope.updateRollTimePer = true;
                                }
                            }
                        }
                    }
                }
                $scope.getRollTime();
                $scope.getGamingDayRollTimeThreshold();
            }

            $scope.rollTimeNodes = [];

            $scope.selectedNode = {};

            $scope.currentGamingDayAr = [];

            $scope.selectMap = new Map();
            $scope.change = function (nodes) {
                console.log('Nodes',nodes);
                $scope.selectMap.set(nodes.topologyNode.nodeId,nodes.selected);
                helper(nodes.topologyNode.nodeId,nodes.selected);

                $scope.selectedNode = nodes;

            };

            //recursive method for selecting all the child nodes on selecting a node for changing roll time
            function helper(id,select){
                var Ar = vm.allData.topologyChildMap.get(id);
                if(Ar != null) {
                    for (var i = 0; i < Ar.length; i++) {
                        if($scope.gamingDayMap.get(Ar[i]) === $scope.buttonValue) {
                            const nodeIndex = $scope.rollTimeNodes.findIndex(node => node.topologyNode.nodeId === Ar[i]);
                            if ( $scope.rollTimeNodes[nodeIndex].topologyNode.type === 1200 && $scope.rollTimeNodes[nodeIndex].rollMode && $scope.rollTimeNodes[nodeIndex].rollMode === 'Auto') {
                                $scope.selectMap.set(Ar[i], select);
                            } else if ($scope.rollTimeNodes[nodeIndex].topologyNode.type !== 1200) {
                                $scope.selectMap.set(Ar[i], select);
                            }

                            if (vm.allData.topologyChildMap.get(Ar[i]) !== null) {
                                helper(Ar[i], select);
                            }
                        }
                    }
                }
            }

            /*
             This method will show only those dates that user is required to select from the picker
             */
            $scope.beforeRenderDate = function ($view, $dates, $leftDate, $upDate, $rightDate, arg, topologyType) {
                // if ($scope.dateRangeEnd) {
                var activeDate;
                if (topologyType === 1200) {
                    let thresholdValFormate = $scope.gamingDayRollTimeThreshold[0] + $scope.gamingDayRollTimeThreshold[1] + ':' +
                        $scope.gamingDayRollTimeThreshold[2] + $scope.gamingDayRollTimeThreshold[3] + ':00';
                    const dateFormat = moment(arg).format('YYYY-MM-DD');
                    var endDtmFormat = moment(dateFormat + ':' + thresholdValFormate);
                    activeDate = moment(endDtmFormat);
                } else {
                    activeDate = moment(endDtmFormat).add(24, 'hours');
                }

                for (var i = 0; i < $dates.length; i++) {
                    if ($dates[i].localDateValue() >= activeDate.valueOf()) $dates[i].selectable = false;
                }

                var x = moment();
                var activeDate1 = moment.utc(x).toDate();
                for (var i = 0; i < $dates.length; i++) {
                    if ($dates[i].localDateValue() < activeDate1.valueOf()) {
                        $dates[i].selectable = false;
                    }
                }
            };

            $scope.changeRollTime = function () {
                console.log('selectedNode',$scope.selectedNode);
                if ($scope.selectedNode.defaultNextRollDtm != $scope.selectedNode.nextRollDtm && $scope.selectedNode != null)
                {
                    $scope.rollTimeAr = [];

                    for (var i = 0; i < $scope.rollTimeNodes.length; i++) {
                        var obj = {
                            nextRollDtm: null,
                            nodeId: null
                        };

                        if ($scope.selectMap.get($scope.rollTimeNodes[i].topologyNode.nodeId) == true) {
                            var id = $scope.selectedNode.nextRollDtm;
                            console.log(id);
                            var x = id.toISOString().split('.000Z');
                            obj.nextRollDtm = x[0] + 'Z';
                            obj.nodeId = $scope.rollTimeNodes[i].topologyNode.nodeId;
                            $scope.rollTimeAr.push(obj);
                        }

                    }
                    console.log($scope.rollTimeAr);

                    cageService.setRollDTM($scope.rollTimeAr,$scope.jwt.userId,$scope.jwt.employeeId).then(function (data) {
                        console.log(data);
                        logger.success($translate.instant('application.app.common.labels.TOPSUBNAV.ROLL_TIME_UPDATED'));
                        getUpdatedRollTimeData();
                    });

                }
                else{
                    logger.info($translate.instant('application.app.common.labels.TOPSUBNAV.PLEASE_CHANGE_TIME'));
                }
            };

            vm.changeGamingDay = function (date) {

                var selectedDate = $filter('date')(date, "dd");
                var currentGamingDay = $filter('date')($rootScope.currentGamingDay, "dd");

                $scope.selectionDisabled = parseInt(selectedDate) > parseInt(currentGamingDay);

                if ($scope.buttonValue != date) {
                    $scope.dateFilter = date;
                    $scope.buttonValue = date;

                    angular.forEach($scope.rollTimeNodes, function (item) {
                        item.selected = false;
                        item.disabled = false;
                    });
                }
            };

            function getUpdatedRollTimeData(){

                cageService.getRollDTM(vm.topologyId).then(function (data) {
                    console.log(data);

                    if (data != null) {

                        for (var i = 0; i < data.length; i++) {

                            data[i].selected = false;
                            $scope.selectMap.set(data[i].topologyNode.nodeId,data[i].selected);
                            var d = [];
                            var time = data[i].nextRollDtm.split('T');
                            var d = data[i].nextRollDtm.split('Z');

                            data[i].defaultNextRollDtm  = data[i].nextRollDtm;

                            data[i].dat = new Date(d[0] + '.000Z');

                            console.log('data[i].dat' + data[i].dat);
                            var time1 = time[1].split(':');
                            data[i].time = time1[0] + ':' + time1[1];

                            if (data[i].topologyNode.path != "[]") {
                                var n = data[i].topologyNode.path.replace('[', '');
                                var n1 = n.replace(']', '');
                                data[i].pathAr = n1.split(',').reverse();
                            }
                            else {
                                data[i].pathAr = null;
                            }
                        }

                        $scope.rollTimeNodes = data;

                    }
                    else {
                        logger.info('No data found');
                    }
                });

            }

        }
    }
})();
