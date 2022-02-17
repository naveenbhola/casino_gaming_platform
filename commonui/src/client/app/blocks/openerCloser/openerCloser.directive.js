(function () {
    'use strict';

    var app = angular.module('wdts.openerCloser');
    app.directive('openerCloser', openerCloser);

    function openerCloser() {
        var directive = {
            bindToController: true,
            controller: openerCloserController,
            controllerAs: 'vm',
            restrict: 'EA',
            scope: {
                isPrint: '=print',
                defaultSorting: '='
            },
            templateUrl: 'bower_components/wdts-common-ui/src/client/app/blocks/openerCloser/opener-closer.html'
        };

        openerCloserController.$inject = ['$rootScope', '$scope', '$state', 'gameService', 'openerCloserService', 'commonService', '$filter', 'printService'];

        function openerCloserController($rootScope, $scope, $state, gameService, openerCloserService, commonService, $filter, printService) {
            var vm = this,
                supervisorIds = {},
                dealerIds = {},
                topologyData = commonService.getAllData();

            $scope.gaminArea= true;
            $scope.pitArea = true;
            $scope.Math = window.Math;

            vm.sortObj = {
                sortField: '',
                sortOrder: ''
            };
            switch(vm.defaultSorting) {
                case 'GAMING_AREA':
                    vm.sortObj = {
                        sortField: 'GAMING_AREA',
                        sortOrder: 'ASC'
                    };
                    break;
                case 'PIT':
                    vm.sortObj = {
                        sortField: 'PIT',
                        sortOrder: 'ASC'
                    };
                    break;
                case 'TABLE_NAME':
                    vm.sortObj = {
                        sortField: 'TABLE_NAME',
                        sortOrder: 'ASC'
                    };
                    break;
            }

            activate();

            var orderBy = $filter('orderBy');

            function activate() {
                if($state.params.gaId){
                    $scope.gaminArea = false;
                }
                if($state.params.pitId){
                    $scope.pitArea = false;
                }
                $scope.selectedAll = false;
                $scope.totalRecordsCount = 0;
                $scope.start = 1;
                $scope.limitRecord = 10;
                $scope.fetchingData = false;
                $scope.allSelected = false;
                $scope.predicate = 'Table Name';
                $scope.reverse = false;
                $scope.openerCloserFilterArray = [];

                getOpenerCloser();
            }

            vm.getOpenerCloserByTable = getOpenerCloserByTable;

            vm.updatePrintOption = function(item, event){
                event.stopPropagation();
                vm.printProcess = (item.Selected && item.rolled.toLowerCase() === "no");
            };

            vm.print = print;
            vm.checkAll = function () {
                $scope.selectedAll = !$scope.selectedAll;
                let selectedCount = 0;
                vm.openerCloserData.map((item) => {
                    item.Selected = (item.rolled.toLowerCase() !== "no") ? $scope.selectedAll : false;
                    if(item.Selected){
                        ++selectedCount;
                    }
                });
                vm.printProcess = $scope.selectedAll && !selectedCount;
            };

            vm.showFilter = function () {
                $scope.filterdiv = !$scope.filterdiv;
            };

            vm.order = function (predicate) {
                $scope.predicate = predicate;
                $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
                vm.openerCloserData = orderBy(vm.openerCloserData, predicate, $scope.reverse);
            };

            vm.checkPrintPermissions = checkPrintPermissions;
            vm.appWithPrintButton = appWithPrintButton();


            vm.applyFilter = function () {
                $scope.start = 1;
                $scope.totalRecordsCount = 0;
                getOpenerCloser();
            };

            vm.clearFilter = function () {
                $scope.$broadcast('CLEAR_FILTERS', ['pitName','tableName', 'supervisor', 'dealer', 'rolled']);
                $scope.isFilterChanged = false;
                $scope.openerCloserFilterArray = [];
                vm.applyFilter();
            };

            $scope.$on('EMIT_START_LIMIT', function (event, startLimitData) {
                if (startLimitData.viewName == 'openerCloserData') {
                    $scope.start = startLimitData.startLength;
                    $scope.limitRecord = startLimitData.pageLimit;
                    getOpenerCloser();
                }
            });

            $scope.$on('SELECTED_FILTER_OBJECT', function (event, filterObj, columnName, viewName) {
                if (viewName !== 'openerCloser') {
                    return;
                }

                $scope.isFilterChanged = true;

                if (filterObj[columnName].toUpperCase() == 'ALL' || filterObj[columnName] == '') {
                    for (var i = 0; i < $scope.openerCloserFilterArray.length; i++) {
                        var keys = Object.keys($scope.openerCloserFilterArray[i]);
                        if (columnName == keys) {
                            $scope.openerCloserFilterArray.splice(i, 1);
                        }
                    }
                } else {
                    for (var i = 0; i < $scope.openerCloserFilterArray.length; i++) {

                        var keys = Object.keys($scope.openerCloserFilterArray[i]);
                        if (columnName == keys) {
                            $scope.openerCloserFilterArray.splice(i, 1);
                        }
                    }
                    var ids;
                    if (columnName === "supervisor") {
                        ids = getUserIds(supervisorIds, filterObj, columnName);
                        $scope.openerCloserFilterArray.push(ids);
                    } else if (columnName === "dealer") {
                        ids = getUserIds(dealerIds, filterObj, columnName);
                        $scope.openerCloserFilterArray.push(ids);
                    } else {
                        $scope.openerCloserFilterArray.push(filterObj);
                    }
                }

            });

            function getUserIds(nameIds, filterObj, columnName) {
                var ids = {},
                    arrIds = [];
                var arrKeys = filterObj[columnName].split(/\),\s?/);
                for (var i = 0, len = arrKeys.length; i < len; i++) {
                    var key = arrKeys[i];
                    if (i !== len - 1) {
                        key += ')';
                    }
                    arrIds.push(nameIds[key]);
                }
                ids[columnName] = arrIds.join();
                return ids;
            }

            function processFilters(filters) {
                var arrDealerNames = [],
                    arrSupervisorNames = [],
                    name,
                    dealer,
                    supervisor;

                for (var i = 0; i < filters.dealerUsers.length; i++) {
                    dealer = filters.dealerUsers[i];
                    if(dealer) {
                        name = dealer.userId == -17 ? '(Blanks)' : dealer.lastName + ", " + dealer.firstName + " (" + dealer.userId + ")";

                        arrDealerNames.push(name);
                        dealerIds[name] = dealer.userId;
                    }
                }
                filters.dealerNames = arrDealerNames;

                for (var i = 0; i < filters.supervisorUsers.length; i++) {
                    supervisor = filters.supervisorUsers[i];
                    if(supervisor) {
                        name = supervisor.userId == -17 ? '(Blanks)' : supervisor.lastName + ", " + supervisor.firstName + " (" + supervisor.userId + ")";

                        arrSupervisorNames.push(name);
                        supervisorIds[name] = supervisor.userId;
                    }
                }
                filters.supervisorNames = arrSupervisorNames;

                filters.rolled = filters.rolled.map(item => {
                    return item;
                });

                return filters;
            }

            function getOpenerCloser() {
                vm.isAvailablePrint = false;
                if($state.params.treasuryId)
                    $rootScope.siteId = commonService.getSiteIdByArg($state.params.treasuryId);

                console.log("$rootScope.siteId:::"+$rootScope.siteId);

                var topologyId = $rootScope.siteId || $state.params.pitId || $state.params.gaId || $state.params.oaId || $state.params.siteId;
                $scope.fetchingData = true;
                return openerCloserService.getOpenerCloser(topologyId, topologyData.gamingDayFromURL, $scope.start, $scope.limitRecord, $scope.openerCloserFilterArray, vm.sortObj).then(function (res) {
                    $scope.totalRecordsCount = res.headers('TotalRecords');
                    $scope.fetchingData = false;

                    vm.totalNoOfRolledTables = res.headers('TotalNoOfRolledTables');
                    vm.totalNoOfUnrolledTables = res.headers('TotalNoOfUnrolledTables');
                    vm.openerCloserData = res.data.successObj.results;
                    vm.checkAllDisable = true;
                    angular.forEach(vm.openerCloserData, function(item) {
                        if(vm.openerCloserData.length > 0){
                            if(item.rolled === 'YES'){
                                vm.checkAllDisable = false;
                            }
                        }
                    });
                    vm.filters = processFilters(res.data.successObj.filters);
                    vm.isAvailablePrint = checkPrintPermissions() && vm.openerCloserData.length > 0;

                    return vm.openerCloserData;
                });
            }

            function getOpenerCloserByTable(tableId) {
                vm.openerCloserTableData = null;
                return gameService.getOpenerCloser(tableId, topologyData.gamingDayFromURL)
                .then(function (data) {
                    vm.openerCloserTableData = data;
                });
            }

            function print() {
                vm.printProcess = true;
                var selectedTableIds = [];
                angular.forEach(vm.openerCloserData, function (item) {
                    if (item.Selected) {
                        selectedTableIds.push(item.locationId);
                    }
                });

                return openerCloserService.getOpenerCloserReportData(selectedTableIds.join(), topologyData.gamingDayFromURL)
                .then(function (data) {
                    var url = printService.getUrlrenderReport(data);

                    return printService.createIframe(url);
                })
                .then(function () {
                    vm.printProcess = false;
                });
            }

            function checkPrintPermissions() {
                return _.indexOf($rootScope.appPermissions, 'PRINT_OPENER_CLOSER') > -1 || $rootScope.decodedJwt.superuser && $rootScope.title.indexOf("Casino Manager") > -1;
            }
            function appWithPrintButton(){
                return $rootScope.decodedJwt.authorities[0].applicationCode==='CASINO_MGR'?true:false;
            }

            $scope.$on('EMIT_SORT_CHANGE', function (event, sortObj) {
                if (sortObj.viewName == 'openerCloserData') {
                    vm.sortObj.sortField = sortObj.sortField;
                    vm.sortObj.sortOrder = sortObj.sortOrder;
                    getOpenerCloser();
                }
            });
        }

        return directive;
    }
})();
