(function () {
    'use strict';

    angular.module('wdts.tableBuyIns', [])
        .directive('tableBuyIns', tableBuyIns);

    function tableBuyIns() {
        var directive = {
            bindToController: true,
            controller: BuyInsController,
            controllerAs: 'vm',
            restrict: 'EA',
            scope: {},
            templateUrl: 'bower_components/wdts-common-ui/src/client/app/blocks/tableBuyIns/tableBuyIns.html'
        };

        BuyInsController.$inject = ['$rootScope', '$scope', '$filter', '$q', '$state', 'commonService', 'cageService','configurationService'];

        function BuyInsController($rootScope, $scope, $filter, $q, $state, commonService, cageService, configurationService) {
            var vm = this;

            $scope.gamingDay = $rootScope.calendarDate || commonService.getAllData().gamingDay;
            $scope.topologyNodeId = $state.params.tableId;

            $scope.totalCount = 0;
            $scope.buyinStart = 1;
            $scope.buyinLimit = 10;
            $scope.buyInsFilterArray = [];
            $scope.fetchingData = false;
            $scope.isCBPTOn = false;

            $scope.sortObject = {
                sortField:"TIME",
                sortOrder:"DESC"
            };

            function activate() {
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
                var promises = [getBuyinsData()];
                checkCBPTStatus();
                return $q.all(promises).then(function () {});
            }

            function checkCBPTStatus() { // Change for CN1-159 : Changes in Table Dashboard when CBPT is turned off.
                configurationService.isCBPTEnabled().then(data => $scope.isCBPTOn = data);
            }

            function getBuyinsData() {
                getBuyinsFilters();
                $scope.buyMain = true;
                $scope.fetchingData = true;
                return cageService.getBuyinTransaction($scope.topologyNodeId, $scope.gamingDay, $scope.buyinStart, $scope.buyinLimit, $scope.buyInsFilterArray, $scope.sortObject).then(function (data) {
                    var successObj = data.data.successObj;
                    $scope.fetchingData = false;
                    $rootScope.buyObj = $scope.buyObj = successObj;
                    $scope.totalCount = data.headers()['totalrecords'];

                    $rootScope.buyinTotalValue = 0;

                    for (var obj in $scope.buyObj) {
                        $rootScope.buyinTotalValue += $scope.buyObj[obj].txnValue;
                    }

                    for (var i = 0; i < $scope.buyObj.length; i++) {
                        if (!$scope.buyObj[i].supervisorEmployeeNumber) {
                            $scope.buyObj[i].supervisorNameNid = $scope.buyObj[i].supervisorName;
                        } else {
                            $scope.buyObj[i].supervisorNameNid = $scope.buyObj[i].supervisorName +
                                " " + " (" + $scope.buyObj[i].supervisorEmployeeNumber + ")";
                        }

                        if (!$scope.buyObj[i].dealerId) {
                            $scope.buyObj[i].dealerNameNid = $scope.buyObj[i].dealerName;
                        } else {
                            $scope.buyObj[i].dealerNameNid = $scope.buyObj[i].dealerName +
                                " " + " (" + $scope.buyObj[i].dealerEmployeeNumber + ")";
                        }
                    }

                    return data;
                });
            }

            function getBuyinsFilters() {
                return cageService.getTransactionFilters($scope.topologyNodeId, $scope.gamingDay, 'BUYIN').then(function (data) {
                    var filters = data;
                    filters.supervisorsList = commonService.getFilterArray(data.supervisors);
                    filters.dealersList = commonService.getFilterArray(data.dealers);
                    filters.playerNames = data.playerNames;
                    // for (var i = 0; i < data.playerIds.length; i++) {
                    //     filters.playersList.push({
                    //         name: data.playerNames[i],
                    //         filterValue: data.playerNames[i]
                    //     });
                    // }
                    filters.playerIds = data.playerIds;
                    $scope.buyinFilterObj = filters;
                    $scope.showFiltersFlagBuyins = true;
                    return data;
                });
            }

            vm.buyDrillIn = function (uuid, id) {
                $scope.buyMain = false;
                $scope.Buyinid = id;

                return cageService.getBuyinDrill(uuid).then(function (data) {
                    var playerOwned = data.playerOwned;
                    var totalCoins = 0;
                    for (var obj in playerOwned.byChipset) {
                        var totalChipsetCoins = 0;
                        for (var denom in playerOwned.byChipset[obj].byDenom) {
                            totalCoins += playerOwned.byChipset[obj].byDenom[denom].count;
                            totalChipsetCoins += playerOwned.byChipset[obj].byDenom[denom].count;
                        }
                        playerOwned.byChipset[obj].totalChipsetCoins = totalChipsetCoins;
                    }
                    $scope.totalCoins = totalCoins;
                    $scope.buyinDrillObj = data;
                    $scope.drillInData = {
                        modalId: 'buyins-detail-modal',
                        fillid: id,
                        translateTitle: 'application.app.TABLE_DASH_LABELS.BUYINS.COLHEADERS.BUYIN_ID',
                        transType: 'BUY IN',
                        totalCoins: totalCoins,
                        totalChipValue: playerOwned.total,
                        enrolledChips: playerOwned
                    };

                    return data;
                });
            };

            vm.showBuyinFilter = function () {
                $scope.buyinfilterdiv = !$scope.buyinfilterdiv;
            };


            $scope.$on('EMIT_START_LIMIT', function (event, startLimitData) {
                if (startLimitData.viewName == 'buyin') {
                    $scope.buyinStart = startLimitData.startLength;
                    $scope.buyinLimit = startLimitData.pageLimit;
                    getBuyinsData();
                }
            });

            $scope.$on('EMIT_SORT_CHANGE', function(event, sortObject){
                if(sortObject.viewName == 'buyIns'){
                    $scope.sortObject.sortField = sortObject.sortField;
                    $scope.sortObject.sortOrder = sortObject.sortOrder;
                    getBuyinsData();
                }
            });

            //*Recieve Broadcast Message from common/filter service and update the object bind to the UI
            $scope.$on('FILTER_DATA_UPDATED', function (event, data) {
                if (commonService.getfilteredObjName() == "buyObj") {
                    $scope.buyObj = commonService.getTableData();
                }
            });

            angular.element(document).ready(function () {
                activate();
            });


            //Recieve Broadcast Message from pagination directive and update the object bind to the UI*//
            $scope.$on('SELECTED_FILTER_OBJECT', function (event, filterObj, columnName, viewName) {
                if (viewName == 'buyInsData') {
                    $scope.buyInsUpdated = true;
                    var keys;
                    if (filterObj[columnName].toUpperCase() == 'ALL') {
                        for (var i = 0; i < $scope.buyInsFilterArray.length; i++) {
                            keys = Object.keys($scope.buyInsFilterArray[i]);
                            if (columnName == keys) {
                                $scope.buyInsFilterArray.splice(i, 1);
                            }
                        }
                    } else {
                        for (var j = 0; j < $scope.buyInsFilterArray.length; j++) {
                            keys = Object.keys($scope.buyInsFilterArray[j], columnName);
                            if (columnName == keys) {
                                $scope.buyInsFilterArray.splice(j, 1);
                            }
                        }
                        $scope.buyInsFilterArray.push(filterObj);
                    }
                }
            });

            $scope.applyBuyInsFilter = function () {
                $scope.totalCount = 0;
                $scope.buyinStart = 1;
                getBuyinsData();
            };

            $scope.clearBuyInsFilter = function () {
                $scope.$broadcast('CLEAR_FILTERS', ['supervisorIds', 'dealerIds', 'playerTypes', 'casinoPlayerIds', 'playerNames']);
                $scope.buyInsFilterArray = [];
                $scope.buyInsUpdated = false;
                $scope.applyBuyInsFilter();
            };
        }

        return directive;
    }

})();