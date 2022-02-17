(function () {
    'use strict';

    angular
        .module('wdts.commonui.blocks.fileTransfer')
        .directive('fileUpload', fileUpload);

    fileUpload.$inject = ['$parse'];

    function fileUpload($parse) {
        var directive = {
                restrict: 'A',
                link: link
            };

        function link(scope, element, attrs) {
            element.bind('change', function(){
                scope.$apply(function(){
                    $parse(attrs.fileUpload).assign(scope, element[0].files[0]);
                });
            });
        }

        return directive;
    }
})();
