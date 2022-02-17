/**
 * Created by sgupta on 21/12/15.
 */
/**
 * @ngdoc service
 * @name app.cage.camService
 *
 * @property {<Function>} getTotalChips Get all chips.
 *
 * @description
 * `camService` allows to get chip details placed on CAM device/antenna.
 */
(function () {
    'use strict';

    angular
        .module('wdts.commonui.services')
        .factory('camService', camService);

    camService.$inject = ['$http', '$q', 'logger', 'config','exception','$translate'];

    function camService($http, $q, logger, config,exception,$translate) {
        var service = {
            getChipSummary: getChipSummary,
            getChipSummaryForCam: getChipSummaryForCam,
            getChipDetails: getChipDetails,
            postBuyInPlayer: postBuyInPlayer,
            postCashOutPlayer: postCashOutPlayer,
            postUpdateOwnership: postUpdateOwnership,
            postEnrollChips: postEnrollChips,
            postChangeChips: postChangeChips
        };

        return service;

        function getChipSummary(sortObj) {
            var url = '';

            url = config.protocol+config.webserverDNS+"/device/" + config.cam + config.chipSummaryUrl;
            if(sortObj && sortObj.sortField && sortObj.sortOrder){
                url += '&sortField=' + sortObj.sortField + '&sortOrder=' + sortObj.sortOrder;
            }

            return $http({
                method: 'GET',
                url: url,
                headers:{'Content-Type': 'application/json'}
            })
           
                .then(success)
                ['catch'](fail);

            function success(response) {
                return response.data;
            }

            function fail(e) {

                logger.warn($translate.instant('application.app.CAM_CASHIER_LABELS.COMMON_LOGGERMESSAGES.CAMNOTREACHABLE'));
                return $q.reject(e);
            }
        }

        function getChipSummaryForCam(sortObj) {
            console.log('in service function');
            var url = '';

            url = config.protocol+config.webserverDNS+"/device/" + config.cam + config.chipSummaryUrlForCam;
            if(sortObj && sortObj.sortField && sortObj.sortOrder){
                url += '&sortField=' + sortObj.sortField + '&sortOrder=' + sortObj.sortOrder;
            }

            return $http.get(url)

                .then(success)
                ['catch'](fail);

            function success(response) {
                return response.data;
            }

            function fail(e) {
                logger.warn($translate.instant('application.app.CAM_CASHIER_LABELS.COMMON_LOGGERMESSAGES.CAMNOTREACHABLE'));
                return $q.reject(e);
            }
        }

        function getChipDetails() {
            console.log('in service function');
            var url = '';

            url = config.protocol+config.webserverDNS+"/device/" + config.cam + config.chipDetailUrl;

            return $http({
                method: 'GET',
                url: url,
                headers:{'Content-Type': 'application/json'}
            })
            
                .then(success)
                ['catch'](fail);

            function success(response) {
                return response.data;
            }

            function fail(e) {
                logger.warn($translate.instant('application.app.CAM_CASHIER_LABELS.COMMON_LOGGERMESSAGES.CAMNOTREACHABLE'));
                return $q.reject(e);
            }
        }

        function postBuyInPlayer(player) {
            console.log('in postBuyInPlayer');
            var url = '';

            url = config.protocol+config.webserverDNS+"/device/" + config.cam + config.postBuyInPlayerUrl;

            return $http({
                method: 'POST',
                url: url,
                data: player,
                headers:{'Content-Type': 'application/json'}
                //config.routes.playerServiceTotalChipsGetUrl
            })
          
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                console.log(JSON.stringify(response));
                return response;
            }
        }

        function postCashOutPlayer(player) {
            console.log('in postCashOutPlayer');
            var url = '';

            url = config.protocol+config.webserverDNS+"/device/" + config.cam+ config.postCashOutPlayerUrl;

            return $http({
                method: 'POST',
                url: url,
                data: player,
                headers:{'Content-Type': 'application/json'}
                //config.routes.playerServiceTotalChipsGetUrl
            })
           
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                console.log(JSON.stringify(response));
                return response;
            }
        }

        function postUpdateOwnership(player) {
            console.log('in UpdateOwnership');
            var url = '';

            url = config.protocol+config.webserverDNS+"/device/"+ config.cam + config.postUpdateOwnershipUrl;

            return $http({
                method: 'POST',
                url: url,
                data: player,
                headers:{'Content-Type': 'application/json'}
            })
            
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                console.log(JSON.stringify(response));
                return response;
            }
        }

        function postEnrollChips(chips){
            //logger.info('in Enrolling chips');
            var url = '';

            url = config.protocol+config.webserverDNS+"/device/" + config.cam + config.postEnrollChips;

            return $http({
                method: 'POST',
                url: url,
                data: chips,
                headers:{'Content-Type': 'application/json'}

            })
           
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                console.log(JSON.stringify(response));
                return response;
            }

        }

        function postChangeChips(chips){
            var url = '';

            url = config.protocol+config.webserverDNS+"/device/" + config.cam + config.postChangeChips;

            return $http({
                method: 'POST',
                url: url,
                headers:{'Content-Type': 'application/json'},
                data: chips
            })
            
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                console.log(JSON.stringify(response));
                return response;
            }
        }
    }

})();
