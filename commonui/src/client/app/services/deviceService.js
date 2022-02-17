/**
 * Created by sgupta on 26/10/2016.
 */
/**
 * @ngdoc service
 * @name wdts.commonui.services.deviceService
 *
 * @property {<Function>} getTopologyNode Get topology node detail for a specific node.
 *
 * @description
 * `topologyService` allows the user to view and update existing topology node detail information.
 */
(function () {
    'use strict';

    angular
        .module('wdts.commonui.services')
        .factory('deviceService', deviceService);

    deviceService.$inject = ['$http', 'config','exception'];

    function deviceService($http, config,exception) {
        var service = {
            getDevices: getDevices,
            getDevice: getDevice,
            getDeviceByTopologyId:getDeviceByTopologyId,
            updateDeviceByDeviceId:updateDeviceByDeviceId
        };

        return service;

        /**
         * @ngdoc method
         * @name getTopologyNodes
         * @methodOf app.layout.sideNavTopologyService
         * @description
         * Gets all topology nodes.
         *
         * @returns {HttpPromise} Future object
         */
        function getDevices() {
            return $http({
                method: 'GET',
                url: config.devices.route})
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        /**
         * @ngdoc method
         * @name getTopologyNodes
         * @methodOf app.layout.sideNavTopologyService
         * @description
         * Gets all topology nodes.
         *
         * @returns {HttpPromise} Future object
         */
        function getDevice(id) {
            return $http({
                method: 'GET',
                url: config.devices.route + id})
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }
        
        function getDeviceByTopologyId(id) {
            return $http({
                method: 'GET',
                url: config.devices.route + '?topologyId=' + id})
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        function updateDeviceByDeviceId(deviceId,obj){
            return $http({
                method: 'POST',
                url: config.devices.route + deviceId,
                data:obj
            })
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }

        }
    }
})();
