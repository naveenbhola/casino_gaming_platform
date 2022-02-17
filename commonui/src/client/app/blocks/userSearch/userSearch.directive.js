(function () {
    'use strict';

    angular
        .module('wdts.userSearch',[])
        .directive('userSearch', userSearch);

    /* @ngInject */

    function userSearch() {
        return {
            bindToController: true,
            controller: userSearchController,
            controllerAs: 'vm',
            restrict: 'EA',
            scope: {
                jwtName : '='
            },
            templateUrl: function (elem, attr) {
                return 'bower_components/wdts-common-ui/src/client/app/blocks/userSearch/userSearch.html';
            }
        };

        userSearchController.$inject = ['$scope', 'logger', '$rootScope', 'overviewService', 'commonService', 'store', 'jwtHelper', 'config','$translate'];

        /* @ngInject */
        function userSearchController($scope, logger, $rootScope, overviewService, commonService, store, jwtHelper, config,$translate) {
            var vm = this;

            $scope.userDefault = true;
            $scope.userByUsername = false;
            $scope.userByUserID = false;
            $scope.userSearchResults = [];
            $scope.count = 0;
            $scope.userError = false;

            $scope.user = {
                userId:'',
                userFirstName:'',
                userLastName:'',
                username:''
            };

            $scope.userType = 'DEALER';

            $scope.changeUserType = function(arg){
                $scope.userType = arg;
            };

            $scope.resetUserHTML = function(){
                $scope.userDefault = false;
                $scope.userByUsername = false;
                $scope.userByUserID = false;

                $scope.user = {
                    userId:'',
                    userFirstName:'',
                    userLastName:'',
                    username:''
                };
            };

            vm.showUserView = function(){
                $scope.resetUserHTML();
                $scope.userDefault = true;
            };

            vm.showUserView2 = function(){
                $scope.resetUserHTML();
                $scope.userByUsername = true;
            };

            vm.showUserView3 = function(){
                $scope.resetUserHTML();
                $scope.userByUserID = true;
            };

            var searchuserClickedFL = false;
            vm.searchUserByUserFLName = function() {
                if (!searchuserClickedFL)
                {
                    $scope.userSearchResults = [];
                    $scope.uniqueUsers = [];
                    $scope.userMap = new Map();

                    $scope.usearchgfl = true;
                    searchuserClickedFL = true;
                    var auth = 'Bearer ' + store.get(vm.jwtName);
                    if($scope.user.userFirstName != '' || $scope.user.userLastName != ''){
                        overviewService.getUsersByFLName($scope.user.userFirstName, $scope.user.userLastName, $scope.userType, auth).then(function (data) {
                            $scope.usearchgfl = false;
                            searchuserClickedFL = false;
                            var array = data;
                            if (array != null) {
                                for (var i = 0; i < array.length; i++) {
                                    if ($scope.uniqueUsers.indexOf(array[i].userName) == -1) {
                                        $scope.uniqueUsers.push(array[i].userName);
                                        $scope.userMap.set(array[i].userName, array[i]);

                                    }
                                    else {
                                        if (array[i].type == 'login') {
                                            $scope.userMap.delete(array[i].userName);
                                            $scope.userMap.set(array[i].userName, array[i]);
                                        }
                                        else if (array[i].type == 'logout') {
                                            $scope.userMap.delete(array[i].userName);
                                        }
                                    }
                                }
                                $scope.userMap.forEach(function (value, key) {
                                    $scope.userSearchResults.push(value);
                                });
                                if($scope.userSearchResults.length === 0 ){
                                    logger.info($translate.instant('application.app.common.labels.TOPNAV.USER_NOT_FOUND'));
                                }
                            }
                            else {
                                logger.info($translate.instant('application.app.common.labels.TOPNAV.USER_NOT_FOUND'));
                            }

                        }, function () {
                            $scope.usearchgfl = false;
                            searchuserClickedFL = false;
                        });
                    }

                }

            };
            var searchbyuserclicked = false;
            vm.searchUserByUserName = function(){
                if (!searchbyuserclicked) {
                    if ($scope.user.username != '') {
                        searchbyuserclicked = true;
                        $scope.usearchname = true;
                        $scope.userSearchResults = [];

                        var auth = 'Bearer ' + store.get(vm.jwtName);
                        overviewService.getUserByUserName($scope.user.username, $scope.userType, auth).then(function (data) {
                            searchbyuserclicked = false;
                            $scope.usearchname = false;
                            var array = data;
                            if (array != null) {
                                console.log('array not null');
                                if (array[array.length - 1].type === 'login') {
                                    $scope.userSearchResults.push(array[array.length - 1]);
                                }

                                if($scope.userSearchResults.length === 0 ){
                                    logger.info($translate.instant('application.app.common.labels.TOPNAV.USER_NOT_FOUND'));
                                }
                            }
                            else {
                                logger.info($translate.instant('application.app.common.labels.TOPNAV.USER_NOT_FOUND'));
                            }

                        }, function () {
                            searchbyuserclicked = false;
                            $scope.usearchname = false;
                        });
                    }
                }
            };
            var searchbyuseridclicked = false;
            vm.searchUserByUserID = function() {
                if (!searchbyuseridclicked) {
                    if ($scope.user.employeeId != '') {
                        searchbyuseridclicked = true;
                        $scope.usearchid = true;
                        $scope.userSearchResults = [];

                        var auth = 'Bearer ' + store.get(vm.jwtName);
                        overviewService.getUsersById($scope.user.employeeId, $scope.userType, auth).then(function (data) {
                            searchbyuseridclicked = false;
                            $scope.usearchid = false;
                            var array = data;
                            if (array != null) {
                                if (array[array.length - 1].type == 'login') {
                                    $scope.userSearchResults.push(array[array.length - 1]);
                                }
                                if($scope.userSearchResults.length === 0 ){
                                    logger.info($translate.instant('application.app.common.labels.TOPNAV.USER_NOT_FOUND'));
                                }
                            }
                            else {
                                logger.info($translate.instant('application.app.common.labels.TOPNAV.USER_NOT_FOUND'));
                            }
                        }, function () {
                            searchbyuseridclicked = false;
                            $scope.usearchid = false;
                        });
                    }
                }
            };

        }
    }
})();
