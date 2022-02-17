
(function () {
    'use strict';

    angular
        .module('wdts.commonui.blocks.checkImage')
        .directive('checkImage', checkImage);

    checkImage.$inject = ['$q'];

    function checkImage($q) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                attrs.$observe('ngSrc', function (ngSrc) {
                    var deferred = $q.defer();
                    var image = new Image();
                    image.onerror = function () {
                        deferred.resolve(false);
                        element.attr('src', '../bower_components/wdts-common-ui/assets/img/game-player-default.svg'); // set default image
                    };
                    image.onload = function () {
                        deferred.resolve(true);
                    };
                    image.src = ngSrc;
                    return deferred.promise;
                });
            }
        };
    }
})();
