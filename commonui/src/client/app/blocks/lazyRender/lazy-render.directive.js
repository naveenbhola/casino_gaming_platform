(function () {
    'use strict';

    function LazyRenderDirective($timeout, $rootScope) {
        return {
            restrict: 'E',
            transclude: true,
            template: '<ng-transclude></ng-transclude>',
            link: ($scope, elem, attr) => {
                let isManuallyUpdated = false;
                $timeout(() => {
                    elem.ready(() => {
                        const lazyClass = '.' + (attr.lazy || 'lazy');
                        let lazyElements = [].slice.call($(elem).find(lazyClass));

                        if ("IntersectionObserver" in window) {
                            let lazyElemObserver = new IntersectionObserver(function (entries, observer) {
                                updateEntryBasisIntersection();
                                $rootScope.$watch('slider', () => {
                                    if ($rootScope.slider && !isManuallyUpdated) {
                                        $(elem).find('.lazy-hidden:eq(0)').removeClass('lazy-hidden');
                                        isManuallyUpdated = true;
                                    }
                                });

                                function updateEntryBasisIntersection() {
                                    entries.forEach(function (entry) {
                                        let lazyElem = entry.target;
                                        if (entry.isIntersecting) {
                                            lazyElem.classList.remove("lazy-hidden");
                                            lazyElemObserver.unobserve(lazyElem);
                                        } else {
                                            lazyElem.classList.add("lazy-hidden");
                                        }
                                    });
                                }
                            }, {
                                threshold: 1.0
                            });

                            lazyElements.forEach(function (lazyElem) {
                                lazyElemObserver.observe(lazyElem);
                            });
                        }
                    });
                });
            }
        };

    }

    angular.module('wdts.commonui.blocks')
        .directive('lazyRender',
            ['$timeout', '$rootScope', LazyRenderDirective]);
})();
