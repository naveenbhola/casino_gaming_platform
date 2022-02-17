(function () {
    'use strict';

    angular
        .module('wdts.commonui.blocks.confirm')
        .directive('wdtsConfirm', wdtsConfirm);

    wdtsConfirm.$inject = ['$compile', 'logger', '$timeout','$rootScope','casinoManagerService','jwtHelper','store','jwtTokenKey','$translate'];

    function wdtsConfirm($compile, logger, $timeout,$rootScope, casinoManagerService, jwtHelper, store, jwtTokenKey,$translate) {
        var confirmTemplate = '<div class="confirm-frame">' +
                '<span translate="application.app.TABLE_DASH_LABELS.GAME_HISTORY.GAME_DETAIL.UPDATE"></span> '+
                '<span ng-if="message.newPlayerName !=null" translate="application.app.TABLE_DASH_LABELS.GAME_HISTORY.GAME_DETAIL.SS_WITH"></span><span ng-if="message.newPlayerName==null" translate="application.app.TABLE_DASH_LABELS.GAME_HISTORY.GAME_DETAIL.SS"></span>' + ' <span ng-if="message.newPlayerName !=null" class="text"> {{message.newPlayerName}} ({{message.playerToBeUpdated}}) </span>?' +
                '<button type="button" style="margin-left: 5px;" class="btn btn-primary" ng-click="clickYes($event)" translate="application.app.common.labels.OK">Ok</button>' +
                '<button type="button" class="btn btn-secondary" ng-click="clickNo()" translate="application.app.common.labels.CANCEL">Cancel</button>' +
                '<br><span class="text" style="margin-bottom: 0px;" translate="application.app.TABLE_DASH_LABELS.GAME_HISTORY.GAME_DETAIL.WANT_RATE"></span> ' +
                '</div>',

            confirmOnSuccessTemplate = '<div class="confirm-frame">' +
                '<span class="glyphicon glyphicon-info-sign"></span>' +
                '<span class="text">{{textOnSuccess}}</span>' +
                '<span class="close" ng-click="clickNo()">&times;</span>' +
                '</div>',


            directive = {
                restrict: 'EA',
                scope: {
                    onConfirm: '&',
                    onCancel: '&',
                    message: '=',
                    selectedplayer:'=',
                    textOnSuccess: '=',
                    textOnError: '=',
                    confirmWrapper: '=',
                    includeBackBets: '='
                },
                link: link
            };

        function link(scope, element) {
            var question = $compile(confirmTemplate)(scope),
                success = $compile(confirmOnSuccessTemplate)(scope),
                confirmWrapper = $(scope.confirmWrapper),
                timeoutId;

            scope.clickYes = clickYes;
            scope.clickNo = clickNo;

            element.on('click', function () {
                if (timeoutId) {
                    $timeout.cancel(timeoutId);
                }
                _hideWrapper();
                _showWrapper(question);
            });
            function clickYes(e) {
                e.stopPropagation();
                var decodedJwt = store.get(jwtTokenKey);
                var decodedJwt = jwtHelper.decodeToken(decodedJwt);
                var userId = decodedJwt.userId;
                var currentDate = new Date();
                var updateTime = currentDate.toISOString();
                _hideWrapper();
                var tableIpArry = scope.selectedplayer.tableIp.split(',');
                var sessionIdArry = scope.selectedplayer.sessionIds.split(',');
                var ircNumberArry = scope.selectedplayer.ircNumbers.split(',');
                for (var i = 0; i<= sessionIdArry.length - 1; i++){
                    casinoManagerService.updatePlayer(scope.selectedplayer.updatedPlayerId,
                        scope.selectedplayer.gamingDay, scope.selectedplayer.topologyId, scope.selectedplayer.positionId,
                        scope.selectedplayer.positionLabel, userId, updateTime, [sessionIdArry[i]], scope.selectedplayer.identifier, [ircNumberArry[i]], scope.includeBackBets,tableIpArry[i])
                        .then(function () {
                            $rootScope.$broadcast('playerUpdateclick', true);
                            logger.success($translate.instant('application.app.TABLE_DASH_LABELS.SESSIONS.PLAYER_UPDATED'));
                        }, function (e) {
                            _hideWrapper();
                            logger.error('Server error', e);
                        });
                }
                $('#update-user-modal').modal('hide');
                $('#game-detail-modal').css({'opacity': 1});

                scope.onConfirm && scope.onConfirm();
                // if(scope.selectedplayer.sessionM == null) {
                //     casinoManagerService.updatePlayer(scope.selectedplayer.updatedPlayerId,
                //         scope.selectedplayer.gamingDay, scope.selectedplayer.topologyId, scope.selectedplayer.positionId,
                //         scope.selectedplayer.positionLabel, userId, updateTime, scope.selectedplayer.sessionIds, scope.selectedplayer.identifier, scope.selectedplayer.ircNumbers, scope.includeBackBets)
                //         .then(function () {
                //             $rootScope.$broadcast('playerUpdateclick', true);
                //             logger.success($translate.instant('application.app.TABLE_DASH_LABELS.SESSIONS.PLAYER_UPDATED'));
                //         }, function (e) {
                //             _hideWrapper();
                //             logger.error('Server error', e);
                //         });
                //     $('#update-user-modal').modal('hide');
                //     $('#game-detail-modal').css({'opacity': 1});
                //
                //     scope.onConfirm && scope.onConfirm();
                // }
                //
                // else {
                //
                //     scope.selectedplayer.sessionM.forEach(function (value, key) {
                //         console.log(key + '--' + value);
                //         casinoManagerService.updatePlayer(scope.selectedplayer.updatedPlayerId,
                //             scope.selectedplayer.gamingDay, key, scope.selectedplayer.positionId,
                //             scope.selectedplayer.positionLabel, userId, updateTime, value.toString(), scope.selectedplayer.identifier, scope.selectedplayer.ircNumbers, scope.includeBackBets)
                //             .then(function () {
                //                 $rootScope.$broadcast('playerUpdateclick', true);
                //                 timeoutId = $timeout(_hideWrapper);
                //                 logger.success($translate.instant('application.app.TABLE_DASH_LABELS.SESSIONS.PLAYER_UPDATED'));
                //             }, function (e) {
                //                 _hideWrapper();
                //                 logger.error('Server error', e);
                //             });
                //
                //         $('#update-user-modal').modal('hide');
                //         $('#game-detail-modal').css({'opacity': 1});
                //
                //         scope.onConfirm && scope.onConfirm();
                //     });
                // }
            }

            function clickNo() {
                $rootScope.$broadcast('playerclicked', true);
                casinoManagerService.cancelUpdateSession(scope.selectedplayer.sessionIds,scope.selectedplayer.topologyId,scope.selectedplayer.gamingDay, scope.selectedplayer.identifier)
                    .then(function () {
                        _hideWrapper();
                    }, function (e) {
                        _hideWrapper();
                        logger.error('Server error', e);
                    });       _hideWrapper();
                scope.onCancel && scope.onCancel();
            }

            function _showWrapper(content) {
                return confirmWrapper
                    .html(content)
                    .show();
            }

            function _hideWrapper() {
                confirmWrapper.empty().hide();
            }

            $rootScope.$on('hidepopup', function (event) {
                _hideWrapper();
            });
        }

        return directive;
    }
})();
