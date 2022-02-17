/**
 * @ngdoc service
 * @name wdts.commonui.topology.topologyService
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
        .factory('topologyService', topologyService);

    topologyService.$inject = ['$http', '$q', '$translate', 'logger', 'config', 'exception'];

    function topologyService($http, $q, $translate, logger, config, exception) {
        var service = {
            getTopologyNode: getTopologyNode,
            getTopologyNodeByNodeName: getTopologyNodeByNodeName,
            getTopologyNodeByNodeId: getTopologyNodeByNodeId,
            getTopologyNodes: getTopologyNodes,
            getTopologyNodeByHostName: getTopologyNodeByHostName,
            getTopologyNodesFromCache: getTopologyNodesFromCache,
            getTopologyTypes: getTopologyTypes,
            updateTopologyNode: updateTopologyNode,
            getUnAssignedDevices: getUnAssignedDevices,
            addTopologyNode: addTopologyNode,
            deleteNode: deleteNode,
            getTopologyNodeUnassigned: getTopologyNodeUnassigned,
            getNodeByTopologyType: getNodeByTopologyType,
            editTopologyNode: editTopologyNode,
            createAccessGroup: createAccessGroup,
            getAccessGroup: getAccessGroup,
            getBonusGroup: getBonusGroup,
            getAccessGroupById: getAccessGroupById,
            updateAccessGroup: updateAccessGroup,
            deleteAccessGroup: deleteAccessGroup,
            getTopologyDetails: getTopologyDetails,
            updateTableStatus:updateTableStatus,
            getDescendantNodesOfTGroup: getDescendantNodesOfTGroup
        };

        return service;

        /**
         * @ngdoc method
         * @name getTopologyNode
         * @methodOf app.configuration.topology.topologyService
         * @description
         * Get topology node detail for a specific node.
         *
         * @returns {HttpPromise} Future object
         */
        function getTopologyNode(url) {
            if (url) {
                return $http({
                    method: 'GET',
                    url: config.topologyNodes.route + url
                })
                    .then(success)
                    ['catch'](exception.catcherHttp());
            }

            function success(response) {
                return response.data;
            }
        }

        function getTopologyNodeByNodeName(name) {
            if (name) {
                return $http({
                    method: 'GET',
                    url: config.topologyNodes.route + '?nodeName=' + name
                })
                    .then(success)
                    ['catch'](exception.catcherHttp());
            }

            function success(response) {
                return response.data;
            }
        }


        function getTopologyNodeByNodeId(id, sortObject) {
            var url = config.topologyNodes.route + id;
            if(sortObject && sortObject.sortField && sortObject.sortOrder) {
                url += '?' + "sortField" + '=' + sortObject.sortField;
                url += '&' + "sortOrder" + '=' + sortObject.sortOrder;
            }

            if (id) {
                return $http({
                    method: 'GET',
                    url: url
                })
                    .then(success)
                    ['catch'](exception.catcherHttp());
            }

            function success(response) {
                return response.data;
            }
        }

        function getTopologyNodeUnassigned() {
            return $http({
                method: 'GET',
                url: config.topologyNodes.route + 'global/UNASSIGNED'
            })
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
        function getTopologyNodes() {
            return $http({
                method: 'GET',
                url: config.topologyNodes.route + '?isCache=false',
                headers: {
                    'cache-control': 'no-cache'
                }
            })
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
         * Gets all topology nodes from cache.
         *
         * @returns {HttpPromise} Future object
         */
        function getTopologyNodesFromCache() {
            return $http({
                method: 'GET',
                url: config.topologyNodes.route,
                headers: {
                    'cache-control': 'no-cache'
                }
            })
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        /**
         * @ngdoc method
         * @name getTopologyNode
         * @methodOf app.configuration.topology.topologyService
         * @description
         * Get topology node detail for a specific node.
         *
         * @returns {HttpPromise} Future object
         */
        function updateTopologyNode(node) {
            console.log('in drag drop' + config.topologyNodes.route + node.nodeId);
            if (node) {
                return $http.post(config.topologyNodes.route + node.nodeId, node)
                    .then(success)
                    ['catch'](exception.catcherHttp());
            }

            function success(response) {
                return response.data;
            }
        }


        function editTopologyNode(nodeId, node) {
            console.log('in drag drop' + config.topologyNodes.route + nodeId);
            if (nodeId && node) {
                return $http.post(config.topologyNodes.route + nodeId, node)
                    .then(success)
                    ['catch'](exception.catcherHttp());
            }

            function success(response) {
                return response.data;
            }
        }
        function updateTableStatus(node, nodeobj) {
            if (node) {
                return $http.put(config.topologyNodes.route + node, nodeobj)
                    .then(success)
                    ['catch'](exception.catcherHttp());
            }

            function success(response) {
                return response.data;
            }
        }

        function getDescendantNodesOfTGroup(tGroupName) {
            if (tGroupName) {
                return $http({
                    method: 'GET',
                    url: config.topologyNodes.tgroupdescnroute + tGroupName +'?descendantNodes=true'
                }).then(success)['catch'](exception.catcherHttp());
            }

            function success(response) {
                return response.data;
            }
        }

        /**
         * @ngdoc method
         * @name getTopologyNode
         * @methodOf app.configuration.topology.topologyService
         * @description
         * Get topology node detail for a specific node.
         *
         * @returns {HttpPromise} Future object
         */
        function getTopologyTypes() {
            return $http({
                method: 'GET',
                url: config.topologyTypes.route
            })
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        /**
         * @ngdoc method
         * @name getUnAssignedDevices
         * @methodOf app.layout.sideNavTopologyService
         * @description
         * Gets all unassigned devices.
         *
         * @returns {HttpPromise} Future object
         */

        function getUnAssignedDevices() {
            return $http({
                method: 'GET',
                url: config.topologyNodes.unassignedroute
            })
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        function addTopologyNode(node) {
            if (node) {
                return $http.post(config.topologyNodes.route, node)
                    .then(success)
                    ['catch'](exception.catcherHttp());
            }

            function success(response) {
                return response.data;
            }
        }

        function deleteNode(node) {
            if (node) {
                return $http.delete(config.topologyNodes.route + node.nodeId, node)
                    .then(success)
                    ['catch'](exception.catcherHttp());
            }

            function success(response) {
                return response.data;
            }
        }

        function getNodeByTopologyType(typeId) {
            if (typeId) {
                return $http.get(config.topologyNodes.route + '?typeId=' + typeId)
                    .then(success)
                    ['catch'](exception.catcherHttp());
            }

            function success(response) {
                return response.data;
            }
        }

        function createAccessGroup(node) {
            if (node) {
                return $http.post(config.topologyGroups.route + "/api/topology/v1/topologyGroups/", node)
                    .then(success)
                    ['catch'](fail);
            }

            function success(response) {
                return response.data;
            }

            function fail(e) {
                var isGroupExist = e.data[0].developerMessage === 'Forbidden: Forbidden: No duplicate group names allowed'
                    && e.data[0].message === 'No duplicate group names allowed';
                if (isGroupExist) {
                    logger.info($translate.instant('application.app.CONFIGURATION_LABELS.CHIPSETS.MESSAGE.GROUP_WITH_SAME_NAME_EXIST'));
                } else {
                    logger.fatal('XHR Failed for adding virtual group', e);
                }
                return $q.reject(e);
            }
        }

        function getAccessGroup() {
            return $http({
                method: 'GET',
                url: config.topologyGroups.route + "/api/topology/v1/topologyGroups/?groupType=ACCESS"
            })
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                console.log(response);
                return response.data;
            }
        }

        function getBonusGroup() {
            return $http({
                method: 'GET',
                url: config.topologyGroups.route + "/api/topology/v1/topologyGroups/?groupType=BONUS"
            })
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                console.log(response);
                return response.data;
            }
        }

        function updateAccessGroup(groupId, object) {

            if (groupId && object) {
                var url = config.topologyGroups.route + "/api/topology/v1/topologyGroups/" + groupId;

                return $http({
                    method: 'PUT',
                    url: url,
                    data: object,
                    headers: {'Content-Type': 'application/json'}

                }).then(success)
                    ['catch'](exception.catcherHttp());
            }

            function success(response) {
                return response.data;
            }
        }

        function deleteAccessGroup(groupId, node) {

            if (groupId && node) {
                var url = config.topologyGroups.route + "/api/topology/v1/topologyGroups/" + groupId;

                return $http({
                    method: 'DELETE',
                    url: url,
                    data: node,
                    headers: {'Content-Type': 'application/json'}

                }).then(success)
                    ['catch'](exception.catcherHttp());
            }

            function success(response) {
                return response.data;
            }
        }

        function getAccessGroupById(arg) {
            if (arg) {
                var url = config.topologyGroups.route + "/api/topology/v1/topologyGroups/" + arg;

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

        function getTopologyNodeByHostName(arg) {
            if (arg) {
                var url = config.topologyGroups.route + '/api/topology/v1/topologyNodes/host?hostName=' + arg;

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

        function getTopologyDetails() {
            return $http({
                method: 'GET',
                url: config.topologyNodes.route,
                data: ''

            }).then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return (response.data);
            }
        }
    }
})();
