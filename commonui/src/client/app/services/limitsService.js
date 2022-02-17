(function () {
    'use strict';

    angular
        .module('wdts.commonui.services')
        .factory('limitsService', limitsService);

    limitsService.$inject = ['$http','config','exception'];

    function limitsService($http,config,exception) {
        var service = {
            getLimits: getLimits,
            getLimitsPaginated: getLimitsPaginated,
            getLimitFilters: getLimitFilters,
            getActiveLimits:getActiveLimits,
            saveDetails: saveDetails,
            saveNewLimit: saveNewLimit,
            updateLimit:updateLimit,
            getInactiveLimits: getInactiveLimits
        };

        function getLimitFilters() {
            return $http({
                method: 'GET',
                url: config.configuration.configurations + '/filters'
            })
                .then(function(response){
                    return response;
                })
                ['catch'](exception.catcherHttp());
        }

        /**
         * @deprecated
         */
        function getLimits(filterArray) {
            var url = config.configuration.configurations + '/?templateTypeCode=TABLE_LIMITS&type=TEMPLATE';
            url += filterParse(filterArray);

            return $http({
                method: 'GET',
                url: url
            })
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                var data = [];
                for(var i=0; i<response.data.length; i++) {
                    if(response.data[i].name) {
                        var obj = new Object();
                        obj.name = response.data[i].name;
                        obj.state = response.data[i].state;
                        obj.configId = response.data[i].configurationId;
                        getlimitProperties(response, obj, i);
                        data.push(obj);
                    }
                }
                return data;
            }
        }

        function getLimitsPaginated(start, limit, filterArray, sortObject) {
            var url = config.configuration.configurations + '/paginatedConfigurations?templateTypeCode=TABLE_LIMITS&type=TEMPLATE';
            url += filterParse(filterArray);
            if(start && limit) {
                url += "&start=" + start + "&limit=" + limit
            }
            if(sortObject && sortObject.sortField && sortObject.sortOrder) {
                url += '&' + "sortField" + '=' + sortObject.sortField;
                url += '&' + "sortOrder" + '=' + sortObject.sortOrder;
            }

            return $http({
                method: 'GET',
                url: url
            })
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                var data = [];
                for(var i=0; i<response.data.configurations.length; i++) {
                    if(response.data.configurations[i].name) {
                        var obj = new Object(), propertiesData = new Object(), responseData = response.data.configurations;
                        obj.name = responseData[i].name;
                        obj.state = responseData[i].state;
                        obj.configId = responseData[i].configurationId;
                        propertiesData.data = response.data.configurations;
                        getlimitProperties(propertiesData, obj, i);
                        data.push(obj);
                    }
                }
                response.data.configurations = data;
                return response;
            }
        }

        function getActiveLimits() {
            return $http({
                method: 'GET',
                url: config.configuration.configurations + '/?templateTypeCode=TABLE_LIMITS&type=TEMPLATE'
            })
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {

                return response.data;
            }
        }

        function saveNewLimit(newLimits) {
            return $http({
                method: 'POST',
                url: config.configuration.configurations + '/',
                data: newLimits
            })
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        function updateLimit(newLimits,id) {
            return $http({
                method: 'POST',
                url: config.configuration.configurations + '/'+id,
                data: newLimits
            })
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        function saveDetails(item) {
            //console.log('saving, calling: ' + item.meta.href + ' data: ' + JSON.stringify(item));
            return $http.post(item.meta.href, item)
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }
        

        function getInactiveLimits(filterArray) {
            var url = config.configuration.configurations + '/?templateTypeCode=TABLE_LIMITS&type=TEMPLATE&state=INACTIVE';
            url += filterParse(filterArray);

            return $http({
                method: 'GET',
                url: url
            })
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                //console.log("response: "+response.data);
                var data = [];
                for(var i=0; i<response.data.length; i++) {
                    if(response.data[i].name) {
                        var obj = new Object();
                        obj.name = response.data[i].name;
                        obj.state = response.data[i].state;
                        obj.configId = response.data[i].configurationId;
                        getlimitProperties(response, obj, i);
                        data.push(obj);
                    }
                }
                return data;
            }
        }

        function getlimitProperties(response, obj, i){
            for(var j=0; j<response.data[i].propertyValues.length; j++){

                switch (response.data[i].propertyValues[j].propertyId){

                    case 3001:
                        obj.differential = response.data[i].propertyValues[j].propertyValue;
                        obj.differentialPropValId = response.data[i].propertyValues[j].propertyValueId;
                        break;
                    case 3002:
                        obj.minPlayerBet = response.data[i].propertyValues[j].propertyValue;
                        obj.minPlayerBetPropValId = response.data[i].propertyValues[j].propertyValueId;
                        break;
                    case 3003:
                        obj.maxPlayerBet = response.data[i].propertyValues[j].propertyValue;
                        obj.maxPlayerBetPropValId = response.data[i].propertyValues[j].propertyValueId;
                        break;
                    case 3004:
                        obj.minPairBet = response.data[i].propertyValues[j].propertyValue;
                        obj.minPairBetPropValId = response.data[i].propertyValues[j].propertyValueId;
                        break;
                    case 3005:
                        obj.useMaxAggregatePairBet = response.data[i].propertyValues[j].propertyValue;
                        obj.useMaxAggregatePairBetPropValId = response.data[i].propertyValues[j].propertyValueId;
                        break;
                    case 3006:
                        obj.maxAggregatePairBet = response.data[i].propertyValues[j].propertyValue;
                        obj.maxAggregatePairBetPropValId = response.data[i].propertyValues[j].propertyValueId;
                        break;
                    case 3007:
                        obj.minTieBet = response.data[i].propertyValues[j].propertyValue;
                        obj.minTieBetPropValId = response.data[i].propertyValues[j].propertyValueId;
                        break;
                    case 3008:
                        obj.maxAggregateTieBet = response.data[i].propertyValues[j].propertyValue;
                        obj.maxAggregateTieBetPropValId = response.data[i].propertyValues[j].propertyValueId;
                        break;
                    case 3009:
                        obj.BankerBet = response.data[i].propertyValues[j].propertyValue;
                        obj.BankerBetPropValId = response.data[i].propertyValues[j].propertyValueId;
                        break;
                    case 3010:
                        obj.tempName = response.data[i].propertyValues[j].propertyValue;
                        obj.tempNamePropValId = response.data[i].propertyValues[j].propertyValueId;
                        break;
                    case 3011:
                        obj.errorThresold = response.data[i].propertyValues[j].propertyValue;
                        obj.errorThresoldValId = response.data[i].propertyValues[j].propertyValueId;
                        break;
                    case 3016:
                        obj.limitsColor = response.data[i].propertyValues[j].propertyValue;
                        obj.limitsColorValId = response.data[i].propertyValues[j].propertyValueId;
                        break;
                    case 2025:
                        obj.commission = response.data[i].propertyValues[j].propertyValue;
                        obj.commissionValId = response.data[i].propertyValues[j].propertyValueId;
                        break;
                    case 3041:
                        obj.l6Max = response.data[i].propertyValues[j].propertyValue;
                        obj.Maxl6ValId = response.data[i].propertyValues[j].propertyValueId;
                        break;
                    case 3040:
                        obj.l6Min = response.data[i].propertyValues[j].propertyValue;
                        obj.Minl6ValId = response.data[i].propertyValues[j].propertyValueId;
                        break;

                }
            }
        }

        function filterParse (filterArray) {
            var reqString = '';

            if (filterArray && filterArray.length > 0) {
                for (var i = 0; i < filterArray.length; i++) {
                    var keys = Object.keys(filterArray[i]);
                    var value = filterArray[i][keys].replace(' ', '');

                    if (value) {
                        reqString += '&' + keys + '=' + value;
                    }
                }
            }

            return reqString;
        }

        return service;

    }
})();
