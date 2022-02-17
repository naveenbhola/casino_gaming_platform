(function () {

    function IncludeBackBets() {
        return {
            restrict: 'E',
            scope: {
                closeUpdateSessionModal: '&',
                includeBackBets: '=',
                isCbptEnabled: '='

            },
            templateUrl: 'bower_components/wdts-common-ui/src/client/app/blocks/includeBackBets/include-back-bets.html',
            link: ($scope) => {
                $scope.includeBackBets = $scope.includeBackBets.toString();
                $scope.closeUpdateSessionModal = function () {
                    $scope.$emit('CLOSE_MODAL');
                };
            }
        };
    }

    const app = angular.module('wdts.includeBackBets', []);
    app.directive('includeBackBets',
        [IncludeBackBets]);
})();
