(function () {
    'use strict';

    angular
    .module('wdts.commonui.services')
    .factory('printService', printService);
    printService.$inject = ['config', '$q'];

    function printService(config, $q) {
        var service = {};

        function getGetUrl(obj) {
            var url = [];

            for (var i in obj) {
                url.push(encodeURIComponent(i) + '=' + (angular.isObject(obj[i]) ? JSON.stringify(obj[i]) : encodeURIComponent(obj[i])));
            }
            return '?' + url.join('&');
        }

        service.getUrlrenderReport = function (reportData, format, reportName, print) {
            var configParams = {
                print: print !== undefined ? print : true,
                format: format || "PDF",
                reportName: reportName || "OpenerCloserForm",
                reportData: reportData
            };
            var url = getGetUrl(configParams);
            return config.print.route + "renderReport" + url;
        };

        service.createIframe = (function () {
            var iframes = [],
                k = 0;
            angular.element(window).on('focus', function () {
                for (var j = 0, len = iframes.length; j < len; j++) {
                    angular.element(document.getElementById(iframes[j])).remove();
                    iframes.splice(j, 1);
                }
            });
            return function (url) {
                var nameIframe = 'print-iframe' + ++k,
                    frame = angular.element("<iframe name='" + nameIframe + "' id='" + nameIframe + "' style='display: none;' src='" + url + "'></iframe>"),
                    deferred = $q.defer();

                angular.element(document.getElementsByTagName("body")[0]).append(frame);

                frame[0].onload = function () {
                    iframes.push(this.name);
                    deferred.resolve(iframes);
                };

                frame[0].onerror = function () {
                    deferred.reject(iframes);
                };

                return deferred.promise;
            }
        })();

        return service
    }
})();
