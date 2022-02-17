(function () {
    'use strict';

    angular
        .module('wdts.commonui.services')
        .factory('configurationService', configurationService);

    configurationService.$inject = ['$http','config','exception'];

    function configurationService($http, config,exception) {
        var service = {
            getConfigurationByType: getConfigurationByType,
            getConfigurationByTopologyId:getConfigurationByTopologyId,
            getConfigurationValues: getConfigurationValues,
            getMapping: getMapping,
            setConfiguration:setConfiguration,
            getLimitValuesByTemplateId:getLimitValuesByTemplateId,
            getDefaultConfiguration:getDefaultConfiguration,
            getThreshholdValue:getThreshholdValue,
            getTablePositionMap: getTablePositionMap,
            getSystemProperty: getSystemProperty,
            getSystemData: getSystemData,
            saveSystemData: saveSystemData,
            updateSystemData: updateSystemData,
            getNonPPTopologyNodes: getNonPPTopologyNodes,
            isLuckyChipEnable: isLuckyChipEnable,
            isGlobalAnonymousHostEnabled: isGlobalAnonymousHostEnabled,
            checkForGEnabledInsurance: checkForGEnabledInsurance,
            isLucky6Enabled: isLucky6Enabled,
            isCBPTEnabled: isCBPTEnabled,
            getGamingDayRollTimeThreshold: getGamingDayRollTimeThreshold,
            getHostcallTemplate: getHostcallTemplate,
            getHostcallDataOnTopology: getHostcallDataOnTopology,
            postHostcallDataOnTopology: postHostcallDataOnTopology,
            getFillCreditProperty: getFillCreditProperty,
            getPlayerRankingList: getPlayerRankingList,
            getPlayerAdjustment:getPlayerAdjustment,
            postPlayerAdjustment:postPlayerAdjustment,
            updatePlayerAdjustment:updatePlayerAdjustment,
            putPlayerAdjustment:putPlayerAdjustment,
            isPlayerAdustmentEnabled:isPlayerAdustmentEnabled
        };

        return service;

        function isPlayerAdustmentEnabled() {
            var url = config.configration.route + '?propertyCodes=com.wdts.rating.adjustment.enabled&templateTypeCode=SYSTEM&type=TEMPLATE';
            return $http({
                method: 'GET',
                url: url,
                data: '',
                headers: { 'Content-Type': 'application/json' }

            }).then(success)['catch'](exception.catcherHttp());

            function success(response) {
                return response.data[0].propertyValues[0].propertyValue.toLowerCase() === 'true';
            }
        }

        function getPlayerRankingList() {
            var url = config.configration.route + '?propertyCodes=com.wdts.player.tier.types&templateTypeCode=SYSTEM&type=TEMPLATE';
            return $http({
                method: 'GET',
                url: url
            }).then(success)['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        function getPlayerAdjustment(topologyId, propertyId) {
            return $http({
                method: 'GET',
                url: config.configuration.configurations + '/?topologyId=' + topologyId + '&propertyId='+propertyId + '&templateTypeCode=PLAYER_ADJUSTMENT&type=CURRENT&state=ACTIVE',
            }).then(success)['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        function postPlayerAdjustment(topologyId, propertyId,objData) {
            return $http({
                method: 'POST',
                data:objData,
                url: config.configuration.configurations + '/?fromTopologyId=' + topologyId + '&propertyId='+propertyId + '&templateTypeCode=PLAYER_ADJUSTMENT&type=CURRENT&state=ACTIVE',
            }).then(success)['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }
        function updatePlayerAdjustment(topologyId, propertyId,objData) {
            return $http({
                method: 'PUT',
                data:objData,
                url: config.configuration.configurations + '/?topologyId=' + topologyId + '&propertyId='+propertyId + '&templateTypeCode=PLAYER_ADJUSTMENT&type=CURRENT&state=ACTIVE',
            }).then(success)['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        function putPlayerAdjustment(configId, propertyId,objData) {
            return $http({
                method: 'PUT',
                data:objData,
                url: config.configuration.configurations + '/' + configId + '/?body=true'
            }).then(success)['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }
        function getConfigurationByType(arg){
            return $http({
                method: 'GET',
                url: config.configuration.properties + '/?topologyTypeId=' + arg})
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        function getDefaultConfiguration(){
            return $http({
                method: 'GET',
                url: config.configuration.configurations + '/?type=TEMPLATE'})
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        function getConfigurationValues(arg){
            return $http({
                method: 'GET',
                url: config.configuration.configurations + '/?topologyTypeId=' + arg + '&type=TEMPLATE&state=ACTIVE'})
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        function getMapping(){
            return $http({
                method: 'GET',
                url: '/bower_components/wdts-common-ui/assets/translations/en_US.json',
                data: ''

            })
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        function setConfiguration(conf){
            return $http({
                method: 'POST',
                url: config.configuration.configurations + '/',
                data: conf

            }).then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        function getConfigurationByTopologyId(topologyId){
            return $http({
                method: 'GET',
                url: config.configuration.configurations + '/?topologyId=' + topologyId})
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        function getLimitValuesByTemplateId(templateId){
            return $http({
                method: 'GET',
                url: config.configuration.configurations + '/' + templateId})
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        function getThreshholdValue() {
            return $http({
                method: 'GET',
                url: config.threshold_limit
            })
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {

                return response.data[0];
            }
        }

        function getTablePositionMap(tableTopologyIds){
            if(tableTopologyIds){
                var url = config.configration.route + '/?topologyIds='+ tableTopologyIds +'&propertyCodes=com.wdts.table.num.player.positions,com.wdts.table.rfid.enabled&templateTypeCode=BACCARAT';

                return $http({
                    method: 'GET',
                    url: url,
                    data: '',
                    headers: {'Content-Type': 'application/json'}

                }).then(success)
                    ['catch'](exception.catcherHttp());
            }

            function success(response) {
                return response.data;
            }
        }

        function getSystemProperty() {
            return $http({
                method: 'GET',
                url: config.configuration.categories + "/?target=SYSTEM"
            })
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        function getSystemData() {
            return $http({
                method: 'GET',
                url: config.configuration.configurations + '/?templateTypeCode=SYSTEM&type=TEMPLATE'
            })
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        function saveSystemData(data) {
            return $http({
                method: 'POST',
                url: config.configuration.configurations + '/',
                data: data
            })
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        function updateSystemData(data,id) {
            return $http({
                method: 'PUT',
                url: config.configuration.configurations + '/' + id + '/?templateTypeCode=PLAY_CRITERIA&type=CURRENT',
                data: data
            })
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        function getNonPPTopologyNodes(tableTopologyIds) {
            var url = config.configration.route
                + '/?topologyIds=' + tableTopologyIds
                + '&propertyCodes=com.wdts.table.num.player.positions,com.wdts.table.rfid.enabled'
                + '&templateTypeCode=BACCARAT';

            return $http({
                method: 'GET',
                url: url,
                data: '',
                headers: {'Content-Type': 'application/json'}

            }).then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        function isLuckyChipEnable(){
            var url = config.configration.route + '?propertyCodes=com.wdts.bonus.luckyChip.enabled&templateTypeCode=SYSTEM&type=TEMPLATE';
            return $http({
                method: 'GET',
                url: url,
                data: '',
                headers: { 'Content-Type': 'application/json' }

            }).then(success)['catch'](exception.catcherHttp());

            function success(response) {
                var returnVar = false;
                for (var i = 0; i < response.data[0].propertyValues.length; i++) {

                    if (response.data[0].propertyValues[i].propertyCode == 'com.wdts.bonus.luckyChip.enabled') {

                        if (response.data[0].propertyValues[i].propertyValue == 'FALSE' || response.data[0].propertyValues[i].propertyValue == 'false') {
                            returnVar = false;
                        } else {
                            returnVar = true;
                        }
                    }
                }
                return returnVar;
            }
        }

        function isGlobalAnonymousHostEnabled() {
            let url = config.configration.route + '?propertyCodes=com.wdts.anonymous.session.alert.enabled&templateTypeCode=SYSTEM&type=TEMPLATE';
            return $http({
                method: 'GET',
                url: url,
                data: '',
                headers: {'Content-Type': 'application/json'}

            }).then(success)['catch'](exception.catcherHttp());

            function success(response) {
                return response.data[0].propertyValues[0].propertyValue.toLowerCase() === 'true';
            }
        }

        function checkForGEnabledInsurance() {
            let url = config.configration.route + 'insurance-bet-enabled/status';
            return $http({
                method: 'GET',
                url: url,
                data: '',
                headers: {'Content-Type': 'application/json'}

            }).then(success)['catch'](exception.catcherHttp());

            function success(response) {
                return response;
            }
        }

        function isLucky6Enabled(id) {
            let url = config.configration.route + '?topologyIds=' + id + '&propertyCodes=com.wdts.table.lucky6.enabled&templateTypeCode=BACCARAT&type=CURRENT';
            return $http({
                method: 'GET',
                url: url,
                data: '',
                headers: {'Content-Type': 'application/json'}

            }).then(success)['catch'](exception.catcherHttp());

            function success(response) {
                return response.data[0].propertyValues[0].propertyValue.toLowerCase() === 'true';
            }
        }

        function isCBPTEnabled(){
            var url = config.configration.route + '?propertyCodes=com.wdts.cbpt.enabled&templateTypeCode=SYSTEM&type=TEMPLATE';
            return $http({
                method: 'GET',
                url: url,
                data: '',
                headers: { 'Content-Type': 'application/json' }

            }).then(success)['catch'](exception.catcherHttp());

            function success(response) {
                return response.data[0].propertyValues[0].propertyValue.toLowerCase() === 'true';
            }
        }

        function getGamingDayRollTimeThreshold() {
            return $http({
                method: 'GET',
                url: config.configuration.configurations + '/?propertyCodes=com.wdts.table.threshold.roll.time&templateTypeCode=SYSTEM&type=TEMPLATE'
            }).then(success)['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        function getHostcallTemplate() {
            return $http({
                method: 'GET',
                url: config.configuration.configurations + '/?templateTypeCode=PLAY_CRITERIA&type=TEMPLATE'
            }).then(success)['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        function getHostcallDataOnTopology(topologyId) {
            var url = config.hostCallTopologyUrl + topologyId
                return $http({
                method: 'GET',
                url: url
            }).then(success)['catch'](exception.catcherHttp());

            function success(response) {

                return response.data;
            }
        }

        function postHostcallDataOnTopology(data) {
            if (data.configurationId) {
                data.configurationId = null;
            }
            return $http({
                method: 'POST',
                url: config.configuration.configurations + '/?templateTypeCode=PLAY_CRITERIA&type=CURRENT',
                data: data
            }).then(success)['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        function getFillCreditProperty() {
            var url = config.configration.route + '?propertyCodes=com.wdts.fctxn.enabled&templateTypeCode=SYSTEM&type=TEMPLATE';
            return $http({
                method: 'GET',
                url: url,
                data: '',
                headers: { 'Content-Type': 'application/json' }

            }).then(success)['catch'](exception.catcherHttp());

            function success(response) {
                var returnVar = false;
                for (var i = 0; i < response.data[0].propertyValues.length; i++) {

                    if (response.data[0].propertyValues[i].propertyCode == 'com.wdts.fctxn.enabled') {

                        if (response.data[0].propertyValues[i].propertyValue == 'FALSE' || response.data[0].propertyValues[i].propertyValue == 'false') {
                            returnVar = false;
                        } else {
                            returnVar = true;
                        }
                    }
                }
                return returnVar;
            }
        }

    }
})();
