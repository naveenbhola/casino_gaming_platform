(function () {
    'use strict';

    angular.module('wdts.commonui.blocks.mainContentHeight')
        .directive('emHeightTarget', emHeightTarget);

    emHeightTarget.$inject = [];
    function emHeightTarget() {
        var watchTimeout = {},
            i = 0;

        function setHeight(scope, elem) {
            var bottomOffset = 0;
            if (scope.emHeightOffsetBottom) {
                if (angular.isString(scope.emHeightOffsetBottom)) {
                    bottomOffset = $(scope.emHeightOffsetBottom).outerHeight();
                } else if (angular.isArray(scope.emHeightOffsetBottom)) {
                    angular.forEach(scope.emHeightOffsetBottom, function (item) {
                        bottomOffset += $(item).outerHeight();
                    });
                }
            }

            elem.css('height', $(window).height() - $(elem).offset().top - bottomOffset + 'px');
        }

        return {
            scope: {
                emHeightTriggers: '=',
                emHeightOffsetBottom: '='
            },
            link: function (scope, elem) {
                var j = i++;
                if(elem[0].attributes[0].nodeValue.indexOf("player-card-gridview") > -1){
                    elem.css('overflow-y', 'auto');
                }else{
                    elem.css('overflow-y', 'hidden');
                }

                setTimeout(_setHeight);

                $(window).on('resize.main-content', _setHeight);

                scope.$watch(function () {
                    if (watchTimeout[j]) {
                        clearTimeout(watchTimeout[j]);
                    }
                    watchTimeout[j] = setTimeout(_setHeight, 100);
                });

                if (scope.emHeightTriggers) {
                    scope.$watchGroup(scope.emHeightTriggers, function () {
                        setTimeout(_setHeight);
                    });
                }

                function _setHeight() {
                    if ($(elem).is(':visible')) {
                        setHeight(scope, elem);
                    }
                }
            }
        }
    }
})();