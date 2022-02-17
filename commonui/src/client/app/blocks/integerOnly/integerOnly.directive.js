(function () {
    'use strict';

    angular
        .module('wdts.commonui.blocks.integerOnly')
        .directive('integerOnly', integerOnly);

    integerOnly.$inject = [];

    function integerOnly() {
        var directive = {
            restrict: 'A',
            require: 'ngModel',
            link: link
        }

        function link(scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                var transformedInput = inputValue ? inputValue.replace(/[^\d.-]/g, '') : null;

                if (transformedInput != inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }

                return transformedInput;
            });
        }

        return directive;
    }
})();
