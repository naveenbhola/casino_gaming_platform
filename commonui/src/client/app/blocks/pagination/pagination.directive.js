(function () {
    'use strict';

    angular
        .module('wdts.pagination',[])
        .directive('pagination', pagination);

    /* @ngInject */

    function pagination() {
        return {
            bindToController: true,
            controller: paginationController,
            controllerAs: 'vm',
            restrict: 'EA',
            scope: {
                'totalRecords': '=',
                'viewName': '='
            },
            templateUrl: function (elem, attr) {
                return 'bower_components/wdts-common-ui/src/client/app/blocks/pagination/pagination.html';
            }
        };

        /* @ngInject */
        function paginationController($scope, logger) {
            var vm = this;
            var $destroyWatch = $scope.$watch('vm.totalRecords', init);

            $scope.$on('$destroy', $destroyWatch);

            vm.nextPage = nextPage;
            vm.previousPage = previousPage;
            vm.firstPage = firstPage;
            vm.lastPage = lastPage;
            vm.goToAnyPage = goToAnyPage;
            vm.changePageLimit = changePageLimit;
            vm.emitStartLimit = emitStartLimit;

            function init() {
                if(angular.version.minor < 3){
                    vm.totalRecords = $scope.totalRecords;
                    vm.viewName = $scope.viewName;
                }

                $scope.startLength = 1;
                $scope.pageLimit = 10;
                $scope.currntPage = 1;

                if (!vm.totalRecords) {
                    $scope.totalPage = 1;
                } else {
                    $scope.totalPage = Math.ceil(vm.totalRecords / $scope.pageLimit);
                    $destroyWatch();
                }
            }

            function nextPage(){
                $scope.startLength = $scope.startLength + $scope.pageLimit;
                $scope.currntPage = $scope.currntPage + 1;
                vm.emitStartLimit();
            }

            function previousPage(){
                $scope.startLength = $scope.startLength - $scope.pageLimit;
                $scope.currntPage = $scope.currntPage - 1;
                vm.emitStartLimit();
            }

            function firstPage(){
                $scope.startLength = 1;
                $scope.currntPage = 1;
                vm.emitStartLimit();
            }

            function lastPage(){
                $scope.startLength = (Math.ceil(vm.totalRecords / $scope.pageLimit)-1) * $scope.pageLimit + 1 ;
                $scope.currntPage = Math.ceil(vm.totalRecords / $scope.pageLimit);
                vm.emitStartLimit();
            }

            function goToAnyPage(event, currntPage){

                if(event.type == 'keydown' && event.keyCode == 13){
                    if($scope.currntPage > $scope.totalPage ){
                        //logger.warn("Page can't be more than total page.");
                        $scope.startLength = ($scope.totalPage - 1) * $scope.pageLimit + 1 ;
                        $scope.currntPage = $scope.totalPage;
                        vm.emitStartLimit();
                    }else{
                        if(currntPage > 0){
                            $scope.startLength = ($scope.currntPage - 1) * $scope.pageLimit + 1 ;
                            $scope.currntPage = parseInt(currntPage);
                        }else{
                            $scope.startLength = 1 ;
                            $scope.currntPage = 1;
                        }
                        vm.emitStartLimit();
                    }
                }else if(event.type == 'blur'){
                    if($scope.currntPage > $scope.totalPage ){
                        //logger.warn("Page can't be more than total page.");
                        $scope.startLength = ($scope.totalPage - 1) * $scope.pageLimit + 1 ;
                        $scope.currntPage = $scope.totalPage;
                        vm.emitStartLimit();
                    }else{
                        if(currntPage > 0){
                            $scope.startLength = ($scope.currntPage - 1) * $scope.pageLimit + 1 ;
                            $scope.currntPage = parseInt(currntPage);
                        }else{
                            $scope.startLength = 1 ;
                            $scope.currntPage = 1;
                        }
                        vm.emitStartLimit();
                    }
                }
            }

            function changePageLimit(limit){
                $scope.pageLimit = limit;
                $scope.currntPage = 1;
                $scope.startLength = 1;
                $scope.totalPage = Math.ceil(vm.totalRecords / $scope.pageLimit);
                vm.emitStartLimit();
            }

            function emitStartLimit(){
                //added ,currentPage:$scope.currntPage for alert app CCAS-11041 to resolve.
                $scope.$emit('EMIT_START_LIMIT',{startLength: $scope.startLength, pageLimit: $scope.pageLimit,viewName: vm.viewName,currentPage:$scope.currntPage });
            }

        }
    }
})();
