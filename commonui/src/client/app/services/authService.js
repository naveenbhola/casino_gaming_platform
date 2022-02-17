/**
 * @ngdoc service
 * @name wdts.commonui.services
 *
 * @property {<Function>} getTotalChips Get all chips.
 *
 * @description
 * `authService` allows the cashier to view and chip details and perform chip related functions.
 */
(function () {
    'use strict';

    angular
        .module('wdts.commonui.services')
        .factory('authService', authService);

    authService.$inject = ['$http', '$q', 'logger', 'config','store','exception','jwtTokenKey','uuid4'];

    function authService($http, $q, logger, config,store,exception,jwtTokenKey,uuid4) {
        var service = {
            getRefreshedToken:getRefreshedToken,
            ppMasterLogout:ppMasterLogout,
            postApprovalRequest: postApprovalRequest,
            getApprovalRequest: getApprovalRequest,
            getApprovalRequestByColName:getApprovalRequestByColName,
            getApprovalRequestByFilter:getApprovalRequestByFilter,
            changeStatus: changeStatus,
            getNewUuid: getNewUuid,
            changeStatusWithNewToken: changeStatusWithNewToken,
            postSuperVisorLogin: postSuperVisorLogin,
            newLoginPPmaster: newLoginPPmaster
        };

        return service;

        function postSuperVisorLogin(tableIP){
            return $http({
                method: 'POST',
                url: config.webserver + '/device/' + tableIP + ":8080" + config.auth.routes.loginTable,
                headers: {
                    'Content-Type': 'application/json','Authorization': "Bearer " + store.get(jwtTokenKey)
                }
            })
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        function getRefreshedToken(qrStr) {
            return $http({
                method: 'POST',
                url: config.auth.oauthRefresh + '?'+qrStr,
                headers: {
                    'Content-Type': 'application/json','Authorization': "Bearer " + store.get(jwtTokenKey)
                }
            })
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        function ppMasterLogout(){
            return $http({
                method: 'POST',
                url: config.auth.oauthLogout,
                headers: {
                    'Content-Type': 'application/json','Authorization': "Bearer " + store.get(jwtTokenKey)
                }
            })
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        function getApprovalRequestByColName(urlPath) {
            return $http({
                method: 'GET',
                url: urlPath
            })
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        function getApprovalRequestByFilter(topologyId,filterArray,sortObj,start,limit) {
            var uri = config.auth_postApprovalRoute+"/approvalsByFilter?topologyIds="+topologyId;
            //if(start && limit){
            //    uri += '&start='+start+'&limit='+limit;
            //}
            if(sortObj && sortObj.sortField && sortObj.sortOrder){
                uri += '&sortField=' + sortObj.sortField + '&sortOrder=' + sortObj.sortOrder;
            }
            if(filterArray){
                if(filterArray.length > 0){
                    for(var i=0; i<filterArray.length; i++){
                        var keys = Object.keys(filterArray[i]);
                        uri += '&' + keys + '=' + filterArray[i][keys];

                    }
                }
            }
            return $http({
                method: 'GET',
                url: uri
            })
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        function postApprovalRequest(data){
            return $http({
                method: 'POST',
                url: config.auth_postApprovalRoute,
                headers: {
                    'Content-Type': 'application/json','Authorization': "Bearer " + store.get(jwtTokenKey)
                },
                data: data
            })
                .then(success)
                ['catch'](fail);

            function success(response) {
                return response;
            }

            function fail(e) {
                logger.warn($translate.instant("application.app.CAM_CASHIER_LABELS.COMMON_LOGGERMESSAGES.POSTAPPRVL_NOT_COMPLETE"));
                return $q.reject(e);
            }
        }

        function getApprovalRequest(topologyId, sortObj) {
            var uri = config.auth_route2+topologyId;

            if(sortObj && sortObj.sortField && sortObj.sortOrder){
                uri += '&sortField=' + sortObj.sortField + '&sortOrder=' + sortObj.sortOrder;
            }

            return $http({
                method: 'GET',
                url: uri
            })
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        function changeStatus(statusParams) {
            return $http({
                method: 'PUT',
                url: config.auth_postApprovalRoute+'/'+statusParams.approvalId,
                headers: {
                    'Content-Type': 'application/json','Authorization': "Bearer " + store.get(jwtTokenKey)
                },
                data: {
                    "status": statusParams.approvalStatus
                }
            })
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        function changeStatusWithNewToken(statusParams, token) {
            return $http({
                method: 'PUT',
                url: config.auth_postApprovalRoute + '/' + statusParams.approvalId,
                headers: {
                    'Content-Type': 'application/json', 'Authorization': "Bearer " + token
                },
                data: {
                    "status": statusParams.approvalStatus
                }
            }).then(success)['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        function getNewUuid() {
            var newUuid = uuid4.generate();
            return newUuid;
        }

        function newLoginPPmaster(obj, clientid_passsed) {
            return $http({
                method: 'POST',
                url: config.auth.oauthLogin + '?client_id=' + clientid_passsed,
                data: obj
            }).then(success);

            function success(response) {
                return (response.data);
            }

            function fail(e) {
                console.log('XHR Failed for get JWT Username', e);
                return $q.reject(e);
            }

        }


    }
})();
