(function () {
    'use strict';

    angular
        .module('wdts.commonui.blocks.sortableColumn')
        .directive('sortableColumn', sortableColumn);

    /* @ngInject */

    function sortableColumn($timeout) {
        return {
            restrict: 'EA',
            scope: {
                'viewName': '@',
                'sortField': '@'
            },
            link: function (scope, element, attrs) {
                $(element).find("div:eq(0)").addClass("sortable");
                scope.reverse = false;
                element.addClass('sortableColumn');
                element.bind('click', order);

                $timeout(function(){
                    if(!$(element).find(".sortable").find(".sortorder").hasClass("ng-hide")){
                        $(element).find(".sortable").addClass("default");
                    }
                });

                function order () {
                    $(".sortableColumn").each(function(){
                        var $subElem = $(this).find("div:eq(0)");
                        $subElem.removeClass("default");
                        if(!$subElem.hasClass("sortable")){
                            $subElem.addClass("sortable")
                        }
                    });
                    $(element).find("div:eq(0)").removeClass("sortable");
                    scope.reverse = element[0].querySelector('.reverse')===null;
                    emitSortChange();
                }

                function emitSortChange(){
                    scope.$emit('EMIT_SORT_CHANGE',
                        {
                            sortOrder: (scope.reverse ? "DESC" : "ASC"),
                            sortField: scope.sortField,
                            viewName: scope.viewName
                        });
                }
            }
        };
    }
})();
