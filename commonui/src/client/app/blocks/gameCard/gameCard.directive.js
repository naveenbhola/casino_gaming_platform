(function () {
    'use strict';

    angular
        .module('wdts.gameCard',[])
        .directive('gameCard', gameCard);

    /* @ngInject */

    function gameCard() {
        return {
            bindToController: true,
            controller: gameCardController,
            controllerAs: 'vm',
            restrict: 'EA',
            scope: {
                type: '=',
                playerCard: '=',
                cardPosition: '=',
                bufferLength: '='
            },
            templateUrl: function (elem, attr) {
                return 'bower_components/wdts-common-ui/src/client/app/blocks/gameCard/gameCard.html';
            }
        };

        gameCardController.$inject = ['$scope', 'config'];

        /* @ngInject */
        function gameCardController($scope, config) {
            var vm = this;
            $scope.type = vm.type;
            $scope.playerCard = angular.copy(vm.playerCard);
            $scope.cardPosition = vm.cardPosition;
            $scope.bufferLength = vm.bufferLength;

            $scope.selectSuit = function(suit){
                $scope.playerCard.suit = suit;
                if($scope.playerCard.rank!='' && $scope.playerCard.rank!='?'){
                    $scope.playerCard.faceUp = true;
                }
                $scope.updateCardFaceValue();
            };

            $scope.selectRank = function(rank){
                $scope.playerCard.rank = rank;
                if($scope.playerCard.suit!='' && $scope.playerCard.suit!='?'){
                    $scope.playerCard.faceUp = true;
                }
                $scope.updateCardFaceValue();
            };

            $scope.landScapeClass = function(){
                if($scope.type == 'B' && $scope.cardPosition == 0){
                    return true;
                }if($scope.type == 'P' && $scope.cardPosition == 2){
                    return true;
                }else{
                    return false;
                }
            };

            $scope.updateCardFaceValue = function(){
                var emitData = {
                    type: $scope.type,
                    cardPosition: $scope.cardPosition,
                    playerCard: $scope.playerCard
                };

                $scope.$emit('updateCardFaceValue', emitData);
            };

            $scope.changeSelectStatus = function(playerCard){
                $scope.selected = !$scope.selected;
                var selectCard = {
                    "card": playerCard,
                    "cardPositionsInBuffer": playerCard.bufferCardPos
                };
                if($scope.selected) {
                    $scope.$emit('selectCardValue', selectCard);
                }
                else{
                    $scope.$emit('deselectCardValue', selectCard);
                }
            };

            $scope.closeDropdown = function(){
                $('#'+$scope.type + $scope.cardPosition).dropdown("toggle");
            };

            $scope.cancel = function(){
                if(vm.type !== 'burn') {
                    $scope.playerCard = angular.copy(vm.playerCard);
                }
                else{
                    $scope.playerCard = {
                        rank:'',
                        suit:'',
                        faceUp:false
                    }
                }
            };

            $scope.moveToBuffer = function(){
                let emitData = {
                    type: $scope.type,
                    cardPosition: $scope.cardPosition,
                    playerCard: $scope.playerCard
                };

                $scope.$emit('removecard', emitData);
            }
        }
    }
})();