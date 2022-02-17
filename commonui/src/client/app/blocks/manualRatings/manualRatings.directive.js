(function () {
    var app = angular.module('wdts.manualRatings', []);
    app.directive('manualRatings', manualRatings);
    manualRatings.$inject = ['ratingService', '$filter', '$q', '$state', '$rootScope', 'casinoManagerService', 'commonService', 'logger', '$stateParams', 'tableDashboardService', '$translate','jwtTokenKey','$timeout'];

    function manualRatings() {
        return {
            templateUrl: 'bower_components/wdts-common-ui/src/client/app/blocks/manualRatings/manualRatings.html',
            restrict: 'E',
            replace: true,
            scope: {
                playerId: '=',
                gamingDay: '=',
                topologyIdList: '=',
                filterProperties: '=',
                approvePermission: '=',
                commentPermission: '=',
                createPermission: '=',
                jwtName: '='
            },
            controller: function ($scope, ratingService, $filter, $q, $state,
                                  $rootScope, casinoManagerService, commonService, logger,
                                  $stateParams, tableDashboardService, $translate,jwtTokenKey,$timeout, configurationService) {
                var vm = this,
                    topologyData = commonService.getAllData();
                vm.sortObj = {
                    sortField: '',
                    sortOrder: ''
                };
                $scope.showPlayer = false;
                $scope.showTable = false;
                vm.sortObj = {
                    sortField: '',
                    sortOrder: ''
                };
                switch($scope.jwtName) {
                    case 'jwt_plr':
                        vm.sortObj = {
                            sortField: 'TABLE_NAME',
                            sortOrder: 'ASC'
                        };
                        $scope.showTable = true;
                        break;
                    case 'jwt_tbldash':
                        vm.sortObj = {
                            sortField: 'PLAYER_NAME',
                            sortOrder: 'ASC'
                        };
                        $scope.showPlayer = true;
                        break;
                    case 'jwt_cmr':
                        vm.sortObj = {
                            sortField: 'TABLE_NAME',
                            sortOrder: 'ASC'
                        };
                        $scope.showTable = true;
                        $scope.showPlayer = true;
                        break;
                }
                vm.playerId = $scope.playerId;
                vm.gamingDay = $scope.gamingDay;
                vm.topologyIdList = $scope.topologyIdList;
                vm.filterProperties = $scope.filterProperties ? $scope.filterProperties : [];
                vm.commentPermission = $scope.commentPermission;
                vm.createPermission = $scope.createPermission;
                vm.approvePermission = $scope.approvePermission;

                $scope.playerDivHide = true;
                $scope.playerList = [];
                $scope.loader = false;
                $scope.error = false;
                $scope.playerSelected = false;
                $scope.playerImageloader = false;
                $scope.tableId = $stateParams.tableId;
                $scope.filterType = 'Player ID';
                $scope.filterTypeTranslated = 'application.app.common.labels.PLAYERID';

                $scope.manualRatingDataStart = 1;
                $scope.manualRatingDataLimit = 10;
                $scope.totalManualRatingCount = 0;

                let isLucky6Enabled = false;
                lucky6EnabledStatus();

                function activate() {
                    $scope.topologyMap = topologyData.topologyMap;
                    vm.manualRatingFilterArray = [];

                    clearManualRatingForm();
                    clearSubmitForm();
                    showManualRatings();
                }

                function lucky6EnabledStatus(){
                    configurationService.isLucky6Enabled($scope.tableId).then((res)=>{
                        isLucky6Enabled = res;
                    })
                }

                function showManualRatings() {
                    vm.manualRatings = true;
                    vm.fetchingData = true;

                    ratingService.paginatedSearchManualRatings(vm.gamingDay, vm.topologyIdList, {
                        filterArray: vm.manualRatingFilterArray
                    }, vm.sortObj, $scope.manualRatingDataStart, $scope.manualRatingDataLimit, vm.playerId).then(function (data) {
                        vm.manualRatingNumber = data.data.successObj.manualRatingList.length;
                        vm.manualRatingFilterObj = {
                            fStatus: data.data.successObj.Filters.fStatus,
                            seatNo: data.data.successObj.Filters.seatNo
                        };

                        processFilterValues(vm.manualRatingFilterObj, data.data);
                        processManualRatingList(data.data.successObj.manualRatingList);

                        $rootScope.manualRatingData = vm.manualRatingData = data.data.successObj.manualRatingList;
                        vm.fetchingData = false;
                        vm.totalCount = vm.topologyIdList?vm.manualRatingData.length:0;
                        vm.showPlrRatingsFiltersFlag = true;

                        $scope.totalManualRatingCount = parseInt(data.headers()['totalrecords']);
                        $("#manualRatingsCommentModal").modal('hide');
                    });
                }

                vm.showPlrRatingsFilter = function () {
                    vm.filterPlrRatingsdiv = !vm.filterPlrRatingsdiv;
                };

                vm.applyManualRatingFilter = function (isClear) {
                    vm.totalCount = 0;
                    $scope.totalManualRatingCount = 0;
                    if(vm.playerId && !isClear){
                        vm.manualRatingFilterArray.push({'playerId': vm.playerId});
                    }
                    showManualRatings();
                };

                vm.clearManualRatingFilter = function () {
                    $scope.$broadcast('CLEAR_FILTERS', ['fTableIds', 'fStatus', 'seatNo', 'createdByUser', 'approvedByUser', 'playerId']);
                    vm.manualRatingFilterArray = []//vm.playerId ? [{'playerId': vm.playerId}] : [];
                    setTimeout(function () {
                        vm.applyManualRatingFilter(true);
                    }, 4);
                };

                vm.showComments = function (rating) {
                    $scope.selectedComments = rating.notes;
                    $scope.ratingNote = rating;
                    $scope.showModalbtn = true;
                    if (rating.player.anonymous == false) {
                        $scope.playerName = rating.player.casinoPlayer.lastName? rating.player.casinoPlayer.lastName+ ', ' : '';
                        $scope.playerName += rating.player.casinoPlayer.firstName ? rating.player.casinoPlayer.firstName : '';
                        $scope.playerName += ' (' + rating.player.casinoPlayer.casinoPlayerId + ')';
                    } else {
                        $scope.playerName = 'Anonymous' + rating.player.playerId;
                    }
                    $('#manualRatingsCommentModal').modal('show');
                };

                vm.slider = function () {
                    return $rootScope.slider;
                };

                vm.isVisibleFilter = function (filterPropertyName) {
                    return (vm.filterProperties.indexOf(filterPropertyName) > -1);
                };

                vm.updateComment = function () {
                    var d = new Date();
                    var x = d.toISOString().split('.000Z');
                    var newNote = vm.addComment.replace(/\r?\n/g, '<br />');

                    var obj = {
                        "note": newNote,
                        "createDtm": x[0] + 'Z',
                        "user": {"userId": $rootScope.decodedJwt.userId},
                        "ratingId": $scope.ratingNote.ratingId
                    };


                    ratingService.createManualRatingNote(obj).then(function (data) {
                        // ratingService.getManualRatingById($scope.ratingNote.ratingId).then(function (data) {
                        //     vm.addComment = '';
                        //     $scope.selectedComments = data.successObj.notes;
                        //     showManualRatings();
                        // });
                        vm.addComment = '';
                        $scope.selectedComments = data.successObj.notes;
                        showManualRatings();
                    });
                };

                vm.submitRating = function (rating) {
                    if (rating.manuallRatingStatus == 'OPEN' || (rating.manuallRatingStatus == 'PENDING' && jwtTokenKey != 'jwt_tbldash')) {
                        $scope.rating = rating;
                        $scope.submitForm.table.id = rating.tableId;
                        $scope.submitForm.table.name = $scope.topologyMap.get(parseInt(rating.tableId));
                        $scope.submitForm.createdBy = rating.createdUser.userId;
                        $scope.submitForm.createdByUser = rating.createdUser.lastName + ', ' + rating.createdUser.firstName + ' (' + rating.createdUser.employeeNumber + ')';
                        $scope.submitForm.seatIdx = parseInt(rating.seatIdx);
                        $scope.submitForm.cashBuyIn = rating.cashBuyIn;
                        $scope.submitForm.avgBet = rating.avgBet;
                        $scope.submitForm.casinoWin = rating.casinoWin;
                        $scope.submitForm.ircNumber = parseInt(rating.ircNumber);
                        $scope.submitForm.startDtm = rating.startDtm;

                        if (rating.endDtm != null) {
                            $scope.submitForm.endDtm = rating.endDtm;
                            var duration = moment.duration(moment($scope.submitForm.endDtm).diff($scope.submitForm.startDtm));
                            $scope.submitForm.totalTime = formatDuration(duration);
                        } else {
                            $scope.submitForm.endDtm = null;
                        }
                        vm.searchPlayer(rating.player.playerId);

                        if ($scope.approvePermission) {
                            $('#modal-manual-ratings-approv').modal('show');
                        }
                    }
                };

                vm.searchPlayer = function (id) {
                    $scope.error = false;
                    $scope.loader = true;
                    $scope.submitForm.player.id = id;


                    ratingService.getKnownPlayer($scope.submitForm.player.id).then(function (data) {
                        if (!data) {
                            $scope.loader = false;
                            $scope.error = true;
                        }

                        $scope.submitForm.player.name = (data.anonymous == false)
                            ? data.casinoPlayer.lastName + ', ' + data.casinoPlayer.firstName + ' (#' + data.casinoPlayer.casinoPlayerId + ')'
                            : 'Anonymous' + ' (#' + data.playerId + ')';

                        $scope.loader = false;
                        $scope.error = true;

                    });
                };

                vm.approveManualRating = function () {
                    $scope.submitForm.endDtm = moment($scope.submitForm.endDtm);
                    $scope.submitForm.startDtm = moment($scope.submitForm.startDtm);
                    var x = $scope.submitForm.startDtm.toISOString().split('.000Z');
                    var x1 = $scope.submitForm.endDtm.toISOString().split('.000Z');
                    var userId = $rootScope.decodedJwt.userId;

                    $scope.startTime1 = x[0] + 'Z';
                    $scope.endTime1 = x1[0] + 'Z';

                    var data = {
                        "ratingId": $scope.rating.ratingId,
                        "manuallRatingStatus": "CLOSED",
                        "player": {
                            "playerId": $scope.submitForm.player.id
                        },
                        "tableId": $scope.submitForm.table.id,
                        "seatIdx": $scope.submitForm.seatIdx,
                        "startDtm": $scope.startTime1,
                        "endDtm": $scope.endTime1,
                        "gamingDay": $rootScope.gamingDayFromURL,
                        "cashBuyIn": $scope.submitForm.cashBuyIn ? $scope.submitForm.cashBuyIn : 0,
                        "avgBet": $scope.submitForm.avgBet,
                        "casinoWin": $scope.submitForm.casinoWin,
                        "ircNumber": $scope.submitForm.ircNumber === null? '' : $scope.submitForm.ircNumber,
                        "createdUser": {
                            "userId": $scope.submitForm.createdBy
                        },
                        "approvedUser": {
                            "userId": userId
                        },
                        "approvedDtm": $scope.startTime1
                    };

                    vm.updateManualRating($scope.rating.ratingId, data);
                };


                vm.cancelManualRating = function () {
                    $scope.submitForm.endDtm = moment($scope.submitForm.endDtm);
                    $scope.submitForm.startDtm = moment($scope.submitForm.startDtm);
                    var x = $scope.submitForm.startDtm.toISOString().split('.000Z');
                    var x1 = $scope.submitForm.endDtm.toISOString().split('.000Z');
                    var userId = $rootScope.decodedJwt.userId;

                    $scope.startTime1 = x[0] + 'Z';
                    $scope.endTime1 = x1[0] + 'Z';

                    var data = {
                        "ratingId": $scope.rating.ratingId,
                        "manuallRatingStatus": "CANCELED",
                        "player": {
                            "playerId": $scope.submitForm.player.id
                        },
                        "tableId": $scope.submitForm.table.id,
                        "seatIdx": $scope.submitForm.seatIdx,
                        "startDtm": $scope.startTime1,
                        "endDtm": $scope.endTime1,
                        "gamingDay": $rootScope.gamingDayFromURL,
                        "cashBuyIn": $scope.submitForm.cashBuyIn,
                        "avgBet": $scope.submitForm.avgBet,
                        "casinoWin": $scope.submitForm.casinoWin,
                        "ircNumber": $scope.submitForm.ircNumber === null? '' : $scope.submitForm.ircNumber,
                        "createdUser": {
                            "userId": $scope.submitForm.createdBy
                        },
                        "canceledUser": {
                            "userId": userId
                        },
                        "canceledDtm": $scope.startTime1
                    };

                    vm.updateManualRating($scope.rating.ratingId, data);
                };

                vm.clearEndTime = (cmd) => {
                    if (cmd === 'SUBMIT') {
                        $scope.submitForm.endDtm = null;
                        $scope.submitForm.totalTime = ''
                    } else if (cmd === 'SAVE') {
                        $scope.manualRatingForm.endDtm = null;
                        $scope.manualRatingForm.totalTime = ''
                    }
                }

                vm.saveRating = function () {
                    if ($scope.submitForm.endDtm !== null) {
                        $scope.submitForm.endDtm = moment($scope.submitForm.endDtm);
                    }
                    $scope.submitForm.startDtm = moment($scope.submitForm.startDtm);
                    var x = $scope.submitForm.startDtm.toISOString().split('.000Z');
                    var userId = $rootScope.decodedJwt.userId;

                    $scope.startTime1 = x[0] + 'Z';

                    var data = {
                        "ratingId": $scope.rating.ratingId,
                        "manuallRatingStatus": $scope.rating.manuallRatingStatus,
                        "player": {
                            "playerId": $scope.submitForm.player.id
                        },
                        "tableId": $scope.submitForm.table.id,
                        "seatIdx": parseInt($scope.submitForm.seatIdx),
                        "startDtm": $scope.startTime1,
                        "gamingDay": $rootScope.gamingDayFromURL,
                        "cashBuyIn": $scope.submitForm.cashBuyIn,
                        "avgBet": $scope.submitForm.avgBet,
                        "casinoWin": $scope.submitForm.casinoWin,
                        "ircNumber": $scope.submitForm.ircNumber === null? '' : $scope.submitForm.ircNumber,
                        "createdUser": {
                            "userId": $scope.submitForm.createdBy
                        },
                        "editedUser": {
                            "userId": userId
                        },
                        "lastUpdateDtm": $scope.startTime1
                    };

                    if ($scope.submitForm.endDtm) {
                        var x1 = $scope.submitForm.endDtm.toISOString().split('.000Z');
                        $scope.endTime1 = x1[0] + 'Z';
                        data.endDtm = $scope.endTime1;
                    }

                    vm.updateManualRating($scope.rating.ratingId, data);
                };

                vm.updateManualRating = function (ratingId, data) {
                    ratingService.updateManualRating(ratingId, data).then(function (data) {
                        logger.info($translate.instant('application.app.common.labels.MANUAL_RATING_UPDATED'));
                        $scope.submitForm = {
                            'table': {
                                id: null, 'name': ''
                            },
                            'createdBy': null,
                            player: {
                                id: null,
                                name: null
                            },
                            seatIdx: 1,
                            cashBuyIn: 0,
                            avgBet: 0,
                            casinoWin: 0
                        };

                        showManualRatings();
                        $('#modal-manual-ratings-approv').modal('hide');
                    });
                };

                vm.createManualRating = function (arg) {
                    if ($scope.error == false && $scope.manualRatingForm.player.name != null && $scope.manualRatingForm.player.name != '') {
                        var x = $scope.manualRatingForm.startDtm.toISOString().split('.000Z');
                        $scope.startTime1 = x[0] + 'Z';

                        var obj = {
                            "manuallRatingStatus": "OPEN",
                            "player": {
                                "playerId": $scope.manualRatingForm.player.id
                            },
                            "tableId": $scope.manualRatingForm.table.id,
                            "seatIdx": $scope.manualRatingForm.seatIdx,
                            "createDtm": $scope.startTime1,
                            "startDtm": $scope.startTime1,
                            "gamingDay": $rootScope.calendarDate,
                            "cashBuyIn": $scope.manualRatingForm.cashBuyIn,
                            "avgBet": $scope.manualRatingForm.avgBet,
                            "casinoWin": $scope.manualRatingForm.casinoWin,
                            "ircNumber": $scope.manualRatingForm.ircNumber,
                            "createdUser": {
                                "userId": $rootScope.decodedJwt.userId
                            }
                        };

                        if ($scope.manualRatingForm.endDtm) {
                            var x1 = $scope.manualRatingForm.endDtm.toISOString().split('.000Z');
                            $scope.endTime1 = x1[0] + 'Z';
                            obj.endDtm = $scope.endTime1;
                        }

                        tableDashboardService.createManualRating(obj).then(function (data) {
                            var createdRating = data.successObj;
                            if (arg == 'submit') {
                                var request = {
                                    "ratingId": createdRating.ratingId,
                                    "manuallRatingStatus": "PENDING",
                                    "player": {
                                        "playerId": createdRating.player.playerId ? createdRating.player.playerId : createdRating.playerId
                                    },
                                    "tableId": createdRating.tableId,
                                    "seatIdx": createdRating.seatIdx,
                                    "startDtm": createdRating.startDtm,
                                    "endDtm": createdRating.endDtm,
                                    "gamingDay": createdRating.gamingDay,
                                    "cashBuyIn": createdRating.cashBuyIn,
                                    "avgBet": createdRating.avgBet,
                                    "casinoWin": createdRating.casinoWin,
                                    "ircNumber": createdRating.ircNumber,
                                    "createdUser": {
                                        "userId": createdRating.createdUser.userId
                                    },
                                    "submittedUser": {
                                        "userId": createdRating.createdUser.userId
                                    },
                                    "submittedDtm": createdRating.createDtm
                                };
                                tableDashboardService.updateManualRating(createdRating.ratingId, request).then(function (data) {
                                    showManualRatings();
                                    clearManualRatingForm();

                                    logger.info($translate.instant('application.app.TREASURY_LABELS.MESSAGE.RATING_STATUS_CREATED'));
                                    $('#modal-manual-ratings').modal('hide');
                                }, function () {
                                    showManualRatings();
                                    $('#modal-manual-ratings').modal('hide');
                                });
                            }
                            else {
                                showManualRatings();
                                clearManualRatingForm();

                                logger.info($translate.instant('application.app.TREASURY_LABELS.MESSAGE.RATING_STATUS_CREATED'));
                                $('#modal-manual-ratings').modal('hide');
                            }
                        });
                    }
                    else {
                        logger.info('Please add a player');
                    }
                };


                vm.createRatingModal = function () {
                    clearManualRatingForm();

                    $scope.manualRatingForm.table.id = $stateParams.tableId;
                    $scope.manualRatingForm.table.name = topologyData.topologyMap.get(parseInt($stateParams.tableId));
                    $scope.manualRatingForm.createdUserId = $rootScope.decodedJwt.userId;
                    $scope.manualRatingForm.createdBy = $rootScope.decodedJwt.lastName +
                        ', ' + $rootScope.decodedJwt.firstName +
                        ' (' + $rootScope.decodedJwt.employeeId + ')';
                    $scope.playerDivHide = true;
                    $scope.playerSelected = false;
                    $scope.error = false;
                    $scope.filterType = 'Player ID';
                    $scope.filterTypeTranslated = 'application.app.common.labels.PLAYERID';
                    $('#modal-manual-ratings').modal('show');
                    $scope.swipeActivated = true;
                    commonService.autoDetectCardSwipe(function (cardVal) {
                        getPlayerDetailOnCardSWipe(cardVal);
                    });
                    $timeout(function () { $("#rating-player-id").focus()}, 500);

                };

                $(document).on('hide.bs.modal','#modal-manual-ratings', function () {
                    $scope.swipeActivated = false;

                });


                function getPlayerDetailOnCardSWipe(cardData) {

                    tableDashboardService.getSwipedPlayer(cardData).then(function (data) {
                        $scope.error = false;
                        if (!data || !data.length || data[0].anonymous == true) {
                            $scope.manualRatingForm.player.name = '';
                            logger.warn($translate.instant('application.app.common.labels.PLAYERNOTFOUND'));
                            return;
                        }

                        if (data[0].casinoPlayer.banned == false) {
                            $scope.manualRatingForm.player.name = data[0].casinoPlayer.lastName + ', ' + data[0].casinoPlayer.firstName + ' (#' + data[0].casinoPlayer.casinoPlayerId + ')';
                            $scope.manualRatingForm.player.id = data[0].playerId;
                            $scope.playerSelected = true;
                        } else {
                            logger.warn($translate.instant('application.app.TABLE_DASH_LABELS.MANUAL_RATINGS.CANT_RATE_BAN_PLR'));
                            $scope.manualRatingForm.player.name = '';
                        }
                        processSearchPlayerByFirstLastName(data);
                    }, function error() {
                        $scope.error = true;
                        $scope.loader = false;
                    });
                };

                vm.createSearchPlayer = function () {
                    $scope.playerSelected = false;
                    $scope.playerList = [];
                    $scope.error = false;
                    $scope.manualRatingForm.player.id = $scope.manualRatingForm.player.name;
                    $scope.loader = true;
                    $scope.selectedPlayer = "";
                    $scope.selectedIndex = 0;

                    if ($scope.filterType == 'First Name') {
                        tableDashboardService.getPlayerByFirstLastName($scope.manualRatingForm.player.id).then(function (data) {
                            processSearchPlayerByFirstLastName(data);
                        }, function error() {
                            $scope.error = true;
                            $scope.loader = false;
                        });

                    } else if ($scope.filterType == 'Last Name') {
                        tableDashboardService.getPlayerByLastName($scope.manualRatingForm.player.id).then(function (data) {
                            processSearchPlayerByFirstLastName(data);
                        }, function error() {
                            $scope.error = true;
                            $scope.loader = false;
                        });

                    } else if ($scope.filterType == 'Player ID') {
                        tableDashboardService.getPlayerByCasinoPlayerId($scope.manualRatingForm.player.id).then(function (data) {
                            processSearchPlayerByFirstLastName(data);
                        }, function error() {
                            $scope.error = true;
                            $scope.loader = false;
                        });
                    }
                };

                vm.selectPlayer = function (player, index) {
                    $scope.selectedPlayer = player.casinoPlayer.casinoPlayerId;
                    $scope.selectedIndex = index;
                    $scope.playerImageloader = true;
                    tableDashboardService.getPlayerByCasinoPlayerId(player.casinoPlayer.casinoPlayerId).then(function (data) {
                            $scope.playerImageloader = false;
                            $scope.manualRatingForm.player.id = data[0].playerId;
                            if (data != null) {
                                if (player.casinoPlayer.banned == false) {
                                    $scope.manualRatingForm.player.name = data[0].casinoPlayer.lastName + ', ' + data[0].casinoPlayer.firstName + ' (#' + data[0].casinoPlayer.casinoPlayerId + ')';
                                }
                                $scope.playerSelected = true;
                                $scope.playerImageUrl = data[0].casinoPlayer.imageUrl;
                            }

                    });

                    if (player.casinoPlayer.banned == false) {
                    }
                    else {
                        logger.warn($translate.instant('application.app.TABLE_DASH_LABELS.MANUAL_RATINGS.CANT_RATE_BAN_PLR'));
                        $scope.manualRatingForm.player.name = '';
                        $scope.playerImageloader = false;
                    }

                };

                vm.changeNumber = function (arg) {
                    changeNumberForForm($scope.submitForm, arg);
                };

                vm.changeNumber1 = function (arg) {
                    changeNumberForForm($scope.manualRatingForm, arg);
                };

                vm.submitManualRating = function () {
                    $scope.submitForm.endDtm = moment($scope.submitForm.endDtm);
                    $scope.submitForm.startDtm = moment($scope.submitForm.startDtm);
                    var x = $scope.submitForm.startDtm.toISOString().split('.000Z');
                    var x1 = $scope.submitForm.endDtm.toISOString().split('.000Z');
                    var userId = $rootScope.decodedJwt.userId;

                    $scope.startTime1 = x[0] + 'Z';
                    $scope.endTime1 = x1[0] + 'Z';

                    var data = {
                        "ratingId": $scope.rating.ratingId,
                        "manuallRatingStatus": "PENDING",
                        "player": {
                            "playerId": $scope.submitForm.player.id
                        },
                        "tableId": $scope.submitForm.table.id,
                        "seatIdx": $scope.submitForm.seatIdx,
                        "startDtm": $scope.startTime1,
                        "endDtm": $scope.endTime1,
                        "gamingDay": $rootScope.calendarDate,
                        "cashBuyIn": $scope.submitForm.cashBuyIn,
                        "avgBet": $scope.submitForm.avgBet,
                        "casinoWin": $scope.submitForm.casinoWin,
                        "ircNumber": $scope.submitForm.ircNumber,
                        "createdUser": {
                            "userId": $scope.submitForm.createdBy
                        },
                        "submittedUser": {
                            "userId": userId
                        },
                        "submittedDtm": $scope.startTime1
                    };

                    tableDashboardService.updateManualRating($scope.rating.ratingId, data).then(function (data) {
                        showManualRatings();
                        clearSubmitForm();

                        logger.info($translate.instant('application.app.TREASURY_LABELS.MESSAGE.RATING_STATUS_UPDATED'));
                        $('#modal-manual-ratings-approv').modal('hide');
                    });
                };

                vm.selectFilterType = function (arg) {
                    if (arg == 'id') {
                        $scope.filterType = 'Player ID';
                        $scope.filterTypeTranslated = 'application.app.common.labels.PLAYERID';
                    } else if (arg == 'fn') {
                        $scope.filterType = 'First Name';
                        $scope.filterTypeTranslated = 'application.app.common.labels.FIRST_NAME';
                    } else if (arg == 'ln') {
                        $scope.filterType = 'Last Name';
                        $scope.filterTypeTranslated = 'application.app.common.labels.LAST_NAME';
                    }
                };

                $scope.onEndTimeSet = function (newDate, oldDate) {
                    var startTime = moment($scope.manualRatingForm.startDtm);
                    var endTime = moment(newDate);
                    var duration = moment.duration(endTime.diff(startTime));

                    $scope.manualRatingForm.totalTime = formatDuration(duration);
                };

                $scope.onEndTimeSet1 = function (newDate, oldDate) {
                    var startTime = moment($scope.submitForm.startDtm);
                    var endTime = moment(newDate);
                    var duration = moment.duration(endTime.diff(startTime));
                    $scope.submitForm.totalTime = formatDuration(duration);
                };

                vm.beforeRenderDate = function ($view, $dates, $leftDate, $upDate, $rightDate) {
                    processBeforeRenderForm($scope.manualRatingForm, $view, $dates);
                };

                vm.beforeRenderDate1 = function ($view, $dates, $leftDate, $upDate, $rightDate) {
                    processBeforeRenderForm($scope.submitForm, $view, $dates);
                };

                $scope.filterInput = function (event) {
                    var keyCode = ('which' in event) ? event.which : event.keyCode;
                    if (keyCode == 69 || keyCode == 101) {
                        event.stopPropagation();
                        event.preventDefault();
                    }
                };

                $scope.handlePaste = function (e) {
                    var clipboardData, pastedData;

                    // Get pasted data via clipboard API
                    clipboardData = e.clipboardData || window.clipboardData;
                    pastedData = clipboardData.getData('Text').toUpperCase();

                    if (pastedData.indexOf('E') > -1) {
                        //alert('found an E');
                        e.stopPropagation();
                        e.preventDefault();
                    }
                };

                vm.formValidateCreateSave = function () {
                    return !($scope.createPermission && $scope.manualRatingForm.startDtm && $scope.playerSelected
                    && ($scope.manualRatingForm.avgBet > 0 || !$scope.manualRatingForm.avgBet)
                    && ($scope.manualRatingForm.cashBuyIn > 0 || !$scope.manualRatingForm.cashBuyIn));
                };

                vm.formValidate = function () {
                    return !($scope.createPermission && $scope.manualRatingForm.startDtm && $scope.manualRatingForm.endDtm
                    && $scope.manualRatingForm.cashBuyIn >= 0
                    && $scope.playerSelected && $scope.manualRatingForm.avgBet > 0
                    && Number.isInteger($scope.manualRatingForm.casinoWin)
                    && ($scope.manualRatingForm.ircNumber >= 0 || !$scope.manualRatingForm.ircNumber));
                };

                vm.formValidateForUpdateSave = function () {
                    return !($scope.approvePermission && $scope.submitForm.startDtm && ($scope.submitForm.avgBet > 0 || !$scope.submitForm.avgBet)
                    && ($scope.submitForm.cashBuyIn > 0 || !$scope.submitForm.cashBuyIn));
                };

                vm.formValidateForSubmit = function () {
                    return !($scope.approvePermission && $scope.submitForm.startDtm && $scope.submitForm.endDtm
                    && $scope.submitForm.avgBet > 0 && Number.isInteger($scope.submitForm.casinoWin)
                    && ($scope.submitForm.ircNumber >= 0 || !$scope.submitForm.ircNumber));
                };

                $scope.onTimeSet = function (newDate, oldDate) {
                    $scope.manualRatingForm.startDtm = newDate;
                    if ($scope.manualRatingForm.endDtm) {
                        if ($scope.manualRatingForm.startDtm.toString() >= $scope.manualRatingForm.endDtm.toString()) {
                            $scope.manualRatingForm.endDtm = moment(newDate).add(5, 'minutes');
                        }
                        var duration = moment.duration(moment($scope.manualRatingForm.endDtm).diff(newDate));

                        $scope.manualRatingForm.totalTime = formatDuration(duration);
                    }

                    $scope.$broadcast('START_TIME_CHANGED');
                };

                $scope.onTimeSetSubmit = function (newDate, oldDate) {
                    $scope.submitForm.startDtm = newDate;
                    if ($scope.submitForm.endDtm) {
                        if(new Date ($scope.submitForm.startDtm.toString()) >= new Date ($scope.submitForm.endDtm.toString())){
                            $scope.submitForm.endDtm = moment($scope.submitForm.startDtm).add(5, 'minutes');
                        }
                        var duration = moment.duration(moment($scope.submitForm.endDtm).diff($scope.submitForm.startDtm));

                        $scope.submitForm.totalTime = formatDuration(duration);
                    }

                    $scope.$broadcast('START_TIME_CHANGED');
                };

                $scope.beforeRenderStartDate = function ($view, $dates) {
                    var activeDate = moment();
                    for (var i = 0; i < $dates.length; i++) {
                        if ($dates[i].localDateValue() >= activeDate.valueOf()) {
                            $dates[i].selectable = false;
                        }
                    }
                };

                $scope.$on('EMIT_SORT_CHANGE', function (event, sortObj) {
                    if (sortObj.viewName == 'manualRatingData') {
                        vm.sortObj.sortField = sortObj.sortField;
                        vm.sortObj.sortOrder = sortObj.sortOrder;
                        showManualRatings();
                    }
                });

                $scope.$on('EMIT_START_LIMIT', function (event, startLimitData) {
                    if (startLimitData.viewName == 'manualRatingData') {
                        $scope.manualRatingDataStart = startLimitData.startLength;
                        $scope.manualRatingDataLimit = startLimitData.pageLimit;
                        showManualRatings();
                    }
                });

                $scope.$on('SELECTED_FILTER_OBJECT', function (event, filterObj, columnName, viewName) {
                    if (viewName == 'manualRatingData') {
                        var keys;
                        if (filterObj[columnName].toUpperCase() == 'ALL') {
                            for (var i = 0; i < vm.manualRatingFilterArray.length; i++) {
                                keys = Object.keys(vm.manualRatingFilterArray[i]);
                                if (columnName == keys) {
                                    vm.manualRatingFilterArray.splice(i, 1);
                                }
                            }
                        } else {
                            for (var j = 0; j < vm.manualRatingFilterArray.length; j++) {
                                keys = Object.keys(vm.manualRatingFilterArray[j], columnName);
                                if (columnName == keys) {
                                    vm.manualRatingFilterArray.splice(j, 1);
                                }
                            }
                            vm.manualRatingFilterArray.push(filterObj);
                        }
                    }
                });

                /**
                 * Process before render form.
                 * @param form
                 */
                function processBeforeRenderForm(form, $view, $dates) {
                    var activeDate = moment(form.startDtm);
                    var activeDate1 = moment();
                    for (var i = 0; i < $dates.length; i++) {
                        $dates[i].selectable = !($dates[i].localDateValue() <= activeDate.valueOf() || $dates[i].localDateValue() >= activeDate1.valueOf());
                    }
                }

                /**
                 * Change seat index.
                 * @param form
                 * @param arg
                 */
                function changeNumberForForm(form, arg) {

                    $scope.tableId = $scope.tableId ? $scope.tableId : form.table.id;

                    commonService.getTablePositions().then(function () {
                        vm.allData = commonService.getAllData();

                        var map = vm.allData.tablePositionMap;

                        var tablePositionsCount = parseInt(map.get(parseInt($scope.tableId)));

                        var availablePositions = tablePositionsCount === 7 ? [1, 2, 3, 5, 6, 7, 8] : [1, 2, 3, 5, 6];
                        var seatNumber = form.seatIdx;

                        if (seatNumber != null) {
                            var newSeatIndex = availablePositions.indexOf(seatNumber) + (arg === 'inc' ? 1 : -1);
                            if (isLucky6Enabled) {
                                if (tablePositionsCount === 5 && newSeatIndex === 2) {
                                    newSeatIndex = arg === 'inc' ? 3 : 1;
                                } else if (tablePositionsCount === 7 && newSeatIndex === 3) {
                                    newSeatIndex = arg === 'inc' ? 4 : 2;
                                }
                            }

                            if (newSeatIndex >= 0 && newSeatIndex < tablePositionsCount) {
                                form.seatIdx = availablePositions[newSeatIndex];
                            }
                        } else {
                            form.seatIdx = 1;
                        }
                    });
                }

                /**
                 * Process search player by first or last name.
                 * @param data
                 */
                function processSearchPlayerByFirstLastName(data) {
                    $scope.loader = false;
                    if (data.length) {
                        $scope.playerList = data;
                        $scope.playerDivHide = false;
                        $scope.playerImageUrl = $scope.playerImageUrl = data[0].casinoPlayer.imageUrl;
                        $scope.playerImageloader = false;
                    } else {
                        $scope.error = true;
                        $scope.playerDivHide = true;
                    }
                }

                /**
                 * Create submit manual rating form($scope.submitForm)
                 */
                function clearSubmitForm() {
                    $scope.submitForm = {
                        'table': {
                            id: null, 'name': ''
                        },
                        'createdBy': null,
                        'createdByUser': '-',
                        player: {
                            id: null,
                            name: null
                        },
                        seatIdx: 1,
                        cashBuyIn: 0,
                        avgBet: 0,
                        casinoWin: 0
                    };
                }

                /**
                 * Create manual rating form($scope.manualRatingForm)
                 */
                function clearManualRatingForm() {
                    $scope.manualRatingForm = {
                        'table': {
                            id: null, 'name': ''
                        },
                        'createdBy': null,
                        player: {
                            id: null,
                            name: null
                        },
                        ircNumber: null,
                        seatIdx: 1,
                        cashBuyIn: '',
                        avgBet: '',
                        casinoWin: '',
                        totalTime: '00:00'
                    };
                }

                /**
                 * Return duration in format "H:i"
                 * @param duration
                 * @returns {string}
                 */
                function formatDuration(duration) {
                    var hh = duration.hours();
                    var mm = duration.minutes();

                    var h = hh < 10 ? '0' + hh : hh;
                    var m = mm < 10 ? '0' + mm : mm;

                    return h + ':' + m;
                }

                /**
                 * Format filter objects values.
                 * @param filterObj
                 * @param responseData
                 */
                function processFilterValues(filterObj, responseData) {
                    var filters = responseData.successObj.Filters;
                    filterObj.fTableIds = [];
                    filterObj.createdByUser = [];
                    filterObj.approvedByUser = [];
                    filterObj.playerId = [];

                    for (var tId = 0; tId < filters.fTableIds.length; tId++) {
                        var itemId = filters.fTableIds[tId];
                        filterObj.fTableIds.push({
                            name: $scope.topologyMap.get(itemId),
                            filterValue: itemId
                        });
                    }

                    for (var pId = 0; pId < filters.playerId.length; pId++) {
                        var item = filters.playerId[pId];
                        filterObj.playerId.push({
                            name: item.casinoPlayer.lastName + ', ' + item.casinoPlayer.firstName + ' (' + item.casinoPlayer.casinoPlayerId + ')',
                            filterValue: item.playerId
                        });
                    }

                    for (var ucId = 0; ucId < filters.createdByUser.length; ucId++) {
                        var ucItem = filters.createdByUser[ucId];
                        filterObj.createdByUser.push({
                            name: ucItem.lastName + ', ' + ucItem.firstName + ' (' + ucItem.employeeNumber + ')',
                            filterValue: ucItem.userId
                        });
                    }

                    for (var uaId = 0; uaId < filters.approvedByUser.length; uaId++) {
                        var uaItem = filters.approvedByUser[uaId];
                        filterObj.approvedByUser.push({
                            name: uaItem.userId == -17 ? '(Blanks)':uaItem.lastName + ', ' + uaItem.firstName + ' (' + uaItem.employeeNumber + ')',
                            filterValue: uaItem.userId
                        });
                    }
                }

                /**
                 * Format representation of data.
                 * @param manualRatingList
                 */
                function processManualRatingList(manualRatingList) {
                    for (var i = 0; i < manualRatingList.length; i++) {
                        var manualRatingItem = manualRatingList[i];
                        if (manualRatingItem.startDtm != null) {
                            var duration = moment.duration(moment(manualRatingItem.endDtm).diff(manualRatingItem.startDtm));
                            manualRatingItem.totalTime = formatDuration(duration);

                            if (!manualRatingItem.createdUser) {
                                manualRatingItem.createdUsername = "-"
                            }
                            else {
                                manualRatingItem.createdUsername = manualRatingItem.createdUser.firstName + " " + manualRatingItem.createdUser.lastName + " (" + manualRatingItem.createdUser.employeeNumber + ")";
                            }
                            if (!manualRatingItem.approvedUser && !manualRatingItem.canceledUser) {
                                manualRatingItem.approvedUsername = "-";
                            }
                            if (manualRatingItem.canceledUser) {
                                manualRatingItem.canceledUsername = manualRatingItem.canceledUser.firstName + " " + manualRatingItem.canceledUser.lastName + " (" + manualRatingItem.canceledUser.employeeNumber + ")";
                            }
                            else if(manualRatingItem.approvedUser){
                                manualRatingItem.approvedUsername = manualRatingItem.approvedUser.firstName + " " + manualRatingItem.approvedUser.lastName + " (" + manualRatingItem.approvedUser.employeeNumber + ")";
                            }
                        }
                        manualRatingItem.tableName = $scope.topologyMap.get(manualRatingItem.tableId)
                    }
                }

                activate();
            },
            controllerAs: 'vm'
        }
    }

    app.filter('formatTime', function () {
        return function (time) {
            if (time != null) {

                return moment(time).format('hh:mm A');
            }
        };
    });

    app.filter('formatTime1', function () {
        return function (time) {
            if (time != null) {

                return moment(time).format('hh:mm A');
            }
        };
    });
})();
