(function () {
    'use strict';

    var app = angular.module('wdts.chipTray', []);
    app.directive('chipTray', ['$rootScope', '$filter', '$state', '$stateParams', 'commonService', 'cageService', 'overviewService', chipTray]);


    function chipTray($rootScope, $filter, $state, $stateParams, commonService, cageService, overviewService) {
        return {
            restrict: 'E',
            templateUrl: 'bower_components/wdts-common-ui/src/client/app/blocks/chipTray/chipTray.html',
            link: chipTrayLink
        };

        function chipTrayLink($scope, element, attrs) {

            var orderBy = $filter('orderBy');
            var chipTrayFilterArray = {};

            function init() {
                initScopeItems();
                bindEvents();
            }

            function initScopeItems() {
                $scope.tableId = $state.params.tableId;
                $scope.totalCount = 0;
                $scope.chipTrayDataStart = 1;
                $scope.chipTrayDataLimit = 10;
                $scope.fetchingData = false;
                $scope.tableActive = true;
                $scope.sortObj = {
                    sortField: 'TIME',
                    sortOrder: 'DESC'
                };
                // $scope.gamingDay = $rootScope.gamingDayFromURL || $rootScope.calendarDate;
                //$scope.gamingDay = $rootScope.calendarDate || $rootScope.gamingDayFromURL;
                overviewService.getCurrentGamingDay($scope.tableId).then(function(gdata){
                    $scope.gamingDay = $rootScope.gamingDayFromURL2 || gdata.successObj.split('T');
                    activate();
                });
            }

            function bindEvents() {
                //*Recieve Broadcast Message from common/filter service and update the object bind to the UI
                var filterDataEvt = $scope.$on('FILTER_DATA_UPDATED', function (event, data) {
                    if (commonService.getfilteredObjName() === "chipTrayData") {
                        $scope.chipTrayData = commonService.getTableData();

                    }
                });
                //Recieve Broadcast Message from common/filter service and update the object bind to the UI*//

                //*Recieve Broadcast Message from pagination directive and update the object bind to the UI
                var emitStartEvt = $scope.$on('EMIT_START_LIMIT', function (event, startLimitData) {
                    if (startLimitData.viewName === 'chipTrayData') {
                        $scope.chipTrayDataStart = startLimitData.startLength;
                        $scope.chipTrayDataLimit = startLimitData.pageLimit;
                        getChiptrayData();
                    }
                });
                //Recieve Broadcast Message from pagination directive and update the object bind to the UI*//

                var selectedFilterEvt = $scope.$on('SELECTED_FILTER_OBJECT', function (event, filterObj, columnName, viewName) {
                    if (viewName === 'chipTrayData') {
                        chipTrayFilterArray = filterObj[columnName].toUpperCase() !== 'ALL' ? filterObj : {};
                    }
                });

                var sortChanged = $scope.$on('EMIT_SORT_CHANGE', function (event, sortObj) {
                    if (sortObj.viewName === 'chipTray') {
                        $scope.sortObj.sortField = sortObj.sortField;
                        $scope.sortObj.sortOrder = sortObj.sortOrder;
                        getChiptrayData();
                    }
                });

                $scope.$on("$destroy", filterDataEvt);
                $scope.$on("$destroy", emitStartEvt);
                $scope.$on("$destroy", selectedFilterEvt);
                $scope.$on("$destroy", sortChanged);
            }


            function activate() {
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
                checkIsTableActive();
                getChiptrayData();
            }

            function getChiptrayData() {
                $scope.chiptrayMain = true;
                $scope.fetchingData = true;
                return cageService.getChipTrayData($scope.tableId, $scope.gamingDay, $scope.chipTrayDataStart, $scope.chipTrayDataLimit, chipTrayFilterArray, $scope.sortObj).then(function (data) {
                    $scope.fetchingData = false;
                    $scope.chipTrayData = data.data.ChipTrayScanList;
                    $scope.chiptrayFilterObj = data.data.Filters;
                    // var index = $scope.chiptrayFilterObj.scanType.indexOf("BUYIN");
                    // if (index !== -1) {
                    //     $scope.chiptrayFilterObj.scanType[index] = "BUY IN";
                    // }
                    $scope.totalCount = parseInt(data.headers()['totalrecords']);
                    if ($scope.chipTrayData.length > 0 && $scope.chipTrayData !== null) {
                        $rootScope.ctTotalValue = 0;
                        $rootScope.ctVarianceValue = 0;
                        for (var obj in $scope.chipTrayData) {
                            $rootScope.ctTotalValue = $scope.chipTrayData[0].totalTrayValue;
                            $rootScope.ctVarianceValue = $scope.chipTrayData[0].totalVarianceAmount;
                        }
                    }
                    $scope.showFiltersFlag3 = true;
                    return data;
                });
            }

            function activateOpenerCloser() {
                $state.go('tabledashboard.game.opener-closer', {'tableId': $scope.tableId});
            }

            function checkIsTableActive() {
                overviewService.getTableInactiveStatus($state.params.tableId).then(function (data) {
                    $scope.tableActive = (data[0].status !== "INACTIVE");
                });
            }

            $scope.getChipTrayScan = function (cage) {
                var totalCoins = 0,
                    totalChipsetCoins = 0;


                $scope.chiptrayMain = false;
                $scope.transType = cage.scanType;

                if ($scope.transType === "BUYIN") {
                    $scope.transType = "BUY IN"
                }

                $scope.chiptableID = cage.chipTrayScanId;
                cageService.getChipTrayScanDetails(cage.chipTrayScanId).then(function (data) {
                    $scope.enrolledChips = data.enrolled;


                    $scope.totalChipValue = data.playerOwned.total;

                    for (var obj in data.enrolled.byChipset) {
                        totalChipsetCoins = 0;
                        for (var denom in data.enrolled.byChipset[obj].byDenom) {
                            totalCoins += data.enrolled.byChipset[obj].byDenom[denom].count;
                            totalChipsetCoins += data.enrolled.byChipset[obj].byDenom[denom].count;
                        }
                        data.enrolled.byChipset[obj].totalChipsetCoins = totalChipsetCoins;
                    }
                    $scope.totalCoins = totalCoins;
                    $scope.totalChipValue = data.enrolled.total;
                });
                $("#chiptray-detail-modal").modal("show");
            };

            $scope.orderChipTray = function (predicate) {
                $scope.predicate = predicate;
                $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
                $scope.chipTrayData = orderBy($scope.chipTrayData, predicate, $scope.reverse);
            };

            $scope.showChipTrayFilter = function () {
                $scope.chiptraydiv = !$scope.chiptraydiv;
            };

            $scope.sorterFunc = function (denom) {
                return parseInt(-denom.denom);
            };

            $scope.applyChiptrayFilter = function () {
                $scope.totalCount = 0;
                $scope.chipTrayDataStart = 1;
                getChiptrayData();
            };

            $scope.clearChiptrayFilter = function () {
                $scope.$broadcast('CLEAR_FILTERS', ['scanType']);
                chipTrayFilterArray = {};
                $scope.applyChiptrayFilter();
            };
            $scope.isChipFilterEmpty = function(){
                return !Object.keys(chipTrayFilterArray).length;
            };

            /** adding opener/closer tab **/
            $scope.activateOpenerCloser = activateOpenerCloser;

            //Initialize directive items called from init
            init();
        }
    }
})();