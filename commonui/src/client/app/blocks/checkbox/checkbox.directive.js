(function () {
    'use strict';

    angular
        .module('wdts.commonui.blocks.checkbox')
        .directive('inputCheckbox', inputCheckbox);

    inputCheckbox.$inject = [];

    function inputCheckbox() {
        var i = 0,
            arrIds = [],
            directive = {
                restrict: 'C',
                link: link
            };

        function link(scope, element, attrs) {
            var id = attrs.id;
            if (id && arrIds.indexOf(id) === -1) {
                arrIds.push(id);
            } else {
                id = "checkbox-" + i++;
            }

            element.attr('id', id);
            element.next()
                .attr('for', id)
                .on('click', function (e) {
                    e.stopPropagation();
                });
        }

        return directive;
    }
})();
