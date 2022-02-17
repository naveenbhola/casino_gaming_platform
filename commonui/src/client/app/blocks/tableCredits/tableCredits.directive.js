(function () {
    'use strict';

    angular.module('wdts.tableCredits', [])
        .directive('tableCredits', tableCredits);

    function tableCredits() {
        var directive = {
            bindToController: true,
            controller: CreditsController,
            controllerAs: 'vm',
            restrict: 'EA',
            scope: {},
            templateUrl: 'bower_components/wdts-common-ui/src/client/app/blocks/tableCredits/tableCredits.html'
        };

        CreditsController.$inject = ['$rootScope', '$scope', '$filter', '$q', '$state', 'commonService', 'cageService'];

        function CreditsController($rootScope, $scope, $filter, $q, $state, commonService, cageService) {
            var vm = this;

            $scope.gamingDay = $rootScope.calendarDate || commonService.getAllData().gamingDay;
            $scope.topologyNodeId = $state.params.tableId;
            $scope.tableId = $state.params.tableId;

            $scope.totalCount = 0;
            $scope.creditsStart = 1;
            $scope.creditsLimit = 10;
            $scope.fetchingData = false;

            $scope.creditsFilterArray = [];

            $scope.sortObject = {
                sortField:"TIME",
                sortOrder:"DESC"
            };

            function activate() {
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
                var promises = [getCreditsData()];
                return $q.all(promises).then(function () {
                });
            }

            function getCreditsData() {
                getCreditsFilters();
                $scope.fetchingData = true;
                $scope.creditMain = true;
                return cageService.getCreditTransaction($scope.topologyNodeId, $scope.gamingDay, $scope.creditsStart, $scope.creditsLimit, $scope.creditsFilterArray, $scope.sortObject).then(function (data) {
                    var successObj = data.data.successObj;
                    $scope.fetchingData = false;
                    $rootScope.creditObj = $scope.creditObj = successObj;
                    //$scope.creditsFilterObj = successObj.tableTransactionFilters;
                    $scope.totalCount = data.headers()['totalrecords'];


                    $rootScope.creditTotalValue = 0;

                    for (var obj in $scope.creditObj) {
                        $rootScope.creditTotalValue += $scope.creditObj[obj].txnValue;
                    }

                    for (var i = 0; i < $scope.creditObj.length; i++) {
                        if($scope.creditObj[i].supervisorEmployeeNumber) {
                            $scope.creditObj[i].supervisorNameNid = $scope.creditObj[i].supervisorName + " " + " (" + $scope.creditObj[i].supervisorEmployeeNumber + ")";
                        }else{
                            updateNullVal('creditObj['+i+'].supervisorId', 'creditObj['+i+'].supervisorNameNid', 'creditObj['+i+'].supervisorName');
                        }
                        if($scope.creditObj[i].dealerEmployeeNumber){
                            $scope.creditObj[i].dealerNameNid = $scope.creditObj[i].dealerName + " " + " (" + $scope.creditObj[i].dealerEmployeeNumber + ")";
                        }else{
                            updateNullVal('creditObj['+i+'].dealerId', 'creditObj['+i+'].dealerNameNid', 'creditObj['+i+'].dealerName');
                        }
                    }
                    return data;
                });
            }

            function updateNullVal(keyId, keyNid, keyName, num){
                if (!$scope[keyId]) {
                    $scope[keyId] = '';
                    $scope[keyNid] = $scope[keyName];
                }
            }

            function getCreditsFilters(){
                return cageService.getTransactionFilters($scope.topologyNodeId, $scope.gamingDay, 'CREDIT').then(function (data) {
                    var filters = data;
                    filters.supervisorsList = commonService.getFilterArray(data.supervisors);
                    filters.dealersList = commonService.getFilterArray(data.dealers);
                    $scope.creditsFilterObj = filters;
                    $scope.showFiltersFlagCredits = true;
                    return data;
                });
            }

            vm.creditDrillIn = function (uuid, id) {
                $scope.creditMain = false;
                $scope.Creditid = id;
                return cageService.getCreditDrill(uuid).then(function (data) {
                    var casinoOwned = data.casinoOwned;
                    var totalCoins = 0;
                    for (var obj in casinoOwned.byChipset) {
                        var totalChipsetCoins = 0;
                        for (var denom in casinoOwned.byChipset[obj].byDenom) {
                            totalCoins += casinoOwned.byChipset[obj].byDenom[denom].count;
                            totalChipsetCoins += casinoOwned.byChipset[obj].byDenom[denom].count;
                        }
                        casinoOwned.byChipset[obj].totalChipsetCoins = totalChipsetCoins;

                    }
                    $scope.totalCoins = totalCoins;
                    $scope.creditDrillObj = data;
                    $scope.drillInData = {
                        modalId: 'credits-detail-modal',
                        fillid: id,
                        translateTitle: 'application.app.TABLE_DASH_LABELS.CREDITS.CREDITS_DETAIL.CREDIT_ID',
                        transType: 'CREDIT',
                        totalCoins: totalCoins,
                        totalChipValue: casinoOwned.total,
                        enrolledChips: casinoOwned
                    };

                    return data;
                });
            };

            vm.showCreditFilter = function () {
                $scope.creditfilterdiv = !$scope.creditfilterdiv;
            };



            $scope.$on('EMIT_START_LIMIT', function (event, startLimitData) {
                if (startLimitData.viewName == 'credits') {
                    $scope.creditsStart = startLimitData.startLength;
                    $scope.creditsLimit = startLimitData.pageLimit;
                    getCreditsData();
                }
            });


            $scope.$on('EMIT_SORT_CHANGE', function(event, sortObject){
                if(sortObject.viewName == 'credits'){
                    $scope.sortObject.sortField = sortObject.sortField;
                    $scope.sortObject.sortOrder = sortObject.sortOrder;
                    getCreditsData();
                }
            });

            //*Recieve Broadcast Message from common/filter service and update the object bind to the UI
            $scope.$on('FILTER_DATA_UPDATED', function (event, data) {
                if (commonService.getfilteredObjName() == "creditObj") {
                    $scope.creditObj = commonService.getTableData();
                }
            });


            angular.element(document).ready(function () {
                activate();
            });

            //Recieve Broadcast Message from pagination directive and update the object bind to the UI*//
            $scope.$on('SELECTED_FILTER_OBJECT', function (event, filterObj, columnName, viewName) {
                if (viewName == 'creditsTabData') {
                    var keys, i;
                    $scope.creditsUpdated = true;
                    if (filterObj[columnName].toUpperCase() == 'ALL') {
                        for (i = 0; i < $scope.creditsFilterArray.length; i++) {
                            keys = Object.keys($scope.creditsFilterArray[i]);
                            if (columnName == keys) {
                                $scope.creditsFilterArray.splice(i, 1);
                            }
                        }
                    } else {
                        for (i = 0; i < $scope.creditsFilterArray.length; i++) {
                            keys = Object.keys($scope.creditsFilterArray[i], columnName);
                            if (columnName == keys) {
                                $scope.creditsFilterArray.splice(i, 1);
                            }
                        }
                        $scope.creditsFilterArray.push(filterObj);
                    }
                }
            });

            $scope.applyCreditsFilter = function () {
                $scope.totalCount = 0;
                $scope.creditsStart = 1;
                getCreditsData();
            };

            $scope.clearCreditsFilter = function () {
                $scope.$broadcast('CLEAR_FILTERS', ['supervisorIds', 'dealerIds']);
                $scope.creditsFilterArray = [];
                $scope.creditsUpdated = false;
                $scope.applyCreditsFilter();
            };

        }

        return directive;
    }

})();