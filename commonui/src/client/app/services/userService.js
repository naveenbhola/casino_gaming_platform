/**
 * Created by ssaluja on 5/1/16.
 */
(function () {
    'use strict';

    angular
        .module('wdts.commonui.services')
        .factory('userService', userService);

    userService.$inject = ['$http', 'config', 'exception', '$translate','$q','logger'];

    function userService($http, config, exception, $translate,$q,logger) {
        var service = {
            getUsers: getUsers,
            getUserDetails: getUserDetails,
            createNewUsers: createNewUsers,
            editUser: editUser,
            enabledDisableUserStatus: enabledDisableUserStatus,
            getUserApplications: getUserApplications,
            getUsersByTopologyGroups: getUsersByTopologyGroups,
            getAssignedRolesAppList: getAssignedRolesAppList,
            getUserNameFromJWT : getUserNameFromJWT,
            setFavoriteApp:setFavoriteApp,
            getRoles: getRoles,
            getActiveRoles: getActiveRoles,
            getInactiveRoles: getInactiveRoles,
            getRoleDetails:getRoleDetails,
            getPermissions:getPermissions,
            createUsersRoles:createUsersRoles,
            editRole:editRole,
            enabledDisableRoleStatus:enabledDisableRoleStatus
        };

        return service;

        function getUsers(start,limit,filterArray,sortObject, serachedUserText) {
            var uri = config.user.users + '?reqFilter=1';
            if(start && limit){
                if(start && limit){
                    uri += '&start='+start+'&limit='+limit;
                }
                if(filterArray){
                    if(filterArray.length > 0){
                        for(var i=0; i<filterArray.length; i++){

                            var keys = Object.keys(filterArray[i]);

                            if(keys=="fStatus"){
                                if(filterArray[i][keys]=="Active") {
                                    uri += '&' + "isActive" + '=' + 1;
                                }
                                else if(filterArray[i][keys]=="Inactive"){
                                    uri += '&' + "isActive" + '=' + 0;
                                }
                            }
                            else
                                uri += '&' + keys + '=' + filterArray[i][keys];
                        }
                    }
                }
                if(sortObject && sortObject.sortField) {
                    uri += '&' + "sortField" + '=' + sortObject.sortField;
                    uri += '&' + "sortOrder" + '=' + sortObject.sortOrder;
                }
                if(serachedUserText){
                    uri += '&' +'searchUser' +'=' + encodeURIComponent(serachedUserText);
                }
            }


            return $http({
                method: 'GET',
                url: uri,
                data: '',
                headers: {'Content-Type': 'application/json'}

            }).then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response;
            }
        }

        function getUserDetails(uid) {
            return $http({
                method: 'GET',
                url: config.user.users + '/'+uid})
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        function createNewUsers(usersData) {
            return $http({
                method: 'POST',
                url: config.user.users,
                headers: {'Content-Type': 'application/json'},
                data: usersData
            })
                .then(success)
                ['catch'](fail);

            function success(response) {
                return response.data;
            }

            function fail(e) {
                var message = angular.fromJson(e.data[0].message);
                if(message.errorCode=="US-100")
                    logger.fatal($translate.instant('application.app.CONFIGURATION_LABELS.USERS.MESSAGE.USER_ALREADY_EXIST'));
                else
                    logger.fatal($translate.instant('application.app.CONFIGURATION_LABELS.USERS.MESSAGE.EMP_ALREADY_EXIST'));

                return $q.reject(e);
            }
        }

        function editUser(usersData,uid) {
            return $http({
                method: 'PUT',
                url: config.user.users + '/'+uid,
                headers: {'Content-Type': 'application/json'},
                data: usersData
            })
                .then(success)
                ['catch'](fail);

            function success(response) {
                return response.data;
            }

            function fail(e) {
                var message = angular.fromJson(e.data[0].message);
                if(message.errorCode=="US-100")
                    logger.fatal($translate.instant('application.app.CONFIGURATION_LABELS.USERS.MESSAGE.USER_ALREADY_EXIST'));
                else
                    logger.fatal($translate.instant('application.app.CONFIGURATION_LABELS.USERS.MESSAGE.EMP_ALREADY_EXIST'));
                return $q.reject(e);
            }
        }

        function enabledDisableUserStatus(url) {
            return $http({
                method: 'POST',
                url: config.user.users + '/'+url,
                headers: {'Content-Type': 'application/json'},
                data: ''
            })
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response;
            }
        }

        function getUserApplications() {
            return $http({
                method: 'GET',
                url: config.user.applications + '?isTopologyEnabled=1'})
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        function getUsersByTopologyGroups(arg){
            return $http({
                method: 'GET',
                url: config.user.users + '?topologyGroup=' + arg})
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        function getAssignedRolesAppList(arg){
            return $http({
                method: 'GET',
                url: config.user.applications + '?isTopologyEnabled=1&roleId=' + arg})
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        function setFavoriteApp(usersData,uid) {
            return $http({
                method: 'POST',
                url: config.user.users + '/'+uid,
                headers: {'Content-Type': 'application/json'},
                data: usersData
            })
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }
        
        function getUserNameFromJWT(username){
            if(username)
            {
                return $http({
                    method: 'GET',
                    url: config.user.users + '/?username=' + username,
                    data: ''

                }).then(success)
                    ['catch'](exception.catcherHttp());
            }

            function success(response) {
                return(response.data);
            }
        }


        function getRoles(start, limit, filterArray,sortObject) {
            var uri = config.user.roles + '?reqFilter=1';
            var uriStatus = config.user.roles + '/filters/statuses';

            uri += formatQueryParamsForFilterAndPagination(start, limit, filterArray);

            if(sortObject && sortObject.sortField) {
                uri += '&' + "sortField" + '=' + sortObject.sortField;
                uri += '&' + "sortOrder" + '=' + sortObject.sortOrder;
            }

            //Splits the call for statuses and roles in different APIs
            var promises = [getRolesData(uri), getRolesData(uriStatus)];
            return $q.all(promises).then(function (data) {
                var result = data[0];
                result.status = data[1];
                return result;
            });

        }

        function getRolesData(uri){
            return $http({
                method: 'GET',
                url: uri})
                .then(success)
                ['catch'](exception.catcherHttp());
            function success(response) {
                return response.data;
            }
        }

        function formatQueryParamsForFilterAndPagination(start, limit, filterArray){
            var queryParams = '';
            if(start && limit){
                queryParams += '&start='+start+'&limit='+limit;
            }

            if(filterArray && filterArray.length > 0){
                for(var i=0; i<filterArray.length; i++){
                    var keys = Object.keys(filterArray[i]);
                    queryParams += '&' + keys + '=' + filterArray[i][keys];
                }
            }

            return queryParams;
        }

        function getActiveRoles() {
            return $http({
                method: 'GET',
                url: config.user.roles + '?isActive=1'})
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        function getInactiveRoles() {
            return $http({
                method: 'GET',
                url: config.user.roles + '?isActive=0'})
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        function getRoleDetails(uid) {
            return $http({
                method: 'GET',
                url: config.user.roles + '/'+uid})
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        function getPermissions() {
            return $http({
                method: 'GET',
                url: config.user.permissions + '/'})
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        function createUsersRoles(usersData) {
            return $http({
                method: 'POST',
                url: config.user.roles,
                headers: {'Content-Type': 'application/json'},
                data: usersData
            })
                .then(success)
                ['catch'](fail);

            function success(response) {
                return response.data;
            }
            function fail(e) {
                if(e.data[0].message)
                    logger.fatal($translate.instant("application.app.CONFIGURATION_LABELS.USERS.MESSAGE."+e.data[0].message));

                return $q.reject(e);
            }
        }

        function editRole(usersData,uid) {
            return $http({
                method: 'PUT',
                url: config.user.roles + '/'+uid,
                headers: {'Content-Type': 'application/json'},
                data: usersData
            })
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        function enabledDisableRoleStatus(url) {
            return $http({
                method: 'POST',
                url: config.user.roles + '/'+url,
                headers: {'Content-Type': 'application/json'},
                data: ''
            })
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response;
            }
        }
    }
})();

