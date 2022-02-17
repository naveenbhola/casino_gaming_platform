(function () {
    'use strict';

    angular
        .module('wdts.commonui.blocks.offline')
        .constant('OfflineConstant', {
            requests: false,
            checks: {
                image: {url: '/bower_components/wdts-common-ui/assets/img/pin.png'},
                active: 'image'
            }
        });
})();