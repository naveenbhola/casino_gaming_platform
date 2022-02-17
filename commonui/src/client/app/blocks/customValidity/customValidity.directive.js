(function () {
    'use strict';

    angular
        .module('wdts.customValidity',[])
        .directive('customValidity', ['$translate', customValidity]);

    function customValidity($translate) {
        function link(scope, element) {
            var input = element[0];

            input.addEventListener("invalid", function () {
                if (input.validity.tooShort) {
                    input.setCustomValidity($translate.instant('application.app.common.labels.MIN_LENGTH_VALIDITY', {value: input.minLength}));
                } else if (input.validity.valueMissing) {
                    input.setCustomValidity($translate.instant('application.app.common.labels.EMPTY_VALIDITY'));
                } else {
                    input.setCustomValidity('');
                }
            });
        }

        return {
            link: link
        };
    }
})();
