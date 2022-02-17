/**
 * Created by jkushwaha on 7/9/17.
 */
(function () {
    'use strict';

    //This is used for new server-side filter directive implementation for different api for different apps.(In future)

    angular
        .module('wdts.commonui.services')
        .factory('filterApiFactory', filterApiFactory);

    filterApiFactory.$inject = ['$rootScope','authService'];

    function filterApiFactory($rootScope,authService) {
        var service = {
            getColumnDataResponse: getColumnDataResponse
        };
        return service;

        /*treasury approval start*/
        function getColumnDataResponse(columnName,apiPath) {
            var filterOptions = [];
            authService.getApprovalRequestByColName(apiPath).then(function (data) {
                if (columnName == "fRequestors" || columnName == "fApprovers") {
                    $rootScope.$broadcast("filteroptionsevent", getRequestorApproverNames(data));
                }
                else if(columnName == "fSources"){
                    $rootScope.$broadcast("filteroptionsevent", data);
                }
                else {
                    $rootScope.$broadcast("filteroptionsevent", getFilterOptionsObject(data));}
            });
        }

        function getRequestorApproverNames(data) {
            var arrUsersId = [];
            for (var uId = 0; uId < data.length; uId++) {
                var uItem = data[uId];

                arrUsersId.push({
                    name: uItem.userId == -17 ? '(Blanks)' : uItem.lastName + ', ' + uItem.firstName + ' (' + uItem.employeeNumber + ')',
                    filterValue: uItem.userId
                });
            }
            return arrUsersId;
        }

        function getFilterOptionsObject(data){
            for (var i = 0; i < data.length; i++) {
                var isObject = angular.isObject(data[i]);
                if (!isObject) {
                    data[i] = {
                        name: !data[i] || data[i] == '-17' ? '(Blanks)' : data[i],
                        filterValue: data[i] || '-17'
                    };
                }

            }
            return data;
        }

        /*treasury approval end*/


    }
})();