(function () {
    'use strict';

    angular.module('wdts.drillInPopup', [])
        .directive('drillInPopup', drillInPopup);

    function drillInPopup() {
        var directive = {
            bindToController: true,
            controller: DrillInPopupController,
            controllerAs: 'vm',
            restrict: 'EA',
            scope: {
                'data': '='
            },
            templateUrl: 'bower_components/wdts-common-ui/src/client/app/blocks/drillInPopup/drillInPopup.html'
        };

        DrillInPopupController.$inject = ['$rootScope', '$scope', '$filter', '$q', '$state', 'commonService', 'cageService'];

        function DrillInPopupController($rootScope, $scope, $filter, $q, $state, commonService, cageService) {
            var vm = this;

            vm.data = {
                modalId: 'fills-detail-modal',
                fillid: '121',
                translateTitle: 'application.app.TABLE_DASH_LABELS.FILLS.FILLS_DETAIL.FILLS_ID',
                transType: 'transType',
                totalCoins: 'totalCoins',
                totalChipValue: '1',
                enrolledChips: {
                    byChipset: [],
                    byDenom: [],
                    totalChipsetCoins: 1,
                    total: 0
                }
            }

        }

        return directive;
    }

})();