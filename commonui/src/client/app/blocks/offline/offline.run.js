(function () {
    'use strict';

    angular
        .module('wdts.commonui.blocks.offline')
        .run(offlineHandle);

    /* @ngInject */
    offlineHandle.$inject = ['messagingService', '$window', 'OfflineConstant', 'config'];

    function offlineHandle(messagingService, $window, OfflineConstant, config) {
        if (config.alert && config.alert.route) {
            OfflineConstant.checks = {
                xhr: {
                    type: 'GET',
                    url: config.alert.route + '/v1/metrics/status'
                }
            };
        }
        angular.element(document).ready(function () {
            Offline.options = OfflineConstant;

            Offline.on('up', function () {
                $window.location.reload(true);
            });
            Offline.on('down', function () {
                angular.element('body').addClass('is-offline');
                messagingService.disconnect();
            });
        });
    }
})();
