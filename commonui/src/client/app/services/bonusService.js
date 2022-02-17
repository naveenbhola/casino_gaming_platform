/**
 * Created by ggupta on 10/2/17.
 */
(function () {
    'use strict';

    angular
        .module('wdts.commonui.services')
        .factory('bonusService', bonusService);

    bonusService.$inject = ['$http', 'config', 'exception', '$translate','$q','logger'];

    function bonusService($http, config, exception, $translate,$q,logger) {
        var service = {
            getDefaultBonusProgram: getDefaultBonusProgram,
            getBonusPrograms: getBonusPrograms,
            getBonusFilters: getBonusFilters,
            getpromotionWinners: getpromotionWinners,
            managePromotionEnabled: managePromotionEnabled,
            getBonusProgramsById: getBonusProgramsById,
            submitBonusProgram: submitBonusProgram,
            updateBonusProgramPost: updateBonusProgramPost,
            getBonusProgramActive: getBonusProgramActive,
            updateBonusProgramPut: updateBonusProgramPut,
            updateNote: updateNote,
            getBonusAwards: getBonusAwards,
            postBonusAwards: postBonusAwards,
            getBonusProgramsSearchBy:getBonusProgramsSearchBy,
            getbonusAwardReportData:getbonusAwardReportData,
        };

        return service;

        function getDefaultBonusProgram() {
            return $http({
                method: 'GET',
                url: config.bonus.templateRoute})
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response;
            }
        }

        function getBonusPrograms(startLength, pageLimit, filterArray, sortObj) {
            var url;

            url = config.bonus.bonusProgramsRoute + '?start=' + startLength + '&limit=' + pageLimit;
            url += filterParse(filterArray);

            if(sortObj && sortObj.sortField && sortObj.sortOrder){
                url += '&sortField=' + sortObj.sortField + '&sortOrder=' + sortObj.sortOrder;
            }

            return $http({
                method: 'GET',
                url: url})
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response;
            }
        }

        function getBonusFilters() {
            return $http({
                method: 'GET',
                url: config.bonus.bonusProgramsRoute + "/filters/status"})
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response;
            }
        }

        function getpromotionWinners(gamingDay) {
            return $http({
                method: 'GET',
                url: config.promotion.winners + "?calenderDate=" + gamingDay }).then(success)['catch'](exception.catcherHttp());

            function success(response) {
                return response;
            }
        }

        function managePromotionEnabled() {
            return $http({
                method: 'GET',
                url: config.promotion.managePromotion }).then(success)['catch'](exception.catcherHttp());

            function success(response) {
                return response;
            }
        }

        function getBonusProgramsById(id) {
            return $http({
                method: 'GET',
                url: config.bonus.bonusProgramsRoute + '/' + id})
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response;
            }
        }

        function submitBonusProgram(object) {
            if (object) {

                return $http({
                    method: 'POST',
                    url: config.bonus.bonusProgramsRoute,
                    data: object,
                    headers: {'Content-Type': 'application/json'}

                }).then(success)
                    ['catch'](exception.catcherHttp());
            }

            function success(response) {
                return response.data;
            }
        }

        function updateBonusProgramPost(object) {
            if (object) {
                return $http({
                    method: 'POST',
                    url: config.bonus.bonusProgramsRoute + '/' + object.uid,
                    data: object,
                    headers: {'Content-Type': 'application/json'}

                }).then(success)
                    ['catch'](exception.catcherHttp());
            }

            function success(response) {
                return response.data;
            }
        }

        function getBonusProgramActive(id) {
            return $http({
                method: 'GET',
                url: config.bonus.bonusProgramsRoute + '?status=SCHEDULED,ACTIVE&bonusGroupIds=' + id})
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response;
            }
        }

        function updateBonusProgramPut(object) {
            if (object) {
                return $http({
                    method: 'PUT',
                    url: config.bonus.bonusProgramsRoute + '/' + object.uid,
                    data: object,
                    headers: {'Content-Type': 'application/json'}

                }).then(success)
                    ['catch'](exception.catcherHttp());
            }

            function success(response) {
                return response.data;
            }
        }

        function updateNote(object) {
            if (object) {
                return $http({
                    method: 'POST',
                    url: config.bonus.bonusProgramsRoute + '/' + object.uid,
                    data: object,
                    headers: {'Content-Type': 'application/json'}

                }).then(success)
                    ['catch'](exception.catcherHttp());
            }

            function success(response) {
                return response.data;
            }
        }

        function getBonusAwards(filterColApiName, startLength, pageLimit, filterArray, sortObj) {
            var url;

            url = config.bonus.bonusAwardsRoute;

            if(filterColApiName){
                url = config.bonus.bonusAwardsRoute + "/filters/"+filterColApiName;
            }

            if(startLength && pageLimit){
                url += '?start=' + startLength + '&limit=' + pageLimit;
            }

            url += filterParse(filterArray);

            if(sortObj && sortObj.sortField && sortObj.sortOrder){
                url += '&sortField=' + sortObj.sortField + '&sortOrder=' + sortObj.sortOrder;
            }

            return $http({
                method: 'GET',
                url: url})
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response;
            }
        }

        function postBonusAwards(object) {
            if (object) {
                return $http({
                    method: 'POST',
                    url: config.bonus.bonusAwardsRoute + '/' + object.uid,
                    data: object,
                    headers: {'Content-Type': 'application/json'}

                }).then(success)
                    ['catch'](exception.catcherHttp());
            }

            function success(response) {
                return response.data;
            }
        }

        function getBonusProgramsSearchBy(seachType, searchObj, start, limit, sortObject, filterArray) {
            var uri = config.bonus.bonusAwardsRoute;
            if(seachType=='AWARD_ID'){
                uri += '/' + searchObj.awardId;
            }else if(seachType=='PLAYER_ID'){
                uri += '?playerIds=' + searchObj.playerIds;
            }else if(seachType=='PROGRAM_ID'){
                uri += '?programIds=' + searchObj.programId;
            }else if(seachType=='PLAYER_NAME'){
                if(searchObj.playerFirstNames && searchObj.playerLastNames){
                    uri += '?playerFirstNames=' + searchObj.playerFirstNames + '&playerLastNames=' + searchObj.playerLastNames;
                }else if(searchObj.playerFirstNames){
                    uri += '?playerFirstNames=' + searchObj.playerFirstNames;
                }else if(searchObj.playerLastNames){
                    uri += '?playerLastNames=' + searchObj.playerLastNames;
                }
            }

            if(start && limit){
                uri += '&start=' + start + '&limit=' + limit;
            }

            if(sortObject && sortObject.sortField && sortObject.sortOrder) {
                uri += '&' + "sortField" + '=' + sortObject.sortField;
                uri += '&' + "sortOrder" + '=' + sortObject.sortOrder;
            }

            uri += filterParse(filterArray);

            return $http({
                method: 'GET',
                url: uri})
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response;
            }
        }

        function getbonusAwardReportData(awardId, token) {
            return $http({
                method: 'GET',
                url: config.bonus.bonusAwardReportDataRoute + '/?bonusAwardId=' + awardId,
                headers: {
                    'Content-Type': 'application/json', 'Authorization': "Bearer " + token
                }
            }).then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data.successObj;
            }
        }

        function filterParse (filterArray) {
            var reqString = '';

            if (filterArray && filterArray.length > 0) {
                for (var i = 0; i < filterArray.length; i++) {
                    var keys = Object.keys(filterArray[i]);
                    var value = filterArray[i][keys].replace(' ', '');

                    if (value) {
                        reqString += '&' + keys + '=' + value;
                    }
                }
            }

            return reqString;
        }

    }
})();

