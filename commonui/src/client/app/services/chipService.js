/**
 * @ngdoc service
 * @name app.cage.chipService
 *
 * @property {<Function>} getTotalChips Get all chips.
 *
 * @description
 * `chipService` allows the cashier to view and chip details and perform chip related functions.
 */
(function () {
    'use strict';

    angular
        .module('wdts.commonui.services')
        .factory('chipService', chipService);

    chipService.$inject = ['$http', 'config', 'logger', 'exception', '$translate'];

    function chipService($http, config, logger, exception, $translate) {
        var service = {
            getTotalChips: getTotalChips,
            getBankrollHistory: getBankrollHistory,
            getBankrollHistoryFooterValue: getBankrollHistoryFooterValue,
            getChipset: getChipset,
            getChipsetConfig: getChipsetConfig,
            updateChipset: updateChipset,
            getCompany: getCompany,
            updateCompany: updateCompany,
            getCurrency: getCurrency,
            updateCurrencyLabel: updateCurrencyLabel,
            getChipCache: getChipCache,
            uploadFile: uploadFile
        };

        return service;


        function getTotalChips() {
            console.log('in service function');
            return $http({
                method: 'GET',
                url: config.chipServiceTotalChipsGetUrl
            })

                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        function getChipCache() {
            return $http({
                method: 'GET',
                url: config.chipServiceChipCache
            })

                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        function getBankrollHistory(gamingDay, casinoPlayerId, start, limit, filterArray) {
            var uri = config.chip.transactions + '?fromTxnDtm=' + gamingDay + '&playerId=' + casinoPlayerId + '&returnTransfers=true&fromIndex=' + start + '&pageSize=' + limit;
            if (filterArray.length > 0) {
                for (var i = 0; i < filterArray.length; i++) {
                    var keys = Object.keys(filterArray[i]);
                    uri += '&' + keys + '=' + filterArray[i][keys];
                }
            }

            return $http({
                method: 'get',
                url: uri,
                data: ''
            })

                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }


        function getBankrollHistoryFooterValue(playerId) {
            return $http({
                method: 'get',
                url: config.chip.bankrolls + '?playerId=' + playerId,
                data: ''
            })
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response;
            }
        }

        function getChipset(sortObject) {
            var uri = config.chip.chipsets;
            if (sortObject && sortObject.sortField) {
                uri += '?' + "sortField" + '=' + sortObject.sortField;
                uri += '&' + "sortOrder" + '=' + sortObject.sortOrder;
            }
            return $http({
                method: 'GET',
                url: uri
            })
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        function getChipsetConfig(sortObject) {
            var uri = config.chip.chipsetsConfig;
            if (sortObject && sortObject.sortField) {
                uri += '?' + "sortField" + '=' + sortObject.sortField;
                uri += '&' + "sortOrder" + '=' + sortObject.sortOrder;
            }
            return $http({
                method: 'GET',
                url: uri
            })
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        function getCompany() {
            return $http({
                method: 'GET',
                url: config.chip.company,
                headers: {'Content-Type': 'application/json'},
                data: ''
            })
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        function updateChipset(chipset, isLabelChange) {
            return $http({
                method: 'POST',
                url: config.chip.chipsets,
                headers: {'Content-Type': 'application/json'},
                data: chipset
            })
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                var msg = isLabelChange ? 'application.app.CONFIGURATION_LABELS.CHIPSETS.MESSAGE.CHANGE_CHIPSET_LABEL' :
                    'application.app.CONFIGURATION_LABELS.CHIPSETS.MESSAGE.CHANGE_CHIPSET_STATUS';

                logger.success($translate.instant(msg));
                return response.data;
            }
        }

        function uploadFile(file, userId, topologyNodeId, approvedUser) {
            var URL = config.cage.route + 'uploadFile' + '?userId=' + userId + '&topologyNodeId=' + topologyNodeId + '&approvedUserId=' + approvedUser;
            return $http({
                method: 'POST',
                url: URL,
                data: file,
                headers: { 'Content-Type': undefined }
            }).then(success, error);

            function success(response) {
                return response.data;
            }
            function error(err) {
                return err;
            }
        }

        function updateCompany(company, isNameChange) {
            return $http({
                method: 'POST',
                url: config.chip.company,
                headers: {'Content-Type': 'application/json'},
                data: company
            })
                .then(success)
                ['catch'](fail);

            function success(response) {
                var msgKey = isNameChange ? 'application.app.CONFIGURATION_LABELS.CHIPSETS.MESSAGE.CHANGE_COMPANY_NAME' :
                    'application.app.CONFIGURATION_LABELS.CHIPSETS.MESSAGE.CHANGE_COMPANY_STATUS';

                logger.success($translate.instant(msgKey));
                return response.data;
            }

            function fail(e) {
                var msg = e.status === 409 ? 'application.app.CONFIGURATION_LABELS.CHIPSETS.MESSAGE.COMPANY_ALREADY_EXISTS' :
                    'application.app.CONFIGURATION_LABELS.CHIPSETS.MESSAGE.COMPANY_DOESNT_EXIST';

                logger.info($translate.instant(msg));
                return $q.reject(e);
            }
        }

        function getCurrency() {
            return $http({
                method: 'GET',
                url: config.chip.currency,
                headers: {'Content-Type': 'application/json'},
                data: ''
            })
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        function updateCurrencyLabel(currencyObj, Param2) {
            return $http({
                method: 'POST',
                url: config.chip.currency,
                headers: {'Content-Type': 'application/json'},
                data: currencyObj
            })
                .then(success)
                ['catch'](fail);

            function success(response) {
                var msgKey = 'application.app.CONFIGURATION_LABELS.CHIPSETS.MESSAGE.CHANGE_CURRENCY_NAME';

                logger.success($translate.instant(msgKey));
                return response.data;
            }

            function fail(e) {
                var msg = e.status == 409 ? 'application.app.CONFIGURATION_LABELS.CHIPSETS.MESSAGE.CURRENCY_ALREADY_EXISTS' :
                    '';
                logger.info($translate.instant(msg));
                return $q.reject(e);
            }
        }
    }

})();
