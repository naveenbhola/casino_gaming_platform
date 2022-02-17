(function () {
    'use strict';

    angular
        .module('wdts.commonui.services')
        .factory('playerService', playerService);

    playerService.$inject = ['$http','config','exception'];

    function playerService($http,config,exception) {
        var service = {
            getPlayerbyFirstLastName: getPlayerbyFirstLastName,
            getPlayerbyID: getPlayerbyID,
            getSwipedPlayer: getSwipedPlayer
        };

        return service;

        function getPlayerbyFirstLastName(firstName, lastName) {
            return $http({
                method: 'GET',
                url: config.player.route + '?firstName='+ firstName +'&lastName='+lastName+'&fetch=true'
            })

                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        function getPlayerbyID(playerId) {

            return $http({
                method: 'GET',
                url: config.player.route + '?casinoPlayerId='+playerId+'&fetch=true'
            })

                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }

        function getSwipedPlayer(cardData) {

            return $http({
                method: 'GET',
                url: config.player.route + '?casinoCardData='+cardData+'&fetch=true'
            })
                .then(success)
                ['catch'](exception.catcherHttp());

            function success(response) {
                return response.data;
            }
        }
    }
})();
