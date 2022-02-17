(function () {
    'use strict';


    angular
        .module('wdts.srvfilter', [])
        .directive('srvFilterDropDown', srvFilterDropDown)
        .filter('processNullValues', processNullValues);

    /* @ngInject */
    function srvFilterDropDown() {
        var directive = {
            bindToController: true,
            controller: srvFilterDropDownController,
            controllerAs: 'vm',
            restrict: 'EA',
            scope: {
                type: '@',
                translationKey: '@',
                filterTitle: '@',
                columnName: '@',
                viewName: '@',
                startofRangeColumnName: '@',
                endofRangeColumnName: '@',
                startofRangeColumnValue: '=',
                endofRangeColumnValue: '=',
                filterOptions: '=',
                isTopology: '@',
                translatePath: '@',
                defaultFilterOption: '@',
                defaultFilterOptions: '=',
                filterDateSelector: '@',
                filterColApiName:'@',
                filterTopologyId:'=',
                filterColApiPath: '='
            },
            templateUrl: function (elem, attr) {
                return 'bower_components/wdts-common-ui/src/client/app/blocks/srvfilters/srvfilter-' + attr.type + '.html';
            }
        };

        /* @ngInject */
        function srvFilterDropDownController($scope, commonService, $filter, $translate, $rootScope,filterApiFactory) {
            var vm = this;
            var queryObj = {};

            if (angular.version.minor < 3) {
                vm.viewName = $scope.viewName;
                vm.filterOptions = $scope.filterOptions;
                vm.defaultFilterOption = $scope.defaultFilterOption;
                vm.defaultFilterOptions = $scope.defaultFilterOptions;
                vm.columnName = $scope.columnName;
                vm.type = $scope.type;
                vm.filterTitle = $scope.filterTitle;
                vm.filterDateSelector = $scope.filterDateSelector;
                vm.translatePath = $scope.translatePath;
                vm.filterColApiName = $scope.filterColApiName;
                vm.filterTopologyId = $scope.filterTopologyId;
                vm.filterColApiPath = $scope.filterColApiPath
            }
            $scope.filtersModel = {
                allCheck: true
            };
            $scope.type = vm.type;
            $scope.filterTitle = vm.filterTitle;
            $scope.filterOptions = vm.filterOptions || [];
            $scope.defaultFilterOption = vm.defaultFilterOption || '';
            $scope.defaultFilterOptions = vm.defaultFilterOptions || null;
            $scope.columnName = vm.columnName;
            $scope.translatePath = vm.translatePath;
            $scope.filterColApiName = vm.filterColApiName;
            $scope.filterTopologyId = vm.filterTopologyId;
            $scope.filterColApiPath = vm.filterColApiPath;
            $scope.startofRangeColumnName = vm.startofRangeColumnName;
            $scope.endofRangeColumnName = vm.endofRangeColumnName;
            $scope.startofRangeColumnValue = vm.startofRangeColumnValue || (new Date()).toJSON();
            $scope.endofRangeColumnValue = vm.endofRangeColumnValue || (new Date()).toJSON();
            $scope.filterSelectedOPtion = '-- SELECT --';
            $scope.filterCheckedSelectedOPtion = [];
            $scope.filterCheckedSelectedValue = [];
            $scope.filterTopologyOptions = [];
            $scope.filterTopologyCheckedSelectedOPtion = [];
            $scope.filterDateSelector = vm.filterDateSelector;
            $scope.topologData = commonService.getAllData().dataTree;

            vm.selectFilterOption = selectFilterOption;
            vm.selectCheckedFilterOption = selectCheckedFilterOption;
            vm.selectAllFilterOption = selectAllFilterOption;
            vm.selectRangeOption = selectRangeOption;
            vm.makeFilterQueryString = makeFilterQueryString;
            vm.displayFilterName = displayFilterName;
            vm.displayFilterTopologyName = displayFilterTopologyName;
            vm.filterDateChange = filterDateChange;
            vm.translateString = translateString;

            vm.getColumnData = getColumnData;
            vm.isFilterOptions = false;

            function getColumnData() {
                //console.log($scope.filterColApiPath+":::"+$scope.filterTopologyId + "::::" + "$scope.filterColApiName:::" + $scope.filterColApiName);
                if ($scope.filterColApiName) {
                    vm.isFilterOptions = true;
                    $scope.filterOptions = null;
                    /*treasury approvals*/
                    if(!$scope.filterColApiName) $scope.filterColApiName = '';
                    if(!$scope.filterTopologyId) $scope.filterTopologyId = '';

                    var apiPath = $scope.filterColApiPath + $scope.filterColApiName + "?topologyIds=" + $scope.filterTopologyId;
                    filterApiFactory.getColumnDataResponse($scope.columnName,apiPath);

                    $rootScope.$on("filteroptionsevent",function(event,data){
                        //console.log("$scope.filterOptions:::"+JSON.stringify(data))
                        $scope.filterOptions = data;
                        if ($scope.filterOptions.length > 0) {
                            vm.isFilterOptions = false;
                            if($scope.filtersModel.allCheck){
                                allSelected($scope.filtersModel.allCheck)
                                if($scope.columnName == 'fSources'){
                                    getTopologyName()
                                }
                            }

                            var unregisterFn = $rootScope.$on('filteroptionsevent', function () {});
                            $scope.$on('$destroy', unregisterFn);
                        }
                    })



                }
            }

            function allSelected(val) {
                for (var j = 0; j < $scope.filterOptions.length; j++) {
                    var name;
                    if (angular.isObject($scope.filterOptions[j])) {
                        $scope.filtersModel[j] = val;
                        if (val) {
                            $scope.filterCheckedSelectedOPtion.push($scope.filterOptions[j].name);
                            $scope.filterCheckedSelectedValue.push($scope.filterOptions[j].filterValue);
                        }
                    } else {
                        name = $scope.filterOptions[j];
                        $scope.filtersModel[j] = val;
                        if (val) {
                            $scope.filterCheckedSelectedOPtion.push(name);
                        }

                    }
                }
            }

            function getTopologyName(){
                for (var i = 0; i < $scope.filterOptions.length; i++) {
                    var name;
                    $scope.filterCheckedSelectedOPtion = [];
                    $scope.filterTopologyCheckedSelectedOPtion = [];
                    $scope.filterTopologyOptions = [];
                    if (vm.isTopology)
                    {
                        var opt = null;
                        for (var j = 0; j < $scope.topologData.length; j++) {
                            if ($scope.filterOptions[i] == $scope.topologData[j].nodeId) {
                                opt = {
                                    topologyName: $scope.topologData[j].name,
                                    topologyId: $scope.filterOptions[i]
                                };
                                break;
                            }
                        }
                    }
                    if (opt) {
                        $scope.filterCheckedSelectedOPtion.push(opt.topologyId);
                        $scope.filterTopologyCheckedSelectedOPtion.push(opt.topologyName);
                        $scope.filterTopologyOptions.push(opt);
                        name = opt.topologyName;
                    }
                }
            }

            if (vm.type === 'ddwithcheckbox' || vm.type === 'dd') {
                $scope.filterOptions = sortFilterOptions($scope.filterOptions);
            }

            for (var i = 0; i < $scope.filterOptions.length; i++) {
                var name;
                if (vm.isTopology) {
                    var opt = null;
                    if (angular.isObject($scope.filterOptions[i])) {
                        opt = $scope.filterOptions[i];
                    } else {
                        if (!$scope.filterOptions[i] || $scope.filterOptions[i] == -17) {
                            opt = {
                                topologyName: '(Blanks)',
                                topologyId: -17
                            };
                        } else {
                            for (var j = 0; j < $scope.topologData.length; j++) {
                                if ($scope.filterOptions[i] == $scope.topologData[j].nodeId) {
                                    opt = {
                                        topologyName: $scope.topologData[j].name,
                                        topologyId: $scope.filterOptions[i]
                                    };
                                    break;
                                }
                            }
                        }
                    }
                    if (opt) {
                        $scope.filterCheckedSelectedOPtion.push(opt.topologyId);
                        $scope.filterTopologyCheckedSelectedOPtion.push(opt.topologyName);
                        $scope.filterTopologyOptions.push(opt);
                        name = opt.topologyName;
                    }
                } else {
                    if ($scope.type != 'time') {
                        var isObject = angular.isObject($scope.filterOptions[i]);
                        if (!isObject) {
                            $scope.filterOptions[i] = {
                                name: (!$scope.filterOptions[i] || $scope.filterOptions[i] == '-17') ? '(Blanks)' : $scope.filterOptions[i],
                                filterValue: $scope.filterOptions[i] || '-17'
                            }
                        }
                    }

                    var defaultPresent = !$scope.defaultFilterOption && !$scope.defaultFilterOptions;
                    var isDefaultArray = angular.isArray($scope.defaultFilterOptions);

                    // var isSelected = (defaultPresent && !isObject) || (!defaultPresent && !isObject && ((isDefaultArray && $scope.defaultFilterOptions.indexOf($scope.filterOptions[i]) >= 0) || $scope.defaultFilterOption === $scope.filterOptions[i]));
                    // var isSelectedObj = (defaultPresent && isObject) || (!defaultPresent && isObject && ((isDefaultArray && $scope.defaultFilterOptions.indexOf($scope.filterOptions[i].name) >= 0) || $scope.defaultFilterOption === $scope.filterOptions[i].name));
                    var isSelectedObj = defaultPresent || (!defaultPresent && ((isDefaultArray && $scope.defaultFilterOptions.indexOf($scope.filterOptions[i].name) >= 0) || $scope.defaultFilterOption === $scope.filterOptions[i].name));

                    if (isSelectedObj) {
                        $scope.filterCheckedSelectedOPtion.push($scope.filterOptions[i].name);
                        $scope.filterCheckedSelectedValue.push($scope.filterOptions[i].filterValue);
                    }
                    // else if (isSelected) {
                    //     $scope.filterCheckedSelectedOPtion.push((!$scope.filterOptions[i] || $scope.filterOptions[i] == -17) ? '(' + $translate.instant('Blanks') + ')' : $scope.filterOptions[i]);
                    // }
                }

                if (vm.type === 'ddwithcheckbox' && !$scope.defaultFilterOption && !$scope.defaultFilterOptions) {
                    $scope.filtersModel[i] = true;
                    $scope.filterSelectedOPtion = 'All';
                    if (vm.isTopology) {
                        $scope.filterTopologySelectedOPtion = 'All';
                    }

                } else if (vm.type === 'ddwithcheckbox') {
                    var val = angular.isObject($scope.filterOptions[i]) ? $scope.filterOptions[i].name : $scope.filterOptions[i];
                    $scope.filtersModel[i] = (val === $scope.defaultFilterOption) || ($scope.defaultFilterOptions && $scope.defaultFilterOptions.indexOf(val) >= 0);
                    $scope.filtersModel.allCheck = false;
                }
            }

            if ((!$scope.filterOptions || !$scope.filterOptions.length) && vm.type === 'ddwithcheckbox') {
                $scope.filterSelectedOPtion = 'All';
            }

            if ($scope.defaultFilterOption) {
                $scope.filterSelectedOPtion = $scope.defaultFilterOption.toString();
            }
            if ($scope.defaultFilterOptions) {
                $scope.filterSelectedOPtion = $scope.defaultFilterOptions.join(',');
            }

            if ($scope.type == 'range') {
                initRangeData();
            }

            function sortFilterOptions(options) {
                var empty = [];
                var list = [];
                angular.forEach(options, function (item) {
                    var name = item;
                    if (angular.isObject(item)) {
                        name = item.name;
                    }

                    if (!name || name == '-17' || name == '(Blanks)') {
                        empty.push(item);
                    } else {
                        list.push(item);
                    }
                });
                list.sort(function (a, b) {
                    var val1 = a, val2 = b;
                    if (angular.isObject(a)) {
                        val1 = a.name;
                        val2 = b.name;
                    }
                    return val1 < val2 ? -1 : 1;
                });
                return list.concat(empty);
            }

            function initRangeData() {
                $scope.startofRangeColumnName = vm.startofRangeColumnName;
                $scope.endofRangeColumnName = vm.endofRangeColumnName;

                $scope.startOfRangeForDisplay = $filter('date')($scope.startofRangeColumnValue, "HH:mm");
                $scope.endOfRangeForDisplay = $filter('date')($scope.endofRangeColumnValue, "HH:mm");

                $scope.rangeDatePart = $scope.startofRangeColumnValue.split('T')[0];

                $scope.srange_utc_string = new Date($scope.startofRangeColumnValue);
                $scope.erange_utc_string = new Date($scope.endofRangeColumnValue);

                $scope.fromFilterObj = {
                    hrs: $filter('date')($scope.startofRangeColumnValue, "HH"),
                    min: $filter('date')($scope.startofRangeColumnValue, "mm"),
                    day: $filter('date')($scope.startofRangeColumnValue, "dd"),
                    month: $filter('date')($scope.startofRangeColumnValue, "MM"),
                    year: $filter('date')($scope.startofRangeColumnValue, "yyyy")
                };

                $scope.toFilterObj = {
                    hrs: $filter('date')($scope.endofRangeColumnValue, "HH"),
                    min: $filter('date')($scope.endofRangeColumnValue, "mm"),
                    day: $filter('date')($scope.endofRangeColumnValue, "dd"),
                    month: $filter('date')($scope.endofRangeColumnValue, "MM"),
                    year: $filter('date')($scope.endofRangeColumnValue, "yyyy")
                };
            }

            $scope.whenTimeChange = function (data) {
                vm.makeFilterQueryString();
            };

            $scope.$watch('srange_utc_string', function () {
                if ($scope.type == 'range') {
                    $scope.fromFilterObj = {
                        hrs: $filter('date')($scope.srange_utc_string, "HH"),
                        min: $filter('date')($scope.srange_utc_string, "mm"),
                        day: $filter('date')($scope.srange_utc_string, "dd"),
                        month: $filter('date')($scope.srange_utc_string, "MM"),
                        year: $filter('date')($scope.srange_utc_string, "yyyy")
                    };
                    vm.makeFilterQueryString();
                }

            });

            $scope.$watch('erange_utc_string', function () {
                if ($scope.type == 'range') {
                    $scope.toFilterObj = {
                        hrs: $filter('date')($scope.erange_utc_string, "HH"),
                        min: $filter('date')($scope.erange_utc_string, "mm"),
                        day: $filter('date')($scope.erange_utc_string, "dd"),
                        month: $filter('date')($scope.erange_utc_string, "MM"),
                        year: $filter('date')($scope.erange_utc_string, "yyyy")
                    };
                    vm.makeFilterQueryString();
                }
            });

            $scope.$on('CLEAR_FILTERS', function (e, list) {
                if (list.indexOf($scope.columnName) >= 0) {
                    if (vm.type === 'dd') {
                        $scope.filterSelectedOPtion = '-- SELECT --';
                        if (vm.isTopology) {
                            $scope.filterTopologySelectedOPtion = null;
                        } else {
                            $scope.filterSelectedValue = 'All';
                        }
                    } else if (vm.type === 'ddwithcheckbox') {
                        selectAllFilterOption($scope.filtersModel.allCheck = true);
                    } else if (vm.type === 'time') {
                        initTimeData();
                    } else if (vm.type === 'range') {
                        initRangeData();
                    } else if (vm.type === 'date') {
                        $scope.filterDate = null;
                        $scope.filterDateISO = null;
                    }
                    makeFilterQueryString();
                }
            });

            function selectFilterOption(option) {
                $scope.selectedOptionData = null;
                if (vm.isTopology) {
                    $scope.filterSelectedOPtion = option.topologyId;
                    $scope.filterTopologySelectedOPtion = option.topologyName;
                    $scope.selectedOptionData = option;
                } else {
                    if (angular.isObject(option)) {
                        $scope.filterSelectedOPtion = option.name;
                        $scope.selectedOptionData = option;
                    } else {
                        $scope.filterSelectedOPtion = option;
                    }
                    $scope.filterSelectedValue = angular.isObject(option) ? option.filterValue : option;
                }

                vm.makeFilterQueryString();
            }

            var onLangChanged = $rootScope.$watch('eng', function (langType) {
                var option = $scope.selectedOptionData;

                if (option && vm.isTopology) {
                    $scope.filterTopologySelectedOPtion = option.topologyName;
                } else if (option) {
                    $scope.filterSelectedOPtion = option.name;
                } else {
                    $scope.filterSelectedOPtion = $scope.filtersModel.allCheck ? 'All' : $scope.filterCheckedSelectedOPtion.toString();
                }
            });

            $scope.$on('$destroy', function () {
                onLangChanged();
            });

            function selectAllFilterOption(val) {
                $scope.filterCheckedSelectedOPtion = [];
                $scope.filterCheckedSelectedValue = [];
                $scope.filterTopologyCheckedSelectedOPtion = [];
                if (vm.isTopology) {
                    for (var i = 0; i < $scope.filterTopologyOptions.length; i++) {
                        var topology = $scope.filterTopologyOptions[i];
                        $scope.filtersModel[i] = val;
                        if (val) {
                            $scope.filterCheckedSelectedOPtion.push(topology.topologyId);
                            $scope.filterTopologyCheckedSelectedOPtion.push(topology.topologyName);
                        }
                    }
                } else {
                    allSelected(val);
                }

                if (val) {
                    $scope.filterSelectedValue = '';
                    $scope.filterSelectedOPtion = 'All';
                    if (vm.isTopology) {
                        $scope.filterTopologySelectedOPtion = 'All';
                    }
                } else {
                    $scope.filterSelectedOPtion = '-- SELECT --';
                    $scope.filterTopologySelectedOPtion = null;
                }

                vm.makeFilterQueryString();
            }

            function selectCheckedFilterOption(option, checked) {
                if (!option) {
                    option = '(' + $translate.instant('Blanks') + ')';
                }

                if (checked) {
                    if ($scope.filterCheckedSelectedOPtion.indexOf(option) < 0) {
                        if (option && option.hasOwnProperty('topologyName')) {
                            $scope.filterCheckedSelectedOPtion.push(option.topologyId);
                            $scope.filterTopologyCheckedSelectedOPtion.push(option.topologyName);
                        } else if (angular.isObject(option) && option.filterValue != null) {
                            $scope.filterCheckedSelectedOPtion.push(displayFilterName(option.name));
                            $scope.filterCheckedSelectedValue.push(option.filterValue);
                        } else {
                            $scope.filterCheckedSelectedOPtion.push(option == -17 || option.filterValue == null ? '(Blanks)' : option);
                        }

                        $scope.filtersModel.allCheck = ($scope.filterCheckedSelectedOPtion.length === $scope.filterOptions.length);
                    }
                }
                else {
                    var newIndex, valueIndex;
                    $scope.filtersModel.allCheck = false;
                    if (option && option.hasOwnProperty('topologyName')) {
                        newIndex = $scope.filterCheckedSelectedOPtion.indexOf(option.topologyId);
                        $scope.filterCheckedSelectedOPtion.splice(newIndex, 1);
                        $scope.filterTopologyCheckedSelectedOPtion.splice(newIndex, 1);
                    } else if (angular.isObject(option) && option.filterValue != null) {
                        newIndex = $scope.filterCheckedSelectedOPtion.indexOf(option.name);
                        valueIndex = $scope.filterCheckedSelectedValue.indexOf(option.filterValue);
                        $scope.filterCheckedSelectedOPtion.splice(newIndex, 1);
                        $scope.filterCheckedSelectedValue.splice(valueIndex, 1);
                    } else {
                        newIndex = $scope.filterCheckedSelectedOPtion.indexOf(option);
                        $scope.filterCheckedSelectedOPtion.splice(newIndex, 1);
                    }

                }

                if ($scope.filterCheckedSelectedOPtion.length === 0 && !vm.isTopology) {
                    $scope.filterSelectedOPtion = '-- SELECT --';
                    $scope.filterSelectedValue = null;
                } else if ($scope.filterTopologyCheckedSelectedOPtion.length === 0 && vm.isTopology) {
                    $scope.filterSelectedOPtion = '-- SELECT --';
                    $scope.filterTopologySelectedOPtion = null;
                } else {
                    if (vm.isTopology) {
                        $scope.filterSelectedOPtion = $scope.filtersModel.allCheck ? 'All' : $scope.filterCheckedSelectedOPtion.toString();
                        $scope.filterTopologySelectedOPtion = $scope.filtersModel.allCheck ? 'All' : $scope.filterTopologyCheckedSelectedOPtion.toString();
                    } else {
                        $scope.filterSelectedOPtion = $scope.filtersModel.allCheck ? 'All' : $scope.filterCheckedSelectedOPtion.toString();
                        if ($scope.filterCheckedSelectedValue.length) {
                            $scope.filterSelectedValue = $scope.filtersModel.allCheck ? '' : $scope.filterCheckedSelectedValue.toString();
                        }
                    }
                }

                vm.makeFilterQueryString();
            }

            function selectRangeOption() {
                vm.makeFilterQueryString();
            }

            function translateString(strToTranslate){
                var strFilterSelectedOption = strToTranslate.split(',');
                var arrSelectedFilterOptions = [];

                for (var i = 0; i < strFilterSelectedOption.length; i++) {
                    var translationString = $scope.translatePath ? $scope.translatePath + strFilterSelectedOption[i].toUpperCase() : strFilterSelectedOption[i];
                    var translation = $translate.instant(translationString);

                    arrSelectedFilterOptions[i] = translationString == translation ? strFilterSelectedOption[i] : translation;
                }

                return arrSelectedFilterOptions.toString();
            }

            if ($scope.type == 'time') {
                initTimeData();
            }

            function initTimeData() {
                $scope.rangeDatePart = $scope.startofRangeColumnValue.split('T')[0];
                //$scope.starttime_utc_string = $filter('date')($scope.startofRangeColumnValue, "HH:mm");
                $scope.starttime_utc_string = '-- SELECT --';
                $scope.filterTime = {
                    hrs: $filter('date')($scope.startofRangeColumnValue, "HH"),
                    min: $filter('date')($scope.startofRangeColumnValue, "mm")
                };
            }

            $scope.upTime = function (arg) {
                if (arg == 'hour') {
                    if ($scope.filterTime.hrs < 23) {
                        $scope.filterTime.hrs = parseInt($scope.filterTime.hrs) + 1;
                    } else {
                        $scope.filterTime.hrs = 0;
                    }
                    $scope.filterTime.hrs = $scope.addZero($scope.filterTime.hrs)
                } else if (arg == 'minute') {
                    if ($scope.filterTime.min < 59) {
                        $scope.filterTime.min = parseInt($scope.filterTime.min) + 1;
                    } else {
                        $scope.filterTime.min = 0;
                    }
                    $scope.filterTime.min = $scope.addZero($scope.filterTime.min)
                }
                $scope.starttime_utc_string = $scope.filterTime.hrs + ":" + $scope.filterTime.min;
                vm.makeFilterQueryString();
            };

            $scope.downTime = function (arg) {
                if (arg == 'hour') {
                    if ($scope.filterTime.hrs > 0) {
                        $scope.filterTime.hrs = parseInt($scope.filterTime.hrs) - 1;
                    } else {
                        $scope.filterTime.hrs = 23;
                    }
                    $scope.filterTime.hrs = $scope.addZero($scope.filterTime.hrs)
                } else if (arg == 'minute') {
                    if ($scope.filterTime.min > 0) {
                        $scope.filterTime.min = parseInt($scope.filterTime.min) - 1;
                    } else {
                        $scope.filterTime.min = 59;
                    }
                    $scope.filterTime.min = $scope.addZero($scope.filterTime.min)
                }
                $scope.starttime_utc_string = $scope.filterTime.hrs + ":" + $scope.filterTime.min;
                vm.makeFilterQueryString();
            };

            $scope.addZero = function (arg) {
                if (arg < 10) {
                    arg = "0" + arg
                }  // add zero in front of numbers < 10
                return arg;
            };

            function makeFilterQueryString() {
                if (['range', 'time', 'date'].indexOf($scope.type) < 0) {
                    var prepared = prepareSelected();
                    queryObj[$scope.columnName] = $scope.filterSelectedValue || ((['-- SELECT --', 'All'].indexOf(prepared) < 0) ? prepared : '');
                }
                else if ($scope.type == 'range') {
                    $scope.startOfRangeForQString = new Date($scope.srange_utc_string).toISOString();
                    $scope.endOfRangeForQString = new Date($scope.erange_utc_string).toISOString();
                    $scope.endOfRangeForQString = $scope.endOfRangeForQString.replace(":00.000Z", ":59.000Z");
                    queryObj[$scope.columnName] = $scope.startOfRangeForQString + '&' + $scope.endofRangeColumnName + '=' + $scope.endOfRangeForQString;
                }

                if ($scope.type == 'time') {
                    $scope.starttimeForQString = $scope.rangeDatePart + "T" + $scope.filterTime.hrs + ":" + $scope.filterTime.min + ":00";
                    $scope.starttimeForQString = new Date($scope.starttimeForQString).toISOString();
                    queryObj[$scope.columnName] = $scope.starttimeForQString;
                }

                if ($scope.type == 'date') {
                    queryObj[$scope.columnName] = $scope.filterDateISO;
                }
                $scope.$emit('SELECTED_FILTER_OBJECT', queryObj, $scope.columnName, vm.viewName);
            }

            function prepareSelected() {
                var list = $scope.filterSelectedOPtion.split(',');
                var blank = '(' + $translate.instant('Blanks') + ')';
                if (list.length > 1) {
                    var index = list.indexOf(blank);
                    list[index] = -17;
                    return list.join();
                } else {
                    return $scope.filterSelectedOPtion == blank ? '-17' : $scope.filterSelectedOPtion;
                }
            }

            function displayFilterName(option) {
                var str;
                if (angular.isObject(option)) {
                    option.name = typeof option.name === "string" && typeof vm.translationKey !== "undefined" ? option.name.replace(/\s/g, "_") : option.name;
                    str = $scope.translatePath ? $translate.instant($scope.translatePath + option.name.toUpperCase()) : option.name;
                } else {
                    str = typeof option.name === "string" && typeof vm.translationKey !== "undefined" ? option.replace(/\s/g, "_") : option;
                }
                str = typeof vm.translationKey !== "undefined" ? vm.translationKey + str : str;
                return str;
            }

            function displayFilterTopologyName(option) {
                return displayFilterName({
                    name: option.topologyName,
                    translate: option.translate
                });
            }

            function filterDateChange(date) {
                $scope.filterDate = $filter('date')(date, "yyyy-MM-dd HH:mm");
                $scope.filterDateISO = new Date(date).toISOString();
                makeFilterQueryString();
            }

            function getAllTranslation() {
                return $translate.instant('application.app.common.labels.ALL');
            }

            /*Date & Time picker event*/
            $scope.beforeRender = function ($view, $dates, $leftDate, $upDate, $rightDate) {
                var current = new Date(),
                    now = current.getTime() - (current.getTimezoneOffset() * 60000);

                for (var i = 0; i < $dates.length; i++) {
                    $dates[i].selectable = $dates[i].utcDateValue < now;
                }
            }

        }

        return directive;
    }

    function processNullValues($translate) {
        return function (input) {
            return (input === null || (typeof input === "string" && input.indexOf("null") > -1)) ? '(' + $translate.instant('Blanks') + ')' : input;
        };
    }
})();