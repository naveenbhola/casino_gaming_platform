(function () {
    'use strict';

    angular.module('wdts.tableFills', [
        'wdts.drillInPopup'
    ]).directive('tableFills', tableFills);

    function tableFills() {
        var directive = {
            bindToController: true,
            controller: FillsController,
            controllerAs: 'vm',
            restrict: 'EA',
            scope: {},
            templateUrl: 'bower_components/wdts-common-ui/src/client/app/blocks/tableFills/tableFills.html'
        };

        FillsController.$inject = ['$rootScope', '$scope', '$filter', '$q', '$state', 'commonService', 'cageService'];

        function FillsController($rootScope, $scope, $filter, $q, $state, commonService, cageService) {
            var vm = this;
            var orderBy = $filter('orderBy');

            $scope.gamingDay = $rootScope.calendarDate || commonService.getAllData().gamingDay;
            $scope.topologyNodeId = $state.params.tableId;
            $scope.tableId = $state.params.tableId;

            $scope.totalCount = 0;
            $scope.fillsStart = 1;
            $scope.fillsLimit = 10;
            $scope.fetchingData = false;

            $scope.fillsFilterArray = [];
            $scope.sortObject = {
                sortField:"TIME",
                sortOrder:"DESC"
            };


            function activate() {
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
                var promises = [getFillsData()];
                return $q.all(promises).then(function () {
                });
            }

            function getFillsData() {
                getFillsFilters();
                $scope.fillMain = true;
                $scope.fetchingData = true;
                return cageService.getFillTransaction($scope.topologyNodeId, $scope.gamingDay, $scope.fillsStart, $scope.fillsLimit, $scope.fillsFilterArray, $scope.sortObject).then(function (data) {
                    var successObj = data.data.successObj;
                    $scope.fetchingData = false;
                    $rootScope.fillObj = $scope.fillObj = successObj;
                    $scope.totalCount = data.headers()['totalrecords'];

                    $rootScope.fillsTotalValue = 0;

                    for (var obj in $scope.fillObj) {
                        $rootScope.fillsTotalValue += $scope.fillObj[obj].txnValue;
                    }

                    for (var i = 0; i < $scope.fillObj.length; i++) {
                        if ($scope.fillObj[i].supervisorId) {
                            $scope.fillObj[i].supervisorNameNid = $scope.fillObj[i].supervisorName + " " + " (" + $scope.fillObj[i].supervisorEmployeeNumber + ")";
                        } else {
                            $scope.fillObj[i].supervisorNameNid = '';
                        }

                        if (!$scope.fillObj[i].dealerName) {
                            $scope.fillObj[i].dealerName = '';
                        }
                        if (!$scope.fillObj[i].dealerId) {
                            $scope.fillObj[i].dealerId = '';
                            $scope.fillObj[i].dealerNameNid = $scope.fillObj[i].dealerName;
                        }
                        else {
                            $scope.fillObj[i].dealerNameNid = $scope.fillObj[i].dealerName + " " + " (" + $scope.fillObj[i].dealerEmployeeNumber + ")";
                        }
                    }
                    return data;
                });
            }


            function getFillsFilters() {
                return cageService.getTransactionFilters($scope.topologyNodeId, $scope.gamingDay, 'FILL').then(function (data) {
                    var filters = data;
                    filters.supervisorsList = commonService.getFilterArray(data.supervisors);
                    filters.dealersList = commonService.getFilterArray(data.dealers);
                    $scope.fillFilterObj = filters;
                    $scope.showFiltersFlagFills = true;
                    return data;
                });
            }

            vm.fillDrillIn = function (uuid, id) {
                $scope.fillid = id;
                return cageService.getFillDrill(uuid).then(function (data) {
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
                    $scope.fillDrillObj = data;
                    $scope.fillMain = false;
                    $scope.drillInData = {
                        modalId: 'fills-detail-modal',
                        fillid: id,
                        translateTitle: 'application.app.TABLE_DASH_LABELS.FILLS.FILLS_DETAIL.FILLS_ID',
                        transType: 'FILL',
                        totalCoins: totalCoins,
                        totalChipValue: casinoOwned.total,
                        enrolledChips: casinoOwned
                    };
                    return data;
                });
            };

            vm.showFillsFilter = function () {
                $scope.fillsfilterdiv = !$scope.fillsfilterdiv;
            };

            vm.orderFills = function (predicate) {
                $scope.predicate = predicate;
                $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
                $scope.fillObj = orderBy($scope.fillObj, predicate, $scope.reverse);
                console.log("after--" + JSON.stringify($scope.fillObj));
            };


            $scope.$on('EMIT_START_LIMIT', function (event, startLimitData) {
                if (startLimitData.viewName == 'fills') {
                    $scope.fillsStart = startLimitData.startLength;
                    $scope.fillsLimit = startLimitData.pageLimit;
                    getFillsData();
                }
            });

            //*Recieve Broadcast Message from common/filter service and update the object bind to the UI
            $scope.$on('FILTER_DATA_UPDATED', function (event, data) {
                if (commonService.getfilteredObjName() == "fillObj") {
                    $scope.fillObj = commonService.getTableData();
                }
            });
            $scope.$on('EMIT_SORT_CHANGE', function(event, sortObject){
                if(sortObject.viewName == 'fills'){
                    $scope.sortObject.sortField = sortObject.sortField;
                    $scope.sortObject.sortOrder = sortObject.sortOrder;
                    getFillsData();
                }
            });

            angular.element(document).ready(function () {
                activate();
            });

            //Recieve Broadcast Message from pagination directive and update the object bind to the UI*//
            $scope.$on('SELECTED_FILTER_OBJECT', function (event, filterObj, columnName, viewName) {
                if (viewName == 'fillsTabData') {
                    var keys;
                    $scope.fillsUpdated = true;
                    if (filterObj[columnName].toUpperCase() == 'ALL') {
                        for (var i = 0; i < $scope.fillsFilterArray.length; i++) {
                            keys = Object.keys($scope.fillsFilterArray[i]);
                            if (columnName == keys) {
                                $scope.fillsFilterArray.splice(i, 1);
                            }
                        }
                    } else {
                        for (var j = 0; j < $scope.fillsFilterArray.length; j++) {
                            keys = Object.keys($scope.fillsFilterArray[j], columnName);
                            if (columnName == keys) {
                                $scope.fillsFilterArray.splice(j, 1);
                            }
                        }
                        $scope.fillsFilterArray.push(filterObj);
                    }
                }
            });

            $scope.applyFillsFilter = function () {
                $scope.totalCount = 0;
                $scope.fillsStart = 1;
                getFillsData();
            };

            $scope.clearFillsFilter = function () {
                $scope.$broadcast('CLEAR_FILTERS', ['supervisorIds', 'dealerIds']);
                $scope.fillsFilterArray = [];
                $scope.fillsUpdated = false;
                $scope.applyFillsFilter();
            };
        }

        return directive;
    }

})();