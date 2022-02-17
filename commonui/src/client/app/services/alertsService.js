(function () {
    'use strict';

    angular
        .module('wdts.commonui.services')
        .factory('alertsService', alertsService);

    alertsService.$inject = ['$http', 'config', 'exception', '$q','store','jwtTokenKey'];

    function alertsService($http, config, exception, $q, store,jwtTokenKey) {
        return {
            getAlertsdata: getAlertsdata,
            getAlertData: getAlertData,
            getAlertCounts: getAlertCounts,
            changeStatus: changeStatus,
            changeSeverity: changeSeverity,
            addNewComment: addNewComment,
            updateComment: updateComment,
            saveCustomerKnowledgebase: saveCustomerKnowledgebase,
            getTablesAlertCount: getTablesAlertCount
        };

        function getAlertsdata(alertTopplogyId, startLength, pageLimit, status, severity, eventType, fromDate,
                               toDate, category, topologyIdGroupStr, filtertopologyId, sortObj) {
            var url,
                defer = $q.defer();

            url = config.alert.alerts + '?start=' + startLength + '&limit=' + pageLimit;
            if(status){
                url = url + '&alertStatus=' + status;
            }
            url = alertTopplogyId ? url + '&topologyId=' + alertTopplogyId : url;
            url = topologyIdGroupStr ? url + '&topologyGroupId=' + topologyIdGroupStr : url;
            url = category ? url + '&category=' + category : url;
            url = eventType ? url + '&eventTypes=' + eventType : url;
            url = fromDate ? url + '&fromDate=' + fromDate : url;
            url = toDate ? url + '&toDate=' + toDate : url;
            url = filtertopologyId ? url + '&filterTopologyIds=' + filtertopologyId : url;
            // url += '&reqFilter=1';

            if (severity) {
                url += '&alertSeverity=' + severity;
            }

            if(sortObj && sortObj.sortField && sortObj.sortOrder){
                url += '&sortField=' + sortObj.sortField + '&sortOrder=' + sortObj.sortOrder;
            }

            var promises = [httpRequest(url), getAlertFilters()];
            $q.all(promises).then(function(data){
                var result = data[0];
                result.data.filters = {
                    severity: data[1][0].data,
                    status: data[1][1].data,
                    eventType: data[1][2].data
                };
                defer.resolve(result);
            });

            return defer.promise;

        }

        function getAlertFilters(params){
            var promises = [],
                severityURL = config.alert.filters+"/severity",
                statusURL = config.alert.filters+"/status",
                eventTypeURL = config.alert.filters+"/eventType";

            promises.push(httpRequest(severityURL), httpRequest(statusURL), httpRequest(eventTypeURL));

            return $q.all(promises);
        }

        function httpRequest(url){
            return $http({
                method: 'GET',
                url: url,
                headers: {
                    'Content-Type': 'application/json','Authorization': "Bearer " + store.get(jwtTokenKey)
                }
            }).then(success)['catch'](exception.catcherHttp());

            function success(response) {
                return response;
            }
        }

        function getAlertData(alertParams){
            return $http({
                method: 'GET',
                url: config.alert.alertConfiguration,
                headers: {
                    'Content-Type': 'application/json','Authorization': "Bearer " + store.get(jwtTokenKey)
                },
                params: alertParams
            })
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response;
            }
        }

        function getAlertCounts(alertTopplogyId, topologyIdGroupStr) {
            var url = config.alert.alertCounts + '?topologyId=' + alertTopplogyId;
            if(topologyIdGroupStr){
                url = url + '&topologyGroupId='+ topologyIdGroupStr;
            }

            return $http({
                method: 'get',
                url: url,
                data: ''
            })
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        function getTablesAlertCount(topologyIds) {
            var url = config.alert.alertCounts + '/tables?topologyIds=' + topologyIds;


            return $http({
                method: 'get',
                url: url,
                data: ''
            })
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        function changeStatus(statusParams) {
            return $http({
                method: 'POST',
                url: config.alert.alerts + '/' + statusParams.alertId + '/status',
                data: {"userId": statusParams.userId, "alertStatus": statusParams.alertStatus}
            }).then(success)['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        function changeSeverity(severityParams){
            return $http({
                method: 'POST',
                url: config.alert.alertConfiguration + '?userId=' + severityParams.userId,
                data: severityParams.severityParam
            })
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response;
            }
        }

        function addNewComment(commentParams) {
            return $http({
                method: 'POST',
                url: config.alert.alerts + '/' + commentParams.alertId + '/note',
                data: {"userId": commentParams.userId, "note": commentParams.note}
            }).then(success)['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        function updateComment(updateCommenrParams) {
            return $http({
                method: 'POST',
                url: config.alert.route + '/' + updateCommenrParams.alertId,
                data: {
                    "userId": updateCommenrParams.userId,
                    "commentId": updateCommenrParams.commentId,
                    "comment": updateCommenrParams.comment
                }
            }).then(success)['catch'](exception.catcherHttp());

            function success(response) {
                console.log("overview" + JSON.stringify(response));
                return response.data;
            }
        }

        function saveCustomerKnowledgebase(custKnowParams) {
            return $http({
                method: 'POST',
                url: config.alert.alerts + '/' + '?eventTypeId=' + custKnowParams.eventTypeId,
                data: {"userId": custKnowParams.userId, "customerKnowledgeBase": custKnowParams.customerKnowledgeBase}
            }).then(success)['catch'](exception.catcherHttp());

            function success(response) {
                console.log("overview" + JSON.stringify(response));
                return response.data;
            }
        }
    }
})();
