/*
 filename: angular.integralui.treeview.js
 version : 2.3.0
 Copyright © 2014-2015 Lidor Systems. All rights reserved.

 This file is part of the "IntegralUI" Library. 

 The contents of this file are subject to the IntegralUI Studio for Web License, and may not be used except in compliance with the License.
 A copy of the License should have been installed in the product's root installation directory or it can be found at
 http://www.lidorsystems.com/products/web/studio/license-agreement.aspx.

 This SOFTWARE is provided "AS IS", WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language 
 governing rights and limitations under the License. Any infringement will be prosecuted under applicable laws.                           
 */

angular.module("integralui")
    // IntegralUITreeViewService ---------------------------------------------------------
    .factory("IntegralUITreeViewService", ["$rootScope", function ($rootScope) {
        var tempData = null;

        return {

            // Add/Remove ----------------------------------------------------------------

            addItem: function (name, item, parent) {
                $rootScope.$broadcast(name + "-add-item", item, parent);
            },

            clearItems: function (name, parent) {
                $rootScope.$broadcast(name + "-clear-items", parent);
            },

            insertItemAt: function (name, item, index, parent) {
                $rootScope.$broadcast(name + "-insert-item-at", item, index, parent);
            },

            insertItemBefore: function (name, item, refItem) {
                $rootScope.$broadcast(name + "-insert-item-before", item, refItem);
            },

            insertItemAfter: function (name, item, refItem) {
                $rootScope.$broadcast(name + "-insert-item-after", item, refItem);
            },

            removeItem: function (name, item) {
                $rootScope.$broadcast(name + "-remove-item", item);
            },

            removeItemAt: function (name, index, parent) {
                $rootScope.$broadcast(name + "-remove-item-at", index, parent);
            },

            // Data ----------------------------------------------------------------------

            exportToJSON: function (name, fields, flat, spacing) {
                $rootScope.$broadcast(name + "-export-json", fields, flat, spacing);
                var jsonData = this.getTempData();
                this.clearTempData();

                return jsonData ? jsonData : '';
            },

            loadData: function (name, data, parent, fields, flat) {
                $rootScope.$broadcast(name + "-load-data", data, parent, fields, flat);
            },

            // Editing -------------------------------------------------------------------

            openEditor: function (name, item) {
                $rootScope.$broadcast(name + "-open-editor", item);
            },

            closeEditor: function (name, item) {
                $rootScope.$broadcast(name + "-close-editor", item);
            },

            // Expand/Collapse -----------------------------------------------------------

            collapse: function (name, item) {
                $rootScope.$broadcast(name + "-collapse", item);
            },

            expand: function (name, item) {
                $rootScope.$broadcast(name + "-expand", item);
            },

            toggle: function (name, item) {
                $rootScope.$broadcast(name + "-toggle", item);
            },

            // Find ----------------------------------------------------------------------

            findItemById: function (name, id) {
                $rootScope.$broadcast(name + "-find-item-by-id", id);
                var item = this.getTempData();
                this.clearTempData();

                return item ? item : null;
            },

            findItemByText: function (name, text) {
                $rootScope.$broadcast(name + "-find-item-by-text", text);
                var item = this.getTempData();
                this.clearTempData();

                return item ? item : null;
            },

            getItemParent: function (name, item) {
                $rootScope.$broadcast(name + "-get-item-parent", item);
                var parent = this.getTempData();
                this.clearTempData();

                return parent ? parent : null;
            },

            // Filter --------------------------------------------------------------------

            filter: function (name, params) {
                $rootScope.$broadcast(name + "-filter", params);
            },

            // Focus ---------------------------------------------------------------------

            focus: function (name, item) {
                $rootScope.$broadcast(name + "-focus", item);
            },

            // General -------------------------------------------------------------------

            clearTempData: function () {
                tempData = null;
            },

            ensureVisible: function (name, item, pos) {
                $rootScope.$broadcast(name + "-ensure-visible", item, pos);
            },

            getCheckList: function (name, value) {
                $rootScope.$broadcast(name + "-get-check-list", value);
                var list = this.getTempData();
                this.clearTempData();

                return list ? list : [];
            },

            getItemLevel: function (name, item) {
                $rootScope.$broadcast(name + "-get-item-level", item);
                var level = this.getTempData();
                this.clearTempData();

                return level ? level : 0;
            },

            getFlatList: function (name, full) {
                $rootScope.$broadcast(name + "-get-flat-list", full);
                var list = this.getTempData();
                this.clearTempData();

                return list ? list : [];
            },

            getFullPath: function (name, item) {
                $rootScope.$broadcast(name + "-get-full-path", item);
                var path = this.getTempData();
                this.clearTempData();

                return path ? path : '';
            },

            getList: function (name, item, flat) {
                $rootScope.$broadcast(name + "-get-list", item, flat);
                var list = this.getTempData();
                this.clearTempData();

                return list ? list : [];
            },

            getTempData: function () {
                return tempData;
            },

            setTempData: function (data) {
                tempData = data;
            },

            // Loading -------------------------------------------------------------------

            beginLoad: function (name, item, animation) {
                $rootScope.$broadcast(name + "-begin-load", item, animation);
            },

            endLoad: function (name, item) {
                $rootScope.$broadcast(name + "-end-load", item);
            },

            // Reorder -------------------------------------------------------------------

            moveItem: function (name, item, targetItem, direction, position) {
                $rootScope.$broadcast(name + "-move-item", item, targetItem, direction, position);
            },

            // Selection -----------------------------------------------------------------

            clearSelection: function (name) {
                $rootScope.$broadcast(name + "-clear-selection");
            },

            selectedItem: function (name, item) {
                if (item)
                    $rootScope.$broadcast(name + "-set-selected-item", item);
                else {
                    $rootScope.$broadcast(name + "-get-selected-item");
                    var selItem = this.getTempData();
                    this.clearTempData();

                    return selItem ? selItem : null;
                }
            },

            selectedItems: function (name) {
                $rootScope.$broadcast(name + "-get-selected-items");
                var selItems = this.getTempData();
                this.clearTempData();

                return selItems ? selItems : null;
            },

            // Scrolling -----------------------------------------------------------------

            getScrollPos: function (name) {
                $rootScope.$broadcast(name + "-get-scroll-pos");
                var pos = this.getTempData();
                this.clearTempData();

                return pos ? pos : {x: 0, y: 0};
            },

            setScrollPos: function (name, pos) {
                $rootScope.$broadcast(name + "-set-scroll-pos", pos);
            },

            scrollTo: function (name, item, pos) {
                $rootScope.$broadcast(name + "-scroll-to", item, pos);
            },

            // Sorting -------------------------------------------------------------------

            sort: function (name, order, comparer) {
                $rootScope.$broadcast(name + "-sort", order, comparer);
            },

            // Update --------------------------------------------------------------------

            updateCheckValues: function (name, item) {
                $rootScope.$broadcast(name + "-update-check", item);
            },

            refresh: function (name, item, parent) {
                $rootScope.$broadcast(name + "-refresh", item, parent);
            },

            resumeLayout: function (name) {
                $rootScope.$broadcast(name + "-resume-layout");
            },

            suspendLayout: function (name) {
                $rootScope.$broadcast(name + "-suspend-layout");
            },

            updateLayout: function (name) {
                $rootScope.$broadcast(name + "-update-layout");
            },

            updateView: function (name) {
                $rootScope.$broadcast(name + "-update-view");
            }
        }
    }])

    // IntegralUI TreeView Controller -----------------------------------------------------
    .controller("IntegralUITreeViewController", ["$scope", "$element", "$timeout", "$window", "IntegralUIInternalService", "IntegralUIDataService", "IntegralUITreeViewService", "IntegralUIDragDrop", "IntegralUIFilter", function ($scope, $elem, $timeout, $window, $internalService, $dataService, $treeService, $dragDropService, $filterService) {
        var self = this;

        self.hoverItem = null;

        var generalClassName = 'iui-treeview';
        var checkBoxClassName = 'iui-checkbox';
        var expandBoxClassName = generalClassName + '-expand-box';
        var itemBlockClassName = generalClassName + '-item-block';
        var itemClassName = generalClassName + '-item';
        var itemContentClassName = itemClassName + '-content';

        this.suppressProcess = false;

        // Properties --------------------------------------------------------------------
        self.defaultCheckBoxStyle = {
            general: checkBoxClassName,
            box: {
                general: checkBoxClassName + '-box',
                disabled: checkBoxClassName + '-box-disabled',
                checked: checkBoxClassName + '-checked',
                indeterminate: checkBoxClassName + '-indeterminate',
                unchecked: checkBoxClassName + '-unchecked'
            }
        }

        self.defaultStyle = {
            general: generalClassName,
            item: {
                general: {
                    disabled: itemClassName + '-disabled',
                    focused: itemClassName + '-focused',
                    normal: itemClassName,
                    hovered: itemClassName + '-hovered',
                    selected: itemClassName + '-selected'
                },
                checkBox: {
                    general: checkBoxClassName,
                    box: {
                        general: checkBoxClassName + '-box',
                        disabled: checkBoxClassName + '-box-disabled',
                        checked: checkBoxClassName + '-checked',
                        indeterminate: checkBoxClassName + '-indeterminate',
                        unchecked: checkBoxClassName + '-unchecked'
                    }
                },
                expandBox: {
                    general: expandBoxClassName,
                    animated: expandBoxClassName + '-load',
                    expanded: expandBoxClassName + '-open',
                    collapsed: expandBoxClassName + '-close'
                },
                content: {
                    disabled: itemContentClassName + '-disabled',
                    focused: itemContentClassName + '-focused',
                    normal: itemContentClassName,
                    hovered: itemContentClassName + '-hovered',
                    selected: itemContentClassName + '-selected'
                }
            }
        }

        self.defaultCheckBoxSettings = {
            autoCheck: false,
            style: self.defaultCheckBoxStyle,
            threeState: false
        }

        this.updateOptions = function (value) {
            if (value) {
                self.options = {
                    allowAnimation: $internalService.isFieldAvailable(value.allowAnimation, true),
                    allowDrag: $internalService.isFieldAvailable(value.allowDrag, false),
                    allowDrop: $internalService.isFieldAvailable(value.allowDrop, true),
                    allowFocus: $internalService.isFieldAvailable(value.allowFocus, true),
                    animationSpeed: 200,
                    autoCheck: $internalService.isFieldAvailable(value.autoCheck, false),
                    autoExpand: $internalService.isFieldAvailable(value.autoExpand, true),
                    checkBoxSettings: self.defaultCheckBoxSettings,
                    controlStyle: self.defaultStyle,
                    editorSettings: {activate: 'click'},
                    hoverSelection: $internalService.isFieldAvailable(value.hoverSelection, false),
                    indent: $internalService.isFieldAvailable(value.indent, 15),
                    itemIcon: $internalService.isFieldAvailable(value.itemIcon, ''),
                    itemSpacing: $internalService.isFieldAvailable(value.itemSpacing, 1),
                    labelEdit: $internalService.isFieldAvailable(value.labelEdit, false),
                    loadItems: [],
                    pathSeparator: $internalService.isFieldAvailable(value.pathSeparator, '\\'),
                    rtl: $internalService.isFieldAvailable(value.rtl, false),
                    selectedIndex: -1,
                    selectedItem: $internalService.isFieldAvailable(value.selectedItem, self.options.selectedItem ? self.options.selectedItem : null),
                    selectedItems: [],
                    selectionMode: $internalService.isFieldAvailable(value.selectionMode, 'one'),
                    showCheckBoxes: $internalService.isFieldAvailable(value.showCheckBoxes, false),
                    showIcons: $internalService.isFieldAvailable(value.showIcons, true),
                    showStatusIcons: $internalService.isFieldAvailable(value.showStatusIcons, false),
                    sorting: $internalService.isFieldAvailable(value.sorting, 'none')
                }

                self.updateDataFields(value.dataFields);
                self.updateControlStyle(value.controlStyle);
                self.updateCheckBoxSettings(value.checkBoxSettings);
            }
            else {
                self.options = {
                    allowAnimation: true,
                    allowDrag: false,
                    allowDrop: true,
                    allowFocus: true,
                    animationSpeed: 200,
                    autoCheck: false,
                    autoExpand: true,
                    checkBoxSettings: self.defaultCheckBoxSettings,
                    controlStyle: self.defaultStyle,
                    editorSettings: {activate: 'click'},
                    hoverSelection: false,
                    indent: 15,
                    itemIcon: '',
                    itemSpacing: 1,
                    labelEdit: false,
                    loadItems: [],
                    pathSeparator: '\\',
                    rtl: false,
                    selectedIndex: -1,
                    selectedItem: null,
                    selectedItems: [],
                    selectionMode: 'one',
                    showCheckBoxes: false,
                    showIcons: true,
                    showStatusIcons: false,
                    sorting: 'none'
                }

                self.updateDataFields();
            }
        }

        self.options = {}

        // Data Fields

        this.updateDataFields = function (fields) {
            if (fields)
                self.options.dataFields = {
                    allowDrag: fields.allowDrag ? fields.allowDrag : 'allowDrag',
                    allowDrop: fields.allowDrop ? fields.allowDrop : 'allowDrop',
                    allowEdit: fields.allowEdit ? fields.allowEdit : 'allowEdit',
                    allowFocus: fields.allowFocus ? fields.allowFocus : 'allowFocus',
                    autoCheck: fields.autoCheck ? fields.autoCheck : 'autoCheck',
                    checkBoxSettings: fields.checkBoxSettings ? fields.checkBoxSettings : 'checkBoxSettings',
                    checked: fields.checked ? fields.checked : 'checked',
                    checkState: fields.checkState ? fields.checkState : 'checkState',
                    content: fields.content ? fields.content : 'content',
                    enabled: fields.enabled ? fields.enabled : 'enabled',
                    expanded: fields.expanded ? fields.expanded : 'expanded',
                    hasChildren: fields.hasChildren ? fields.hasChildren : 'hasChildren',
                    icon: fields.icon ? fields.icon : 'icon',
                    id: fields.id ? fields.id : 'id',
                    items: fields.items ? fields.items : 'items',
                    pid: fields.pid ? fields.pid : 'pid',
                    statusIcon: fields.statusIcon ? fields.statusIcon : 'statusIcon',
                    style: fields.style ? fields.style : 'style',
                    text: fields.text ? fields.text : 'text',
                    value: fields.value ? fields.value : 'value'
                }
            else
                self.options.dataFields = {
                    allowDrag: 'allowDrag',
                    allowDrop: 'allowDrop',
                    allowEdit: 'allowEdit',
                    allowFocus: 'allowFocus',
                    autoCheck: 'autoCheck',
                    checkBoxSettings: 'checkBoxSettings',
                    checked: 'checked',
                    checkState: 'checkState',
                    content: 'content',
                    enabled: 'enabled',
                    expanded: 'expanded',
                    hasChildren: 'hasChildren',
                    icon: 'icon',
                    id: 'id',
                    items: 'items',
                    pid: 'pid',
                    statusIcon: 'statusIcon',
                    style: 'style',
                    text: 'text',
                    value: 'value'
                }

            if (self.dataObj)
                self.dataObj.updateDataFields(self.options.dataFields);
        }

        // Set default property values
        self.updateOptions();

        // Add/Remove --------------------------------------------------------------------

        $scope.$on($scope.name + "-add-item", function (e, item, parent) {
            self.dataObj.insertAt(item, -1, parent, self.itemIsAdded);
        });

        $scope.$on($scope.name + "-clear-items", function (e, parent) {
            self.dataObj.clear(parent, self.listIsCleared);
        });

        $scope.$on($scope.name + "-insert-item-at", function (e, item, index, parent) {
            self.dataObj.insertAt(item, index, parent, self.itemIsAdded);
        });

        $scope.$on($scope.name + "-insert-item-after", function (e, item, refItem) {
            self.dataObj.insertByRef(item, refItem, true, self.itemIsAdded);
        });

        $scope.$on($scope.name + "-insert-item-before", function (e, item, refItem) {
            self.dataObj.insertByRef(item, refItem, false, self.itemIsAdded);
        });

        $scope.$on($scope.name + "-remove-item", function (e, item) {
            self.dataObj.removeAt(item, -1, null, self.itemIsRemoved);
        });

        $scope.$on($scope.name + "-remove-item-at", function (e, index, parent) {
            self.dataObj.removeAt(null, index, parent, self.itemIsRemoved);
        });

        this.listIsCleared = function (parent) {
            if (!parent) {
                self.clearPrevSelection();
                self.options.selectedItem = null;

                self.setScrollPos({x: 0, y: 0});
            }

            self.updateLayout();
        }

        this.itemIsAdded = function () {
            self.updateLayout();
        }

        this.itemIsRemoved = function (item, list, index, parent) {
            /*if (self.suppressProcess === false){
             if (list.length > 0){
             if (index < list.length)
             self.itemSelection(list[index]);
             else
             self.itemSelection(list[list.length-1]);
             }
             else if (parent)
             self.itemSelection(parent);
             else
             self.itemSelection(null);
             }*/

            if (item) {
                item.selected = false;

                if (item == self.options.selectedItem)
                    self.options.selectedItem = null;
            }

            self.updateLayout();
        }

        this.objIsRemoved = function (list, index, parent) {
            self.updateLayout();
        }

        // CheckBox ----------------------------------------------------------------------

        this.getCheckValue = function (item) {
            return item[self.options.dataFields.checkState] == 'checked' ? 'checked' : self.options.checkBoxSettings.threeState == true && item[self.options.dataFields.checkState] == 'indeterminate' ? 'indeterminate' : 'unchecked';
        }

        this.changeCheckValue = function (item) {
            if (self.options.autoCheck == true || self.options.checkBoxSettings.autoCheck == true) {
                var currentCheckState = self.getCheckValue(item);

                var allowChange = false;
                if (self.options.checkBoxSettings.threeState == true)
                    allowChange = self.callCheckValueChanging(item, currentCheckState);
                else
                    allowChange = self.callCheckValueChanging(item, currentCheckState == 'checked' ? true : false);

                if (allowChange !== false) {

                    if (self.options.checkBoxSettings.threeState == true)
                        switch (currentCheckState) {
                            case 'checked':
                                currentCheckState = 'unchecked';
                                break;
                            case 'indeterminate':
                                currentCheckState = 'checked';
                                break;
                            case 'unchecked':
                                currentCheckState = 'indeterminate';
                                break;
                        }
                    else {
                        if (currentCheckState == 'unchecked' || currentCheckState == 'indeterminate')
                            currentCheckState = 'checked';
                        else
                            currentCheckState = 'unchecked';
                    }

                    item[self.options.dataFields.checkState] = currentCheckState;
                    item[self.options.dataFields.checked] = currentCheckState == 'checked' ? true : false;

                    $scope.$apply();
                }
            }
        }

        this.callCheckValueChanging = function (item, value) {
            var retValue = true;

            if (self.allowEvents) {
                if (self.options.checkBoxSettings.threeState == true) {
                    if (angular.isDefined($scope.events) && $scope.events.itemCheckstateChanging)
                        retValue = $scope.events.itemCheckstateChanging({item: item, value: value});
                    else
                        retValue = $scope.itemCheckstateChanging({e: {item: item, value: value}});
                }
                else {
                    if (angular.isDefined($scope.events) && $scope.events.itemCheckedChanging)
                        retValue = $scope.events.itemCheckedChanging({item: item, value: value});
                    else
                        retValue = $scope.itemCheckedChanging({e: {item: item, value: value}});
                }
            }

            return retValue;
        }

        this.callCheckValueChanged = function (item, value) {
            if (self.allowEvents) {
                if (self.options.checkBoxSettings.threeState == true) {
                    if (angular.isDefined($scope.events) && $scope.events.itemCheckstateChanged)
                        retValue = $scope.events.itemCheckstateChanged({item: item, value: value});
                    else
                        retValue = $scope.itemCheckstateChanged({e: {item: item, value: value}});
                }
                else {
                    if (angular.isDefined($scope.events) && $scope.events.itemCheckedChanged)
                        retValue = $scope.events.itemCheckedChanged({item: item, value: value});
                    else
                        retValue = $scope.itemCheckedChanged({e: {item: item, value: value}});
                }
            }
        }

        var updateCheckList = [];
        var suppressCheckCallback = false;

        this.fillCheckList = function (item) {
            if (item && self.options.checkBoxSettings.threeState == true) {
                if (!suppressCheckCallback) {
                    suppressCheckCallback = true;

                    updateCheckList.length = 0;

                    var obj = {
                        item: item,
                        value: item[self.options.dataFields.checkState]
                    }
                    updateCheckList.push(obj);

                    self.updateListChildItemCheckValue(item);
                    self.updateListParentItemCheckValue(item);

                    var i = 0;
                    for (i = 0; i < updateCheckList.length; i++)
                        updateCheckList[i].item[self.options.dataFields.checkState] = updateCheckList[i].value;

                    var checkTimer = $timeout(function () {
                        if (i == updateCheckList.length)
                            suppressCheckCallback = false;

                        $timeout.cancel(checkTimer);
                    }, 1);

                }
            }
        }

        this.getItemCheckValue = function (item) {
            var checkValue = 'unchecked';

            var foundItem = false;

            for (var i = 0; i < updateCheckList.length; i++) {
                if (updateCheckList[i].item == item) {
                    foundItem = true;
                    checkValue = updateCheckList[i].value;
                    break;
                }
            }

            if (!foundItem)
                checkValue = item[self.options.dataFields.checkState];

            return checkValue;
        }


        // Update the checkbox of parent items
        this.updateListParentItemCheckValue = function (item) {
            var parent = self.getParent(item);
            while (parent) {
                var list = parent[self.options.dataFields.items];

                if (list) {
                    var checkCount = 0;
                    var indeterminateCount = 0;
                    for (var i = 0; i < list.length; i++) {
                        var checkValue = self.getItemCheckValue(list[i]);
                        if (checkValue == 'checked')
                            checkCount++;
                        else if (checkValue == 'indeterminate')
                            indeterminateCount++;
                    }

                    var obj = {
                        item: parent
                    }

                    if (checkCount == list.length)
                        obj.value = 'checked';
                    else if (checkCount > 0 || indeterminateCount > 0)
                        obj.value = 'indeterminate';
                    else
                        obj.value = 'unchecked';

                    updateCheckList.push(obj);
                }

                parent = self.getParent(parent);
            }
        }

        // Update the checkbox of child items
        this.updateListChildItemCheckValue = function (parent) {
            if (parent) {
                var list = parent[self.options.dataFields.items];

                if (list) {
                    for (var i = 0; i < list.length; i++) {
                        var obj = {
                            item: list[i]
                        }

                        var checkValue = self.getItemCheckValue(parent);
                        if (checkValue == 'checked')
                            obj.value = 'checked';
                        else
                            obj.value = 'unchecked';

                        updateCheckList.push(obj);

                        self.updateListChildItemCheckValue(list[i]);
                    }
                }
            }
        }

        // Update the checkbox of parent items
        this.updateParentItemCheckValue = function (item) {
            var parent = self.getParent(item);
            while (parent) {
                var list = parent[self.options.dataFields.items];

                if (list) {
                    var checkCount = 0;
                    var indeterminateCount = 0;
                    for (var i = 0; i < list.length; i++) {
                        if (list[i][self.options.dataFields.checkState] == 'checked')
                            checkCount++;
                        else if (list[i][self.options.dataFields.checkState] == 'indeterminate')
                            indeterminateCount++;
                    }

                    if (checkCount == list.length)
                        parent[self.options.dataFields.checkState] = 'checked';
                    else if (checkCount > 0 || indeterminateCount > 0)
                        parent[self.options.dataFields.checkState] = 'indeterminate';
                    else
                        parent[self.options.dataFields.checkState] = 'unchecked';
                }

                parent = self.getParent(parent);
            }
        }

        this.updateItemCheckValue = function (item, parentValue) {
            if (parentValue == 'checked' || parentValue == 'unchecked') {
                item[self.options.dataFields.checkState] = parentValue;
            }

            var list = item[self.options.dataFields.items];
            if (list && list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    self.updateItemCheckValue(list[i], item[self.options.dataFields.checkState]);
                }
            }

            if (item[self.options.dataFields.checkState] != undefined) {
                var parent = self.getParent(item);
                if (parent && parent[self.options.dataFields.checkState] != item[self.options.dataFields.checkState])
                    self.updateParentItemCheckValue(item);
            }
        }

        this.updateCheckValues = function (item) {
            if (self.options.checkBoxSettings.threeState == true) {
                var list = self.dataObj.getList(item);
                for (var i = 0; i < list.length; i++)
                    self.updateItemCheckValue(list[i]);
            }
        }

        $scope.$on($scope.name + "-update-check", function (e, item) {
            self.updateCheckValues(item);
        });

        $scope.$on($scope.name + "-get-check-list", function (e, value) {
            var checkList = [];

            self.updateCheckValues();

            if (value == undefined)
                value = self.options.checkBoxSettings.threeState == true ? 'checked' : true;

            var field = self.options.checkBoxSettings.threeState == true ? self.options.dataFields.checkState : self.options.dataFields.checked;

            var condition = {
                operation: '=',
                value: value
            }

            var list = $filterService.filter(self.getFullList(), field, condition);
            $treeService.setTempData(list);
        });

        this.updateCheckBoxSettings = function (value) {
            if (value) {
                self.options.checkBoxSettings = {
                    autoCheck: $internalService.isFieldAvailable(value.autoCheck, false),
                    style: getCheckStyle(value.style),
                    threeState: $internalService.isFieldAvailable(value.threeState, false)
                }
            }
            else
                self.options.checkBoxSettings = {
                    autoCheck: false,
                    style: self.defaultCheckBoxStyle,
                    threeState: false
                }
        }

        // Current List ------------------------------------------------------------------

        var getFilterTree = function (params) {
            return params ? $filterService.createTree(params.conditions, params.formula) : null;
        }

        var isItemAllowed = function (item) {
            var pass = true;

            if (item && self.filterParams) {
                var itemValue = item[self.options.dataFields.value];
                itemValue = itemValue ? itemValue : item[self.options.dataFields.text];

                if (self.filterParams.callback)
                    pass = self.filterParams.callback(itemValue, item);
                else
                    pass = $filterService.match(itemValue, self.filterParams.conditions, self.filterParams.formula, getFilterTree(self.filterParams));
            }

            return pass;
        }

        var maxItemSize = 0;

        self.currentList = [];
        self.indentList = [];
        self.longestItem = null;
        self.isThereChildItems = false;

        var addItemToCurrentList = function (item, indent, pid, flag) {
            item.type = "item";

            if (!item[self.options.dataFields.id])
                item[self.options.dataFields.id] = $internalService.getUniqueId();

            if (pid)
                item[self.options.dataFields.pid] = pid;

            var pass = isItemAllowed(item);
            if (pass) {
                if (flag)
                    self.fullList.push(item);
                else {
                    self.currentList.push(item);
                    self.indentList.push(indent);

                    if (item[self.options.dataFields.text]) {
                        var itemSize = item[self.options.dataFields.text].length;
                        if (self.options.indent > 0)
                            itemSize += (indent / self.options.indent);

                        if (maxItemSize < itemSize) {
                            maxItemSize = itemSize;

                            self.longestItem = item;
                        }
                    }
                }
            }

            return pass;
        }

        this.isThereVisibleChildren = function (item) {
            var found = false;

            if (item) {
                var list = item[self.options.dataFields.items];
                if (list) {
                    for (var i = 0; i < list.length; i++) {
                        if (isItemAllowed(list[i])) {
                            found = true;
                            break;
                        }
                    }
                }
            }

            return found;
        }

        this.isThereChildItems = false;
        var addChildItems = function (parentItem, indent, pid, flag) {
            var pass = true;
            if (!parentItem[self.options.dataFields.items]) {
                pass = addItemToCurrentList(parentItem, indent, pid, flag);
                return pass;
            }

            pass = addItemToCurrentList(parentItem, indent, pid, flag);

            if (pass) {
                var visibleChildCount = 0;
                var childPass = true;

                if (flag || isItemExpanded(parentItem)) {
                    var list = parentItem[self.options.dataFields.items];
                    if (list) {
                        self.applySorting(list);

                        for (var i = 0; i < list.length; i++) {
                            childPass = addChildItems(list[i], indent + self.options.indent, parentItem[self.options.dataFields.id], flag);
                            if (childPass)
                                visibleChildCount++;
                        }
                    }
                }

                if (!flag && !self.isThereChildItems && (visibleChildCount > 0 || (!isItemExpanded(parentItem) && parentItem[self.options.dataFields.items] && parentItem[self.options.dataFields.items].length > 0 && self.isThereVisibleChildren(parentItem))))
                    self.isThereChildItems = true;
            }

            return pass;
        }

        self.fullList = [];
        this.getFullList = function (item) {
            self.fullList.length = 0;

            var list = self.dataObj.getList(item);
            for (var i = 0; i < list.length; i++)
                addChildItems(list[i], 0, null, true);

            return self.fullList;
        }

        this.getCurrentList = function () {
            return self.currentList;
        }

        this.updateCurrentList = function () {
            self.currentList.length = 0;
            self.indentList.length = 0;
            self.longestItem = null;

            self.isThereChildItems = false;
            maxItemSize = 0;

            var list = self.dataObj.getList();
            if (list) {
                self.applySorting(list);

                for (var i = 0; i < list.length; i++)
                    addChildItems(list[i], 0, null, false);
            }
        }

        // Data --------------------------------------------------------------------------

        this.dataEvents = {
            clear: function (e) {
                if (angular.isDefined($scope.events) && $scope.events.clear)
                    return $scope.events.clear({parent: e.e.parent});

                return $scope.clear(e);
            },
            objAdded: function (e) {
                if (angular.isDefined($scope.events) && $scope.events.itemAdded)
                    return $scope.events.itemAdded({item: e.e.item});

                return $scope.itemAdded(e);
            },
            objAdding: function (e) {
                if (angular.isDefined($scope.events) && $scope.events.itemAdding)
                    return $scope.events.itemAdding({item: e.e.item});

                return $scope.itemAdding(e);
            },
            objRemoved: function (e) {
                if (angular.isDefined($scope.events) && $scope.events.itemRemoved)
                    return $scope.events.itemRemoved({item: e.e.item});

                return $scope.itemRemoved(e);
            },
            objRemoving: function (e) {
                if (angular.isDefined($scope.events) && $scope.events.itemRemoving)
                    return $scope.events.itemRemoving({item: e.e.item});

                return $scope.itemRemoving(e);
            }
        }

        this.getDataFields = function (value) {
            return {
                content: value.content ? value.content : 'content',
                icon: value.icon ? value.icon : 'icon',
                id: value.id ? value.id : 'id',
                pid: value.pid ? value.pid : 'pid',
                objects: value.items ? value.items : 'items',
                statusIcon: value.statusIcon ? value.statusIcon : 'statusIcon',
                text: value.text ? value.text : 'text'
            }
        }

        self.dataObj = new $dataService({
            objects: $scope.items,
            events: self.dataEvents,
            fields: self.getDataFields(self.options.dataFields)
        });

        $scope.$on($scope.name + "-load-data", function (e, data, parent, fields, flat) {
            self.loadData(data, parent, fields, flat);
        });

        $scope.$on($scope.name + "-export-json", function (e, fields, flat, spacing) {
            $treeService.setTempData(self.exportToJSON(fields, flat, spacing));
        });

        this.exportToJSON = function (fields, flat, spacing) {
            //var changeJSON = jsonData;//.replace(/},/g, "},\\t");

            spacing = spacing ? spacing : null;
            var data = flat !== false ? self.getFullList() : self.dataObj.getList();

            var fieldList = fields ? fields : [
                self.options.dataFields.allowDrag,
                self.options.dataFields.allowDrop,
                self.options.dataFields.allowEdit,
                self.options.dataFields.allowFocus,
                self.options.dataFields.autoCheck,
                self.options.dataFields.checkBoxSettings,
                self.options.dataFields.checked,
                self.options.dataFields.checkState,
                self.options.dataFields.content,
                self.options.dataFields.enabled,
                self.options.dataFields.expanded,
                self.options.dataFields.hasChildren,
                self.options.dataFields.icon,
                self.options.dataFields.id,
                self.options.dataFields.pid,
                self.options.dataFields.statusIcon,
                self.options.dataFields.style,
                self.options.dataFields.text,
                self.options.dataFields.value
            ];
            if (flat === false)
                fieldList.push(self.options.dataFields.items);

            return JSON.stringify(data, fieldList, spacing);
        }

        this.loadData = function (data, parent, fields, flat) {
            self.suspendLayout();

            self.allowEvents = false;

            self.updateDataFields(fields);

            var treeData = [];
            var dataFields = self.options.dataFields;

            self.dataObj.clear(parent, self.listIsCleared);

            if (data) {
                if (flat != false) {
                    var tempList = [];

                    data.forEach(function (item, i) {
                        var currentPID = item[dataFields.pid];
                        if (tempList[currentPID]) {
                            if (!tempList[currentPID][dataFields.items])
                                tempList[currentPID][dataFields.items] = [];

                            tempList[item[dataFields.id]] = item;

                            if (_.findWhere(tempList[currentPID][dataFields.items], item) == null) {
                                tempList[currentPID][dataFields.items].push(item);
                            }
                        }
                        else {
                            tempList[item[dataFields.id]] = item;

                            if (_.findWhere(treeData, item) == null) {
                                treeData.push(item);
                            }
                        }
                    });

                    tempList.length = 0;
                }
                else
                    treeData = data;
            }

            if (parent) {
                parent[self.options.dataFields.items] = treeData;
                for (var i = 0; i < parent[self.options.dataFields.items].length; i++)
                    parent[self.options.dataFields.items][i][self.options.dataFields.pid] = parent[self.options.dataFields.id];
            }
            else if (angular.isDefined($scope.items)) {
                $scope.items = treeData;
            }

            self.dataObj = new $dataService({
                objects: $scope.items,
                events: self.dataEvents,
                fields: self.getDataFields(self.options.dataFields)
            });

            self.resumeLayout();

            self.allowEvents = true;
        }

        this.updateData = function () {
            if (self.options.dataFields.dataSource) {
                self.loadData(self.options.dataFields.dataSource);
                self.dataObj = new $dataService({
                    objects: $scope.items,
                    events: self.dataEvents,
                    fields: self.getDataFields(self.options.dataFields)
                });
            }
        }

        // Drag Drop  ----------------------------------------------------------------------

        var isDragDropStarted = false;
        this.dragDropStatus = function (value) {
            if (value != undefined)
                isDragDropStarted = value;
            else
                return isDragDropStarted;
        }

        this.getDnDSource = function (e) {
            return {text: e.dataTransfer ? e.dataTransfer.getData("text") : e.originalEvent.dataTransfer ? e.originalEvent.dataTransfer.getData("text") : ''};
        }

        var dropMarkWindow = angular.element('<div class="iui-drop-marker" data-element="dropmark"></div>');
        var popupActive = false;

        this.getDropMarkLine = function () {
            return dropMarkLine;
        }

        $(window).on("dragenter." + $scope.$id, function (e) {
            self.dropMark();
        });

        $(window).on("dragend." + $scope.$id, function (e) {
            self.removeDropMark();

            if (self.dragIcon)
                angular.element(self.dragIcon).remove();

            self.cancelScrollTimer();
        });

        self.getMousePos = function (e) {
            return {
                x: e.pageX ? e.pageX : e.originalEvent ? e.originalEvent.pageX : 0,
                y: e.pageY ? e.pageY : e.originalEvent ? e.originalEvent.pageY : 0
            }
        }

        this.getTreeName = function () {
            if (angular.isDefined($scope.name))
                return $scope.name;

            return '';
        }

        $elem.bind("dragenter", function (e) {
            e.preventDefault();

            var data = $dragDropService.getData();
            if (!data.source)
                data.source = self.getDnDSource(e);

            var eventObj = {
                event: e,
                sourceTree: data.sourceCtrl ? data.sourceCtrl.getTreeName() : '',
                dragItem: data.source,
                targetTree: self.getTreeName(),
                targetItem: data.target,
                mousePos: self.getMousePos(e)
            }

            self.callDragEnter(eventObj);
        });

        $elem.bind("dragover", function (e) {
            e.preventDefault();

            var pass = true;
            if (e.dataTransfer)
                pass = e.dataTransfer.effectAllowed === 'none' ? false : true;
            else if (e.originalEvent && e.originalEvent.dataTransfer)
                pass = e.originalEvent.dataTransfer.effectAllowed === 'none' ? false : true;

            if (pass) {
                if (e.dataTransfer)
                    e.dataTransfer.dropEffect = self.options.allowDrop ? "move" : "none";
                else if (e.originalEvent && e.originalEvent.dataTransfer)
                    e.originalEvent.dataTransfer.dropEffect = self.options.allowDrop ? "move" : "none";

                var data = $dragDropService.getData();
                if (!data.source)
                    data.source = self.getDnDSource(e);

                var dragDropData = {
                    source: data.source,
                    sourceCtrl: data.sourceCtrl,
                    target: null,
                    dropPos: -1
                };

                $dragDropService.setData(dragDropData);

                var eventObj = {
                    event: e,
                    sourceTree: data.sourceCtrl ? data.sourceCtrl.getTreeName() : '',
                    dragItem: data.source,
                    targetTree: self.getTreeName(),
                    targetItem: null,
                    isDropAllowed: self.options.allowDrop,
                    dropPos: -1,
                    mousePos: self.getMousePos(e)
                }

                self.callDragOver(eventObj);

                //self.dropMark();
                var tempMousePos = self.getMousePos(e);
                var cssTopValue = tempMousePos.y + 16;
                var cssLeftValue = tempMousePos.x + 20;

                var popWin = self.getDropMarkWindow();
                popWin.empty();
                var dragTitle = $scope.name ? $scope.name : 'TreeView';
                popWin.append("<span class='iui-drop-marker-move-end'></span><span class='iui-drop-marker-title'>" + dragTitle + "</span>");
                self.updateDropMarkElem(self.getDropMarkWindow(), {top: cssTopValue, left: cssLeftValue});
                self.dropMark(true);
            }
        });

        $elem.bind("drop", function (e) {
            e.preventDefault();

            self.dropMark();

            var pass = true;
            if (e.dataTransfer)
                pass = e.dataTransfer.effectAllowed === 'none' ? false : true;
            else if (e.originalEvent && e.originalEvent.dataTransfer)
                pass = e.originalEvent.dataTransfer.effectAllowed === 'none' ? false : true;

            if (pass) {
                var data = $dragDropService.getData();
                if (!data.source)
                    data.source = self.getDnDSource(e);

                if (data.source) {
                    var eventObj = {
                        event: e,
                        sourceTree: data.sourceCtrl ? data.sourceCtrl.getTreeName() : '',
                        dragItem: data.source,
                        targetTree: self.getTreeName(),
                        targetItem: null,
                        isDropAllowed: self.options.allowDrop,
                        dropPos: -1,
                        mousePos: self.getMousePos(e)
                    }

                    var dropResult = self.callDragDrop(eventObj);

                    if (dropResult !== false) {
                        self.drop(data);

                        if (!$scope.$$phase)
                            $scope.$apply();
                    }
                }
            }

            $dragDropService.clearData();

            e.stopPropagation();
        });

        $elem.bind("dragleave", function (e) {
            e.preventDefault();

            self.dropMark();

            var data = $dragDropService.getData();
            if (!data.source)
                data.source = self.getDnDSource(e);

            var eventObj = {
                event: e,
                sourceTree: data.sourceCtrl ? data.sourceCtrl.getTreeName() : '',
                dragItem: data.source,
                targetTree: self.getTreeName(),
                targetItem: data.target,
                mousePos: self.getMousePos(e)
            }

            self.callDragLeave(eventObj);

            self.cancelScrollTimer();
        });

        $elem.bind("dragend", function (e) {
            e.preventDefault();

            self.dropMark();

            var data = $dragDropService.getData();
            if (!data.source)
                $dragDropService.clearData();

            self.dragDropStatus(false);
        });

        $elem.bind("mouseleave", function (e) {
            e.preventDefault();

            self.dropMark();
            self.hoverItem = null;
        });

        this.containsMousePos = function (x, y) {
            var bounds = {
                left: 0,
                top: 0,
                right: $elem[0].clientWidth,
                bottom: $elem[0].clientHeight
            }

            return $dragDropService.hitTest(x, y, bounds);
        }

        this.isPopupActive = function () {
            return popupActive;
        }

        var convertRowToItem = function (obj, sourceFields) {
            var objFields = self.options.dataFields;

            if (!obj[objFields.items])
                obj[objFields.items] = [];

            obj[objFields.items].length = 0;

            if (obj[sourceFields.rows] && obj[sourceFields.rows].length > 0) {
                for (var i = 0; i < obj[sourceFields.rows].length; i++)
                    obj[objFields.items].push(convertRowToItem(obj[sourceFields.rows][i], sourceFields));
            }

            return obj;
        }

        var processDropObj = function (obj, data) {
            var isObjRemoved = false;
            if (data.sourceCtrl)
                isObjRemoved = data.sourceCollection.removeAt(obj, -1, null, data.sourceCtrl.objIsRemoved);

            if (isObjRemoved) {
                if (obj.type == 'row')
                    obj = convertRowToItem(obj, data.sourceCtrl.options.rowFields);

                if (data.dropPos === 0)
                    self.dataObj.insertAt(obj, -1, data.target, self.itemIsAdded);
                else if (data.dropPos === 1 || data.dropPos === 2) {
                    if (data.dropPos === 1) // Insert dragged item before target item 
                        self.dataObj.insertByRef(obj, data.target, false, self.itemIsAdded);
                    else // Insert dragged item after target item
                        self.dataObj.insertByRef(obj, data.target, true, self.itemIsAdded);
                }
                else // Add dragged item as child to target TreeView
                    self.dataObj.insertAt(obj, -1, null, self.itemIsAdded);
            }
        }

        this.setDropSelection = function (item, itemIndex) {
            var selItem = item;

            if (!selItem && itemIndex >= 0 && itemIndex < self.currentList.length)
                selItem = self.currentList[itemIndex];

            self.clearPrevSelection(selItem);
            self.itemSelection(null, selItem);
        }

        this.drop = function (data) {
            if (data && data.sourceCtrl) {
                data.sourceCtrl.suppressProcess = true;

                data.sourceCtrl.suspendLayout();
                self.suspendLayout();

                var itemToSelect = data.source;
                if (Array.isArray(data.source)) {
                    var dropList = [];

                    for (var i = 0; i < data.source.length; i++) {
                        var found = false;
                        var parentItem = data.sourceCollection.getParent(data.source[i]);
                        while (parentItem) {
                            if (data.sourceCtrl.isObjInSelList(parentItem)) {
                                found = true;
                                break;
                            }

                            parentItem = data.sourceCollection.getParent(parentItem);
                        }

                        if (!found)
                            dropList.push(data.source[i]);
                    }

                    if (dropList.length > 0) {
                        itemToSelect = dropList[dropList.length - 1];
                        var firstIndex = data.sourceCtrl.getObjCurrentIndex(dropList[0]);
                        var lastIndex = data.sourceCtrl.getObjCurrentIndex(itemToSelect);

                        if (firstIndex <= lastIndex)
                            for (var i = 0; i < dropList.length; i++)
                                processDropObj(dropList[i], data);
                        else
                            for (var i = dropList.length - 1; i >= 0; i--)
                                processDropObj(dropList[i], data);
                    }
                }
                else
                    processDropObj(data.source, data);


                if (data.sourceCtrl !== self) {
                    self.resumeLayout();
                    data.sourceCtrl.resumeLayout();
                }
                else
                    self.resumeLayout();

                data.sourceCtrl.multiSelection(false);

                var selTimer = $timeout(function () {
                    if (itemToSelect) {
                        data.sourceCtrl.clearPrevSelection(itemToSelect);

                        self.itemSelection(null, itemToSelect);

                        var itemElem = self.getElemFromItem(itemToSelect);
                        if (itemElem) {
                            var contentElem = self.getElement(itemElem);
                            if (contentElem)
                                contentElem[0].focus();
                        }

                        $scope.$apply();
                        $timeout.cancel(selTimer);
                    }
                }, 1);

                data.sourceCtrl.suppressProcess = false;
            }
        }

        this.isDragAllowed = function (item) {
            return self.options.allowDrag ? (item && (item[self.options.dataFields.allowDrag] || item[self.options.dataFields.allowDrag] === undefined) ? true : false) : false;
        }

        this.isChildOf = function (targetItem, item) {
            var found = false;

            if (targetItem && item) {
                var list = item[self.options.dataFields.items];

                if (list && list.length > 0) {

                    for (var i = 0; i < list.length; i++) {
                        if ($internalService.isEqual(targetItem[self.options.dataFields.id], list[i][self.options.dataFields.id])) {
                            found = true;
                            break;
                        }
                        else
                            found = self.isChildOf(targetItem, list[i]);

                        if (found)
                            break;
                    }
                }
            }

            return found;
        }

        this.isParentOf = function (targetItem, item) {
            var parent = self.dataObj.getParent(item);
            if (targetItem && item && parent && $internalService.isEqual(targetItem[self.options.dataFields.id], parent[self.options.dataFields.id]))
                return true;

            return false;
        }

        this.isDropAllowed = function (dragSource, targetItem, dropPos) {
            var allow = self.options.allowDrop;

            if (allow && dragSource && targetItem) {
                var allow = targetItem[self.options.dataFields.allowDrop] || targetItem[self.options.dataFields.allowDrop] === undefined ? true : false;

                if (allow) {
                    if (Array.isArray(dragSource)) {
                        for (var i = 0; i < dragSource.length; i++) {
                            if ($internalService.isEqual(dragSource[i][self.options.dataFields.id], targetItem[self.options.dataFields.id]) ||
                                (dropPos === 0 && self.isParentOf(targetItem, dragSource[i])) || self.isChildOf(targetItem, dragSource[i])) {
                                allow = false;
                                break;
                            }

                            if (!allow)
                                break;
                        }
                    }
                    else if ($internalService.isEqual(dragSource[self.options.dataFields.id], targetItem[self.options.dataFields.id]) ||
                        (dropPos === 0 && self.isParentOf(targetItem, dragSource)) || self.isChildOf(targetItem, dragSource))
                        allow = false;
                }
            }

            return allow;
        }

        this.getDropMarkWindow = function () {
            var retVal = dropMarkWindow;

            var topElemList = angular.element(document.body).children();
            for (var i = 0; i < topElemList.length; i++) {
                var currentElem = angular.element(topElemList[i]);
                if (currentElem[0].attributes && currentElem[0].attributes['data-element'] && currentElem[0].attributes['data-element'].value === 'dropmark') {
                    retVal = currentElem;
                    break;
                }
            }

            return retVal;
        }

        this.dropMark = function (flag, elem) {
            if (!elem)
                elem = self.getDropMarkWindow();

            if (elem) {
                var displayValue = "none";
                if (this.options.allowDrop)
                    displayValue = flag ? "block" : "none";

                angular.element(elem).css("display", displayValue);
            }
        }

        this.updateDropMarkElem = function (elem, value) {
            if (elem && value) {
                elem.css("top", value.top + "px");
                elem.css("left", value.left + "px");
                elem.css("width", value.width + "px");
            }
        }

        // Editing  ----------------------------------------------------------------------

        var editStatus = false;
        var labelEditElem = angular.element('<input type="text" style="position:absolute" />');

        this.labelEditStatus = function (value) {
            if (value != undefined)
                editStatus = value;
            else
                return editStatus;
        }

        this.getEditBox = function () {
            return labelEditElem;
        }

        this.updateEditBox = function (value) {
            if (labelEditElem && value) {
                labelEditElem.css("top", value.top + "px");
                labelEditElem.css("left", value.left + "px");
                labelEditElem.css("width", value.width + "px");
                labelEditElem.css("height", value.height + "px");
            }
        }

        // Editor  ----------------------------------------------------------------------

        $scope.$on($scope.name + "-open-editor", function (e, item) {
            self.openEditor(item);
        });

        $scope.$on($scope.name + "-close-editor", function (e, item) {
            self.closeEditor(item);
        });

        this.updateEditorSettings = function (value) {
            if (value)
                self.options.editorSettings = {
                    activate: $internalService.isFieldAvailable(value.activate, 'click')
                }
            else
                self.options.editorSettings = {
                    activate: 'click'
                }
        }

        // Events  ----------------------------------------------------------------------

        this.allowEvents = true;

        this.callAfterCollapse = function (item) {
            if (angular.isDefined($scope.events) && $scope.events.afterCollapse)
                $scope.events.afterCollapse({item: item});

            $scope.afterCollapse({e: {item: item}});
        }

        this.callAfterExpand = function (item) {
            if (angular.isDefined($scope.events) && $scope.events.afterExpand)
                $scope.events.afterExpand({item: item});

            $scope.afterExpand({e: {item: item}});
        }

        this.callAfterEdit = function (item) {
            if (angular.isDefined($scope.events) && $scope.events.afterEdit)
                $scope.events.afterEdit({item: item});

            $scope.afterEdit({e: {item: item}});
        }

        this.callAfterLabelEdit = function (item) {
            if (angular.isDefined($scope.events) && $scope.events.afterLabelEdit)
                $scope.events.afterLabelEdit({item: item});

            $scope.afterLabelEdit({e: {item: item}});
        }

        this.callAfterSelect = function (value) {
            if (angular.isDefined($scope.events) && $scope.events.afterSelect)
                $scope.events.afterSelect({item: value});
            else
                $scope.afterSelect({e: {item: value}});

            if (angular.isDefined($scope.events) && $scope.events.selectionChanged)
                $scope.events.selectionChanged({item: value});
            else
                $scope.selectionChanged({e: {item: value}});
        }

        this.callBeforeCollapse = function (item) {
            var retValue = true;
            if (angular.isDefined($scope.events) && $scope.events.beforeCollapse)
                retValue = $scope.events.beforeCollapse({item: item});
            else
                retValue = $scope.beforeCollapse({e: {item: item}});

            return retValue;
        }

        this.callBeforeExpand = function (item) {
            var retValue = true;
            if (angular.isDefined($scope.events) && $scope.events.beforeExpand)
                retValue = $scope.events.beforeExpand({item: item});
            else
                retValue = $scope.beforeExpand({e: {item: item}});

            return retValue;
        }

        this.callBeforeEdit = function (item) {
            var retValue = true;
            if (angular.isDefined($scope.events) && $scope.events.beforeEdit)
                retValue = $scope.events.beforeEdit({item: item});
            else
                retValue = $scope.beforeEdit({e: {item: item}});

            return retValue;
        }

        this.callBeforeLabelEdit = function (item) {
            var retValue = true;
            if (angular.isDefined($scope.events) && $scope.events.beforeLabelEdit)
                retValue = $scope.events.beforeLabelEdit({item: item});
            else
                retValue = $scope.beforeLabelEdit({e: {item: item}});

            return retValue;
        }

        this.callChange = function () {
            if (angular.isDefined($scope.events) && $scope.events.change)
                $scope.events.change();
            else
                $scope.change();
        }

        this.callDragEnter = function (eventObj) {
            if (angular.isDefined($scope.events) && $scope.events.dragEnter)
                $scope.events.dragEnter({
                    event: eventObj.event,
                    sourceTree: eventObj.sourceTree,
                    dragItem: eventObj.dragItem,
                    targetTree: eventObj.targetTree,
                    targetItem: eventObj.targetItem,
                    mousePos: eventObj.mousePos
                });
            else
                $scope.dragEnter({
                    e: {
                        event: eventObj.event,
                        sourceTree: eventObj.sourceTree,
                        dragItem: eventObj.dragItem,
                        targetTree: eventObj.targetTree,
                        targetItem: eventObj.targetItem,
                        mousePos: eventObj.mousePos
                    }
                });
        }

        this.callDragOver = function (eventObj) {
            var retValue = true;
            if (angular.isDefined($scope.events) && $scope.events.dragOver)
                retValue = $scope.events.dragOver({
                    event: eventObj.event,
                    sourceTree: eventObj.sourceTree,
                    dragItem: eventObj.dragItem,
                    targetTree: eventObj.targetTree,
                    targetItem: eventObj.targetItem,
                    isDropAllowed: eventObj.isDropAllowed,
                    dropPos: eventObj.dropPos,
                    mousePos: eventObj.mousePos
                });
            else
                retValue = $scope.dragOver({
                    e: {
                        event: eventObj.event,
                        sourceTree: eventObj.sourceTree,
                        dragItem: eventObj.dragItem,
                        targetTree: eventObj.targetTree,
                        targetItem: eventObj.targetItem,
                        isDropAllowed: eventObj.isDropAllowed,
                        dropPos: eventObj.dropPos,
                        mousePos: eventObj.mousePos
                    }
                });

            return retValue;
        }

        this.callDragDrop = function (eventObj) {
            var retValue = true;
            if (angular.isDefined($scope.events) && $scope.events.dragDrop)
                retValue = $scope.events.dragDrop({
                    event: eventObj.event,
                    sourceTree: eventObj.sourceTree,
                    dragItem: eventObj.dragItem,
                    targetTree: eventObj.targetTree,
                    targetItem: eventObj.targetItem,
                    isDropAllowed: eventObj.isDropAllowed,
                    dropPos: eventObj.dropPos,
                    mousePos: eventObj.mousePos
                });
            else
                retValue = $scope.dragDrop({
                    e: {
                        event: eventObj.event,
                        sourceTree: eventObj.sourceTree,
                        dragItem: eventObj.dragItem,
                        targetTree: eventObj.targetTree,
                        targetItem: eventObj.targetItem,
                        isDropAllowed: eventObj.isDropAllowed,
                        dropPos: eventObj.dropPos,
                        mousePos: eventObj.mousePos
                    }
                });

            return retValue;
        }

        this.callDragLeave = function (eventObj) {
            if (angular.isDefined($scope.events) && $scope.events.dragLeave)
                $scope.events.dragLeave({
                    event: eventObj.event,
                    sourceTree: eventObj.sourceTree,
                    dragItem: eventObj.dragItem,
                    targetTree: eventObj.targetTree,
                    targetItem: eventObj.targetItem,
                    mousePos: eventObj.mousePos
                });
            else
                $scope.dragLeave({
                    e: {
                        event: eventObj.event,
                        sourceTree: eventObj.sourceTree,
                        dragItem: eventObj.dragItem,
                        targetTree: eventObj.targetTree,
                        targetItem: eventObj.targetItem,
                        mousePos: eventObj.mousePos
                    }
                });
        }

        this.callItemClick = function (event, item, pos) {
            if (angular.isDefined($scope.events) && $scope.events.itemClick)
                $scope.events.itemClick({event: event, item: item, mousePos: pos});

            $scope.itemClick({e: {event: event, item: item, mousePos: pos}});
        }

        this.callItemDblClick = function (item, pos) {
            var retValue = true;
            if (angular.isDefined($scope.events) && $scope.events.itemDblClick)
                retValue = $scope.events.itemDblClick({item: item, mousePos: pos});
            else
                retValue = $scope.itemDblclick({e: {item: item, mousePos: pos}});

            return retValue;
        }

        this.callItemHover = function (item) {
            if (angular.isDefined($scope.events) && $scope.events.itemHover)
                $scope.events.itemHover({item: item});
            else
                $scope.itemHover({e: {item: item}});
        }

        this.callItemRightClick = function (item, pos) {
            if (angular.isDefined($scope.events) && $scope.events.itemRightClick)
                $scope.events.itemRightClick({item: item, mousePos: pos});

            $scope.itemRightclick({e: {item: item, mousePos: pos}});
        }

        this.callKeyDown = function (event, item) {
            if (angular.isDefined($scope.events) && $scope.events.keyDown)
                $scope.events.keyDown({event: event, item: item});
            else
                $scope.keyDown({e: {event: event, item: item}});
        }

        this.callKeyPress = function (event, item) {
            if (angular.isDefined($scope.events) && $scope.events.keyPress)
                $scope.events.keyPress({event: event, item: item});
            else
                $scope.keyPress({e: {event: event, item: item}});
        }

        this.callKeyUp = function (event, item) {
            if (angular.isDefined($scope.events) && $scope.events.keyUp)
                $scope.events.keyUp({event: event, item: item});
            else
                $scope.keyUp({e: {event: event, item: item}});
        }

        this.callScrollPosChanged = function () {
            if (angular.isDefined($scope.events) && $scope.events.scrollPosChanged)
                $scope.events.scrollPosChanged({scrollPos: self.scrollPos});
            else
                $scope.scrollposChanged({e: {scrollPos: self.scrollPos}});
        }

        $elem.bind("click", function (e) {
            if (e.which === 1)
                self.callItemClick(e, null, self.getMousePos(e));

            //e.stopPropagation();
        });

        $elem.bind("dblclick", function (e) {
            e.preventDefault();

            if (e.which === 1)
                self.callItemDblClick(null, self.getMousePos(e));

            e.stopPropagation();
        });

        $elem.bind("mousedown", function (e) {
            if (e.which === 3)
                self.callItemRightClick(null, self.getMousePos(e));

            e.stopPropagation();
        });

        // Expand/Collapse --------------------------------------------------------------------------

        this.toggle = function (item, value) {
            if (item) {
                if ((!item[self.options.dataFields.hasChildren] && (!item[self.options.dataFields.items] || item[self.options.dataFields.items].length === 0)))
                    return;
                else if (value && item[self.options.dataFields.expanded] !== false)
                    return;
                else if (value === false && item[self.options.dataFields.expanded] === false)
                    return;

                var expandedValue = value !== undefined ? value : item[self.options.dataFields.expanded] !== false ? true : false;
                var allowToggle = true;

                if (value !== undefined) {
                    if (value)
                        allowToggle = self.callBeforeExpand(item);
                    else
                        allowToggle = self.callBeforeCollapse(item);
                }
                else {
                    if (expandedValue)
                        allowToggle = self.callBeforeCollapse(item);
                    else
                        allowToggle = self.callBeforeExpand(item);
                }

                if (allowToggle !== false) {
                    var prevValue = item[self.options.dataFields.expanded];
                    item[self.options.dataFields.expanded] = value !== undefined ? value : !expandedValue;

                    if (item[self.options.dataFields.expanded])
                        self.callAfterExpand(item);
                    else
                        self.callAfterCollapse(item);

                    if (prevValue !== item[self.options.dataFields.expanded])
                        self.updateLayout();
                }
            }
            else {
                self.suspendLayout();

                var list = self.getFullList();
                for (var i = 0; i < list.length; i++)
                    self.toggle(list[i], value);

                self.resumeLayout();
            }
        }

        $scope.$on($scope.name + "-collapse", function (e, item) {
            self.toggle(item, false);
        });

        $scope.$on($scope.name + "-expand", function (e, item) {
            self.toggle(item, true);
        });

        $scope.$on($scope.name + "-toggle", function (e, item) {
            self.toggle(item);
        });

        // Filter  ---------------------------------------------------------------------

        this.filterParams = null;

        $scope.$on($scope.name + "-filter", function (e, params) {
            self.filter(params);
        });

        this.filter = function (params) {
            self.filterParams = params;
            self.updateLayout();
            self.callChange();
        }

        // Focus  ----------------------------------------------------------------------

        this.callGotFocus = function (event, item, edit, value) {
            if (angular.isDefined($scope.events) && $scope.events.gotFocus)
                $scope.events.gotFocus({
                    event: event,
                    item: item,
                    edit: edit != undefined ? true : false,
                    editValue: value
                });
            else
                $scope.gotFocus({
                    e: {
                        event: event,
                        item: item,
                        edit: edit != undefined ? true : false,
                        editValue: value
                    }
                });
        }

        this.callLostFocus = function (event, item, edit, value) {
            if (angular.isDefined($scope.events) && $scope.events.lostFocus)
                $scope.events.lostFocus({
                    event: event,
                    item: item,
                    edit: edit != undefined ? true : false,
                    editValue: value
                });
            else
                $scope.lostFocus({
                    e: {
                        event: event,
                        item: item,
                        edit: edit != undefined ? true : false,
                        editValue: value
                    }
                });
        }

        this.getTabIndex = function () {
            if ($elem[0].attributes && $elem[0].attributes['tabindex'])
                return $elem[0].attributes['tabindex'].value;

            return '';
        }

        this.updateFocus = function (item) {
            if (self.options.allowFocus == true) {
                var focusTimer = $timeout(function () {
                    //if (!item)
                    //item = self.options.selectedItem;

                    if (item) {
                        var itemElem = self.getElemFromItem(item);
                        if (itemElem) {
                            var contentElem = self.getElement(itemElem);
                            if (contentElem)
                                contentElem[0].focus();
                        }
                    }
                    else
                        $elem[0].focus();

                    $timeout.cancel(focusTimer);
                }, 5);
            }
        }

        $scope.$on($scope.name + "-focus", function (e, item) {
            self.updateFocus(item);
        });

        // General --------------------------------------------------------------------

        var isMouseButtonActive = false;

        var isItemExpanded = function (item) {
            return item ? item[self.options.dataFields.expanded] || item[self.options.dataFields.expanded] === undefined ? true : false : true;
        }

        this.getElement = function (parentElem, type) {
            var foundElem = null;

            if (!type)
                type = 'content';

            if (parentElem) {
                var childElems = parentElem.children();
                for (var j = 0; j < childElems.length; j++) {
                    var currentChildElem = angular.element(childElems.eq(j));
                    if (currentChildElem[0].attributes && currentChildElem[0].attributes['data-element'] && currentChildElem[0].attributes['data-element'].value === type) {
                        foundElem = currentChildElem;
                        break;
                    }
                }
            }

            return foundElem;
        }

        this.getElemFromItem = function (item) {
            var foundElem = null;

            if (item) {
                var index = self.getItemCurrentIndex(item);
                var elemList = $elem.find("li");
                if (elemList && elemList.length > 0) {
                    for (var i = 0; i < elemList.length; i++) {
                        var currentElem = angular.element(elemList[i]);
                        if (currentElem[0].attributes['data-index'] && currentElem[0].attributes['data-index'].value.toString() === index.toString()) {
                            foundElem = currentElem;
                            break;
                        }
                    }
                }
            }

            return foundElem;
        }

        this.getIndent = function (item) {
            var indent = 0;
            if (item && self.options.indent > 0) {
                parent = self.dataObj.getParent(item);
                while (parent) {
                    indent += self.options.indent;

                    parent = self.dataObj.getParent(parent);
                }
            }

            return indent;
        }

        this.getItemCurrentIndex = function (item) {
            return item && self.currentList ? self.currentList.indexOf(item) : -1;
        }

        this.getObjCurrentIndex = function (item) {
            return self.getItemCurrentIndex(item);
        }

        this.getObjState = function (obj) {
            if (obj) {
                switch (obj.type) {
                    case 'item':
                        if (obj[self.options.dataFields.enabled] == false)
                            return 'disabled';
                        else if (obj.selected == true && self.isObjInSelList(obj))
                            return 'selected';
                        else if (obj == self.hoverItem)
                            return 'hovered';
                        break;
                }
            }

            return 'normal';
        }

        this.getItemFromChildElem = function (childElem) {
            if (childElem) {
                childElem = angular.element(childElem);
                return childElem ? self.getItemFromElem(childElem[0].parentElement) : null;
            }

            return null;
        }

        this.getItemFromElem = function (elem) {
            if (elem) {
                elem = angular.element(elem);
                if (elem && elem[0].attributes['data-index']) {
                    var index = elem[0].attributes['data-index'].value;
                    if (self.isIndexInRange(index))
                        return self.currentList[index];
                }
            }
        }

        this.isIndexInRange = function (index) {
            return index >= 0 && index < self.currentList.length;
        }

        this.isItemEnabled = function (item) {
            return $internalService.isEnabled(item[self.options.dataFields.enabled]);
        }

        this.mouseButtonStatus = function (value) {
            isMouseButtonActive = value;
        }

        $scope.$on($scope.name + "-ensure-visible", function (e, item, pos) {
            self.ensureVisible(item, pos);
        });

        $scope.$on($scope.name + "-find-item-by-id", function (e, id) {
            $treeService.setTempData(self.findItemById(id));
        });

        $scope.$on($scope.name + "-find-item-by-text", function (e, text) {
            $treeService.setTempData(self.findItemByText(text));
        });

        $scope.$on($scope.name + "-get-full-path", function (e, item) {
            $treeService.setTempData(self.getFullPath(item));
        });

        $scope.$on($scope.name + "-get-item-level", function (e, item) {
            $treeService.setTempData(self.getLevel(item));
        });

        $scope.$on($scope.name + "-get-item-parent", function (e, item) {
            $treeService.setTempData(self.getParent(item));
        });

        $scope.$on($scope.name + "-get-flat-list", function (e, full) {
            if (full)
                $treeService.setTempData(self.getFullList());
            else
                $treeService.setTempData(self.currentList);
        });

        $scope.$on($scope.name + "-get-list", function (e, item, flat) {
            if (flat == true)
                $treeService.setTempData(self.getFullList(item));
            else
                $treeService.setTempData(self.getList(item));
        });

        this.ensureVisible = function (item, pos) {
            if (item) {
                self.suspendLayout();

                var tempList = [];
                var parent = self.getParent(item);

                while (parent) {
                    tempList.push(parent);
                    parent = self.getParent(parent);
                }

                for (var i = tempList.length - 1; i >= 0; i--)
                    self.toggle(tempList[i], true);

                self.resumeLayout();

                if (!pos)
                    pos = 'center';

                self.scrollTo(item, pos);
            }
        }

        this.findItemById = function (id) {
            return self.dataObj.findObjectById(id);
        }

        this.findItemByText = function (text) {
            return self.dataObj.findObjectByText(text);
        }

        this.getFullPath = function (item) {
            var path = '';

            if (item) {
                path = item[self.options.dataFields.text];

                var parent = self.getParent(item);
                while (parent) {
                    path = [parent[self.options.dataFields.text], self.options.pathSeparator, path].join('');
                    parent = self.getParent(parent);
                }
            }

            return path;
        }

        this.getLevel = function (item) {
            var level = 0;

            var parent = this.getParent(item);
            while (parent) {
                level++;
                parent = this.getParent(parent);
            }

            return level;
        }

        this.getParent = function (item) {
            return self.dataObj.getParent(item);
        }

        this.getList = function (item) {
            return self.dataObj.getList(item);
        }

        // Keyboard Navigation -----------------------------------------------------------

        this.getFirstItem = function () {
            var item = null;
            for (var i = 0; i < self.currentList.length; i++) {
                if (self.isItemEnabled(self.currentList[i])) {
                    item = self.currentList[i];
                    break;
                }
            }

            return item;
        }

        this.getPrevItem = function (index) {
            var item = null;
            if (index >= 0 && index < self.currentList.length) {
                for (var i = index - 1; i >= 0; i--) {
                    if (self.isItemEnabled(self.currentList[i])) {
                        item = self.currentList[i];
                        break;
                    }
                }
            }

            return item;
        }

        this.getNextItem = function (index) {
            var item = null;
            for (var i = index + 1; i < self.currentList.length; i++) {
                if (self.isItemEnabled(self.currentList[i])) {
                    item = self.currentList[i];
                    break;
                }
            }

            return item;
        }

        this.getLastItem = function () {
            var item = null;
            for (var i = self.currentList.length - 1; i >= 0; i--) {
                if (self.isItemEnabled(self.currentList[i])) {
                    item = self.currentList[i];
                    break;
                }
            }

            return item;
        }

        this.updateSelectionStatus = function (type) {
            switch (type) {
                case 'shift':
                    switch (self.options.selectionMode) {
                        case 'multi-simple':
                            self.multiSelection(true);
                            self.shiftKeyStatus(false);
                            break;
                        case 'multi-extended':
                            self.multiSelection(true);
                            self.shiftKeyStatus(true);
                            break;

                        default:
                            self.multiSelection(false);
                            self.shiftKeyStatus(false);
                            break;
                    }
                    break;

                case 'ctrl':
                    switch (self.options.selectionMode) {
                        case 'multi-simple':
                            self.multiSelection(true);
                            break;
                        case 'multi-extended':
                            self.multiSelection(true);
                            break;

                        default:
                            self.multiSelection(false);
                            break;
                    }
                    break;
            }
        }

        $elem.bind("keydown", function (e) {
            switch (e.keyCode) {
                case 16: // SHIFT
                    self.updateSelectionStatus('shift');
                    break;

                case 17: // CTRL
                    self.updateSelectionStatus('ctrl');
                    break;

                default:
                    if (e.ctrlKey || e.metaKey)
                        self.updateSelectionStatus('ctrl');
                    if (e.shiftKey)
                        self.updateSelectionStatus('shift');
                    break;
            }
        });


        // Layout ------------------------------------------------------------------------

        self.allowUpdate = true;

        this.suspendLayout = function () {
            self.allowUpdate = false;
        }

        this.resumeLayout = function () {
            self.allowUpdate = true;
            self.updateLayout();
        }

        $scope.$on($scope.name + "-refresh", function (e, item, parent) {
            self.refresh(item, parent);
        });

        $scope.$on($scope.name + "-resume-layout", function (e) {
            self.resumeLayout();
        });

        $scope.$on($scope.name + "-suspend-layout", function (e) {
            self.suspendLayout();
        });

        $scope.$on($scope.name + "-update-layout", function (e) {
            self.updateLayout();
        });

        $scope.$on($scope.name + "-update-view", function (e) {
            self.updateView();
        });

        // Loading -----------------------------------------------------------------------

        $scope.$on($scope.name + "-begin-load", function (e, item, animation) {
            if (item) {
                if (self.options.loadItems.indexOf(item) < 0)
                    self.options.loadItems.push(item);

                self.updateView();
            }
            else
                self.beginLoad(animation);
        });

        $scope.$on($scope.name + "-end-load", function (e, item) {
            self.endLoad(item);
        });

        this.callLoadComplete = function (row) {
            if (angular.isDefined($scope.events) && $scope.events.loadComplete)
                $scope.events.loadComplete();
            else
                $scope.loadComplete();
        }

        this.callUpdateComplete = function () {
            if (angular.isDefined($scope.events) && $scope.events.updateComplete)
                $scope.events.updateComplete();
            else
                $scope.updateComplete();
        }

        // Scrolling ---------------------------------------------------------------------

        $scope.$on($scope.name + "-get-scroll-pos", function (e) {
            $treeService.setTempData(self.getScrollPos());
        });

        $scope.$on($scope.name + "-set-scroll-pos", function (e, pos) {
            self.setScrollPos(pos);
        });

        $scope.$on($scope.name + "-scroll-to", function (e, item, pos) {
            self.scrollTo(item, pos);
        });


        // Selection ---------------------------------------------------------------------

        var isShiftKeyActive = false;
        var allowMultiSelection = false;

        this.shiftKeyStatus = function (value) {
            if (value != undefined)
                isShiftKeyActive = value;
            else
                return isShiftKeyActive;
        }

        this.multiSelection = function (value) {
            if (value != undefined)
                allowMultiSelection = value;
            else
                return allowMultiSelection;
        }

        this.isItemSelected = function (item) {
            return $internalService.isSelected(item);
        }

        this.clearPrevSelection = function (keepItem) {
            for (var i = 0; i < self.options.selectedItems.length; i++) {
                if (keepItem && !$internalService.isEqual(self.options.selectedItems[i][self.options.dataFields.id], keepItem[self.options.dataFields.id])) {
                    self.options.selectedItems[i].selected = false;
                }
                else if (!keepItem)
                    self.options.selectedItems[i].selected = false;
            }

            self.options.selectedItems.length = 0;
            if (keepItem && self.isItemEnabled(keepItem))
                self.options.selectedItems.push(keepItem);

            self.refresh();
        }

        this.selectionCancelled = false;

        this.itemSelection = function (event, item, value) {
            if (item) {
                if (self.options.selectionMode === 'none')
                    return;

                if (!self.isItemEnabled(item)) {
                    self.clearPrevSelection();
                }
                else {
                    var currentSelItem = self.itemSelection();

                    var pass = true;
                    if (currentSelItem)
                        pass = !$internalService.isEqual(currentSelItem[self.options.dataFields.id], item[self.options.dataFields.id]);

                    var allowSelect = true;
                    if (angular.isDefined($scope.events) && $scope.events.beforeSelect)
                        allowSelect = $scope.events.beforeSelect({item: item});
                    else
                        allowSelect = $scope.beforeSelect({e: {item: item}});

                    self.selectionCancelled = allowSelect == false;

                    if (allowSelect != false) {
                        if (pass) {
                            pass = true;
                            if (self.options.selectionMode === 'multi-extended')
                                pass = !self.isObjInSelList(item);

                            if (pass) {
                                if (isMouseButtonActive && (isShiftKeyActive || (event && event.shiftKey)))
                                    self.clearPrevSelection();
                                else if (!allowMultiSelection && self.options.selectionMode !== 'multi-simple')
                                    self.clearPrevSelection();
                            }

                            //if (!allowMultiSelection){
                            self.options.selectedItem = item;
                            //}

                            if (isMouseButtonActive && (isShiftKeyActive || (event && event.shiftKey)) && self.options.selectionMode != 'one') {
                                var firstSelIndex = self.getItemCurrentIndex(currentSelItem);
                                var lastSelIndex = self.getItemCurrentIndex(item);

                                if (firstSelIndex > lastSelIndex) {
                                    var tempIndex = firstSelIndex;
                                    firstSelIndex = lastSelIndex;
                                    lastSelIndex = tempIndex;
                                }

                                if (self.isIndexInRange(firstSelIndex) && self.isIndexInRange(lastSelIndex)) {
                                    for (var i = firstSelIndex; i <= lastSelIndex; i++) {
                                        self.currentList[i].selected = true;
                                        self.options.selectedItems.push(self.currentList[i]);
                                    }
                                }
                            }
                            else if (isMouseButtonActive && (allowMultiSelection || self.options.selectionMode === 'multi-simple')) {
                                var currentSelValue = item.selected === null || item.selected === 'undefined' ? false : item.selected;
                                item.selected = !currentSelValue;

                                if (!item.selected)
                                    self.options.selectedItems = self.options.selectedItems.filter(function (obj) {
                                        return (obj != item);
                                    });
                                else if (!self.isObjInSelList(item))
                                    self.options.selectedItems.push(item);
                            }
                            else {
                                item.selected = true;
                                if (!self.isObjInSelList(item))
                                    self.options.selectedItems.push(item);
                            }

                            if (angular.isDefined($scope.selectedItem))
                                $scope.selectedItem = item;

                            self.callAfterSelect(item);

                            self.refresh();
                        }
                        else if (allowMultiSelection || self.options.selectionMode === 'multi-simple') {
                            var currentSelValue = item.selected === null || item.selected === 'undefined' ? false : item.selected;
                            if (value && value !== 'undefined')
                                currentSelValue = value;

                            item[self.options.dataFields.selected] = !currentSelValue;

                            if (!item[self.options.dataFields.selected]) {
                                self.options.selectedItems = self.options.selectedItems.filter(function (obj) {
                                    return (obj != item);
                                });
                            }
                            else if (!self.isObjInSelList(item))
                                self.options.selectedItems.push(item);

                            self.callAfterSelect(item);

                            self.refresh();
                        }
                    }
                }
            }
            else
                return self.options.selectedItem;
        }

        this.updateSelection = function (event, item) {
            if (self.options.selectionMode !== 'multi-simple' && self.options.selectedItems.length > 0 && !isShiftKeyActive && !event.shiftKey && !allowMultiSelection && !self.selectionCancelled)
                self.clearPrevSelection(item);

            self.selectionCancelled = false;
        }

        this.selectFirstItem = function () {
            var item = null;
            for (var i = 0; i < self.currentList.length; i++) {
                if (self.isItemEnabled(self.currentList[i])) {
                    item = self.currentList[i];
                    break;
                }
            }

            this.itemSelection(null, item);

            return self.options.selectedItem;
        }

        this.isObjInSelList = function (obj) {
            var found = false;

            var list = self.options.selectedItems;
            if (obj && list) {
                for (var i = 0; i < list.length; i++) {
                    if ($internalService.isEqual(list[i][self.options.dataFields.id], obj[self.options.dataFields.id])) {
                        found = true;
                        break;
                    }
                }
            }

            return found;
        }

        this.getItemAt = function (x, y) {
            var currentElem = null;

            var elemRect = null;

            var foundItem = null;
            var elemList = $elem.find("li");
            if (elemList && elemList.length > 0) {
                for (var i = 0; i < elemList.length; i++) {
                    currentElem = angular.element(elemList[i]);

                    elemRect = $internalService.getPageRect(currentElem);

                    if ($internalService.checkHit(x, y, elemRect)) {
                        foundItem = self.getItemFromElem(currentElem);
                        break;
                    }
                }
            }

            return foundItem;
        }

        this.resetSelection = function () {
            switch (self.options.selectionMode) {
                case 'none':
                    self.clearPrevSelection();
                    break;

                default:
                    self.clearPrevSelection(self.itemSelection());
                    break;
            }
        }

        // Calls to Public Methods --------------------------------------------------------

        $scope.$on($scope.name + "-clear-selection", function (e) {
            self.clearPrevSelection();
            self.options.selectedItem = null;
        });

        $scope.$on($scope.name + "-get-selected-item", function (e) {
            $treeService.setTempData(self.itemSelection());
        });

        $scope.$on($scope.name + "-set-selected-item", function (e, item) {
            self.itemSelection(null, item);
        });

        $scope.$on($scope.name + "-get-selected-items", function (e) {
            $treeService.setTempData(self.options.selectedItems);
        });

        $scope.$on($scope.name + "-move-item", function (e, item, targetItem, direction, position) {
            self.moveItem(item, targetItem, direction, position);
        });

        // Watchers ----------------------------------------------------------------------

        $scope.$watch("options", function (newValue, oldValue) {
            if (newValue !== oldValue) {
                self.updateOptions(newValue);
                self.updateLayout();
            }
        }, true);


        $scope.$watch("allowDrag", function (newValue, oldValue) {
            if (newValue !== oldValue) {
                self.options.allowDrag = newValue;
                self.updateView();
            }
        });

        $scope.$watch("allowDrop", function (newValue, oldValue) {
            if (newValue !== oldValue) {
                self.options.allowDrop = newValue;
                self.updateView();
            }
        });

        $scope.$watch("allowFocus", function (newValue, oldValue) {
            if (newValue !== oldValue)
                self.options.allowFocus = newValue;
        });

        $scope.$watch("autoCheck", function (newValue, oldValue) {
            if (newValue !== oldValue) {
                self.options.autoCheck = newValue;
                self.updateView();
            }
        });

        $scope.$watch("autoExpand", function (newValue, oldValue) {
            if (newValue !== oldValue)
                self.options.autoExpand = newValue;
        });

        $scope.$watch("checkBoxSettings", function (newValue, oldValue) {
            if (newValue !== oldValue) {
                self.updateCheckBoxSettings(newValue);
            }
        });

        $scope.$watch("controlStyle", function (newValue, oldValue) {
            if (newValue !== oldValue) {
                self.updateControlStyle(newValue);
            }
        });

        $scope.$watch("editorSettings", function (newValue, oldValue) {
            if (newValue !== oldValue)
                self.updateEditorSettings(newValue);
        });

        $scope.$watch("fields", function (newValue, oldValue) {
            if (newValue !== oldValue) {
                self.options.dataFields = newValue;
                self.UpdateData();
            }
        });

        $scope.$watch("hoverSelection", function (newValue, oldValue) {
            if (newValue !== oldValue)
                self.options.hoverSelection = newValue;
        });

        $scope.$watch("indent", function (newValue, oldValue) {
            if (newValue !== oldValue) {
                self.options.indent = newValue;
                self.updateLayout();
            }
        });

        $scope.$watch("itemIcon", function (newValue, oldValue) {
            if (newValue !== oldValue) {
                self.options.itemIcon = newValue;
                self.updateLayout();
            }
        });

        $scope.$watch("labelEdit", function (newValue, oldValue) {
            if (newValue !== oldValue)
                self.options.labelEdit = newValue;
        });

        $scope.$watch("pathSeparator", function (newValue, oldValue) {
            if (newValue !== oldValue)
                self.options.pathSeparator = newValue;
        });

        $scope.$watch("rtl", function (newValue, oldValue) {
            if (newValue !== oldValue) {
                self.options.rtl = newValue;
                self.updateLayout();
            }
        });

        $scope.$watch("selectionMode", function (newValue, oldValue) {
            if (newValue !== oldValue) {
                self.options.selectionMode = newValue;
                self.resetSelection();
            }
        });

        $scope.$watch("showCheckBoxes", function (newValue, oldValue) {
            if (newValue !== oldValue) {
                self.options.showCheckBoxes = newValue;
                self.updateLayout();
            }
        });

        $scope.$watch("showIcons", function (newValue, oldValue) {
            if (newValue !== oldValue) {
                self.options.showIcons = newValue;
                self.updateLayout();
            }
        });

        $scope.$watch("showStatusIcons", function (newValue, oldValue) {
            if (newValue !== oldValue) {
                self.options.showStatusIcons = newValue;
                self.updateLayout();
            }
        });

        $scope.$watch("selectedItem", function (newValue, oldValue) {
            if (newValue !== oldValue) {
                if (oldValue)
                    oldValue.selected = false;

                self.options.selectedItem = newValue;
                self.callAfterSelect(newValue);
            }
        });


        // Sorting  ----------------------------------------------------------------------

        this.sortComparer = null;

        $scope.$watch("sorting", function (newValue, oldValue) {
            if (newValue !== oldValue) {
                self.options.sorting = newValue;
            }
        });

        $scope.$on($scope.name + "-sort", function (e, order, comparer) {
            self.sort(order, comparer);
        });

        this.sort = function (order, comparer) {
            self.sortComparer = comparer;
            if (order == 'ascending' || order == 'descending' || order == 'none')
                self.options.sorting = order;

            self.updateLayout();
            self.callChange();
        }

        this.isSortingAllowed = function () {
            return self.options.sorting == 'ascending' || self.options.sorting == 'descending';
        }

        this.applySorting = function (list) {
            if (list) {
                if (self.sortComparer)
                    list.sort(self.sortComparer);
                else if (self.isSortingAllowed()) {
                    list.sort(function (firstObj, secondObj) {
                        var x = null;
                        var y = null;

                        // First Value
                        x = firstObj[self.options.dataFields.value];
                        if (!x)
                            x = firstObj[self.options.dataFields.text];

                        if ($internalService.isObject(x))
                            x = x.value ? x.value : x.text;

                        // Second Value
                        y = secondObj[self.options.dataFields.value];
                        if (!y)
                            y = secondObj[self.options.dataFields.text];

                        if ($internalService.isObject(y))
                            y = y.value ? y.value : y.text;


                        x = x != undefined ? x : null;
                        y = y != undefined ? y : null;

                        switch (self.options.sorting) {
                            case 'ascending':
                                if (x < y)
                                    return -1;
                                else if (x > y)
                                    return 1;
                                break;

                            case 'descending':
                                if (x > y)
                                    return -1;
                                else if (x < y)
                                    return 1;
                                break;

                            default:
                                return 0;
                        }
                    });
                }
            }
        }


        // Styles ------------------------------------------------------------------------

        var getCheckBoxStyle = function (value) {
            if (value)
                return {
                    general: $internalService.isFieldAvailable(value.general, checkBoxClassName + '-box'),
                    disabled: $internalService.isFieldAvailable(value.disabled, checkBoxClassName + '-disabled'),
                    checked: $internalService.isFieldAvailable(value.checked, checkBoxClassName + '-checked'),
                    indeterminate: $internalService.isFieldAvailable(value.indeterminate, checkBoxClassName + '-indeterminate'),
                    unchecked: $internalService.isFieldAvailable(value.unchecked, checkBoxClassName + '-unchecked')
                }

            return self.options.controlStyle.item.checkBox.box;
        }

        var getCheckStyle = function (value) {
            if (value)
                return {
                    general: $internalService.isFieldAvailable(value.general, checkBoxClassName),
                    box: getCheckBoxStyle(value.box)
                }

            return self.options.controlStyle.item.checkBox;
        }

        this.getExpandBoxStyle = function (value) {
            if (value)
                return {
                    general: $internalService.isFieldAvailable(value.general, expandBoxClassName),
                    animated: $internalService.isFieldAvailable(value.animated, expandBoxClassName + '-load'),
                    expanded: $internalService.isFieldAvailable(value.expanded, expandBoxClassName + '-open'),
                    collapsed: $internalService.isFieldAvailable(value.collapsed, expandBoxClassName + '-close')
                }

            return self.options.controlStyle.item.expandBox;
        }

        var getItemGeneralStyle = function (value) {
            if ($internalService.isString(value))
                return value;
            else if (value)
                return {
                    disabled: $internalService.isFieldAvailable(value.disabled, itemClassName + '-disabled'),
                    focused: $internalService.isFieldAvailable(value.focused, itemClassName + '-focused'),
                    normal: $internalService.isFieldAvailable(value.normal, itemClassName),
                    hovered: $internalService.isFieldAvailable(value.hovered, itemClassName + '-hovered'),
                    selected: $internalService.isFieldAvailable(value.selected, itemClassName + '-selected')
                }

            return self.options.controlStyle.item.general;
        }

        var getItemContentStyle = function (value) {
            if ($internalService.isString(value))
                return value;
            else if (value)
                return {
                    disabled: $internalService.isFieldAvailable(value.disabled, itemContentClassName + '-disabled'),
                    focused: $internalService.isFieldAvailable(value.focused, itemContentClassName + '-focused'),
                    normal: $internalService.isFieldAvailable(value.normal, itemContentClassName),
                    hovered: $internalService.isFieldAvailable(value.hovered, itemContentClassName + '-hovered'),
                    selected: $internalService.isFieldAvailable(value.selected, itemContentClassName + '-selected')
                }

            return self.options.controlStyle.item.content;
        }

        var getItemStyle = function (value) {
            if (value)
                return {
                    general: getItemGeneralStyle(value.general),
                    checkBox: getCheckStyle(value.checkBox),
                    expandBox: self.getExpandBoxStyle(value.expandBox),
                    content: getItemContentStyle(value.content)
                }

            return self.options.controlStyle.item;
        }

        this.updateControlStyle = function (value) {
            if (value) {
                self.options.controlStyle = {
                    general: $internalService.isFieldAvailable(value.general, generalClassName),
                    item: getItemStyle(value.item)
                }
            }
            else
                self.options.controlStyle = {
                    general: $internalService.isFieldAvailable(self.defaultStyle.general, generalClassName),
                    item: getItemStyle(self.defaultStyle.item)
                }
        }

        this.getCurrentItemStyle = function (item, state) {
            var retStyle = self.options.controlStyle.item;

            if (item) {
                switch (item.style) {
                    case 'initial':
                        break;

                    case 'parent':
                        return self.getCurrentItemStyle(self.getParent(item), state);

                    default:
                        if (item.style != null)
                            retStyle = item.style;
                        break;
                }
            }

            if (state) {
                if ($internalService.isString(retStyle.general))
                    return retStyle.general;
                else {
                    switch (state) {
                        case 'disabled':
                            return retStyle.general && retStyle.general.disabled ? retStyle.general.disabled : self.options.controlStyle.item.general.disabled;
                        case 'focused':
                            return retStyle.general && retStyle.general.focused ? retStyle.general.focused : self.options.controlStyle.item.general.focused;
                        case 'hovered':
                            return retStyle.general && retStyle.general.hovered ? retStyle.general.hovered : self.options.controlStyle.item.general.hovered;
                        case 'selected':
                            return retStyle.general && retStyle.general.selected ? retStyle.general.selected : self.options.controlStyle.item.general.selected;
                        default:
                            return retStyle.general && retStyle.general.normal ? retStyle.general.normal : self.options.controlStyle.item.general.normal;
                    }
                }
            }
            else
                return retStyle ? retStyle : self.options.controlStyle.item;
        }

        this.getCurrentItemContentStyle = function (item, state) {
            var retStyle = self.options.controlStyle.item.content;

            if (item) {
                switch (item.style) {
                    case 'initial':
                        break;

                    case 'parent':
                        return self.getCurrentItemContentStyle(self.getParent(item), state);

                    default:
                        if (item.style != null && item.style.content)
                            retStyle = item.style.content;
                        break;
                }
            }

            if (state) {
                if ($internalService.isString(retStyle))
                    return retStyle;
                else {
                    switch (state) {
                        case 'disabled':
                            return retStyle && retStyle.disabled ? retStyle.disabled : self.options.controlStyle.item.content.disabled;
                        case 'focused':
                            return retStyle && retStyle.focused ? retStyle.focused : self.options.controlStyle.item.content.focused;
                        case 'hovered':
                            return retStyle && retStyle.hovered ? retStyle.hovered : self.options.controlStyle.item.content.hovered;
                        case 'selected':
                            return retStyle && retStyle.selected ? retStyle.selected : self.options.controlStyle.item.content.selected;
                        default:
                            return retStyle && retStyle.normal ? retStyle.normal : self.options.controlStyle.item.content.normal;
                    }
                }
            }
            else
                return retStyle ? retStyle : self.options.controlStyle.item.content;
        }
    }])
    // IntegralUI TreeView Directive ------------------------------------------------------
    .directive("iuiTreeview", ["$compile", "$timeout", "$interval", "IntegralUIInternalService", "IntegralUIDragDrop", "$window", function ($compile, $timeout, $interval, $internalService, $dragDropService, $window) {
        return {
            restrict: "EA",
            controller: 'IntegralUITreeViewController',
            transclude: true,
            replace: true,
            template: '<div class="iui-treeview" data-element="treeview">' +
            '<ul class="iui-treeview-block"></ul>' +
            '</div>',
            scope: {
                // Properties --------------------------------------------------------------------
                allowAnimation: '=',
                allowDrag: '=',
                allowDrop: '=',
                allowFocus: '=',
                animationSpeed: '=',
                autoCheck: '=',
                autoExpand: '=',
                checkboxSettings: '=',
                controlStyle: '=',
                editorSettings: '=',
                fields: '=',
                hoverSelection: '=',
                itemIcon: '=',
                indent: '=',
                items: '=',
                labelEdit: '=',
                name: '@',
                options: '=?',
                pathSeparator: '@',
                rtl: '=',
                selectedIndex: '=',
                selectedItem: '=',
                selectionMode: '@',
                showCheckBoxes: '=',
                showIcons: '=',
                showStatusIcons: '=',
                sorting: '@',
                // Events ------------------------------------------------------------------------
                afterCollapse: '&',
                afterEdit: '&',
                afterExpand: '&',
                afterLabelEdit: '&',
                afterSelect: '&',
                beforeCollapse: '&',
                beforeEdit: '&',
                beforeExpand: '&',
                beforeLabelEdit: '&',
                beforeSelect: '&',
                change: '&',
                clear: '&',
                dragDrop: '&',
                dragEnter: '&',
                dragLeave: '&',
                dragOver: '&',
                events: '=?',
                itemAdded: '&',
                itemAdding: '&',
                itemCheckedChanging: '&',
                itemCheckedChanged: '&',
                itemCheckstateChanging: '&',
                itemCheckstateChanged: '&',
                itemClick: '&',
                itemDblclick: '&',
                itemHover: '&',
                loadComplete: '&',
                gotFocus: '&',
                keyDown: '&',
                keyPress: '&',
                keyUp: '&',
                lostFocus: '&',
                itemRemoved: '&',
                itemRemoving: '&',
                itemRightclick: '&',
                scrollposChanged: '&',
                selectionChanged: '&',
                updateComplete: '&'
            },
            link: linkFn
        };

        function linkFn($scope, $elem, $attrs, $listCtrl, $transclude) {
            var self = this;

            var blockElem = $elem.children().eq(0);

            var verScrollBarTemplate = '<div class="iui-scrollbar-vertical">' +
                    //'<div class="iui-scroll-button-up"></div>' +
                '<div class="iui-scroll-button-thumb-vertical"></div>' +
                    //'<div class="iui-scroll-button-down"></div>' +
                '</div>';

            var horScrollBarTemplate = '<div class="iui-scrollbar-horizontal">' +
                    //'<div class="iui-scroll-button-left"></div>' +
                '<div class="iui-scroll-button-thumb-horizontal"></div>' +
                    //'<div class="iui-scroll-button-right"></div>' +
                '</div>';

            var scrollBarCornerTemplate = '<div class="iui-scrollbar-corner"></div>';

            var verScrollElem = angular.element(verScrollBarTemplate);
            var horScrollElem = angular.element(horScrollBarTemplate);
            var scrollCornerElem = angular.element(scrollBarCornerTemplate);

            var dragTimer = null;
            var editTimer = null;
            var hoverTimer = null;

            var labelEditElem = $listCtrl.getEditBox();

            // Appearance ---------------------------------------------------------

            var getBlockClass = function () {
                var classNames = "iui-treeview-block";

                if ($listCtrl.options.showStatusIcons)
                    classNames += " " + classNames + "-shift-left";

                if ($listCtrl.options.rtl)
                    classNames += " " + classNames + "-rtl";

                return classNames;
            }

            var updateBlockStyle = function () {
                $elem.removeClass('iui-treeview-block-rtl');
                if ($listCtrl.options.rtl)
                    $elem.addClass('iui-treeview-block-rtl');

                blockElem.removeClass('iui-treeview-block-shift-left iui-treeview-block-rtl');
                blockElem.addClass(getBlockClass());
            }

            // Destroy -------------------------------------------------------------------

            $scope.$on("$destroy", function (e) {
                $elem.unbind("click dblclick dragenter dragleave dragend drop keydown mousedown mouseleave mousemove mousewheel scroll");

                $(window).off("dragenter." + $scope.$id + " dragover." + $scope.$id + " dragend." + $scope.$id + " mousemove." + $scope.$id + " mouseup." + $scope.$id);

                if (labelEditElem)
                    labelEditElem.unbind("blur focus keydown mousedown");

                clearEvents();

                if (itemScope)
                    itemScope.$destroy();
            });

            // Drag&Drop ---------------------------------------------------------

            $elem.append($listCtrl.getDropMarkWindow());
            $listCtrl.dropMark();

            var cancelDragTimer = function () {
                if (dragTimer) {
                    $timeout.cancel(dragTimer);
                    dragTimer = null;
                }
            }

            $listCtrl.addDropMark = function () {
                var getBodyElem = function (obj) {
                    var elem = null;
                    while (obj) {
                        if (obj === document.getElementsByTagName("body")[0]) {
                            elem = obj;
                            break;
                        }

                        obj = obj.offsetParent;
                    }

                    return elem;
                }

                var bodyElem = getBodyElem($elem[0]);
                if (bodyElem) {
                    angular.element(bodyElem).append($listCtrl.getDropMarkWindow());
                    $listCtrl.dropMark();
                }
            }

            $listCtrl.removeDropMark = function () {
                $listCtrl.getDropMarkWindow().remove();
            }

            var processDragStart = function (e, childElem) {
                if ($listCtrl.labelEditStatus()) {
                    e.preventDefault();
                    return;
                }

                $dragDropService.clearData();

                var item = $listCtrl.getItemFromChildElem(childElem);
                if (item) {
                    cancelEditTimer();

                    if (!$listCtrl.isDragAllowed(item)) {
                        if (e.dataTransfer)
                            e.dataTransfer.effectAllowed = 'none';
                        else if (e.originalEvent && e.originalEvent.dataTransfer)
                            e.originalEvent.dataTransfer.effectAllowed = 'none';
                    }
                    else {
                        $listCtrl.dragDropStatus(true);
                        $listCtrl.addDropMark();

                        if (e.dataTransfer) {
                            e.dataTransfer.effectAllowed = 'move';
                            e.dataTransfer.setData("text", item[$listCtrl.options.dataFields.id] ? item[$listCtrl.options.dataFields.id].toString() : '');
                        }
                        else if (e.originalEvent && e.originalEvent.dataTransfer) {
                            e.originalEvent.dataTransfer.effectAllowed = 'move';
                            e.originalEvent.dataTransfer.setData("text", item[$listCtrl.options.dataFields.id] ? item[$listCtrl.options.dataFields.id].toString() : '');
                        }

                        var dragDropData = {source: item, sourceCtrl: $listCtrl, sourceCollection: $listCtrl.dataObj};
                        switch ($listCtrl.options.selectionMode) {
                            case 'multi-simple':
                                dragDropData.source = $listCtrl.options.selectedItems;
                                break;
                            case 'multi-extended':
                                dragDropData.source = $listCtrl.options.selectedItems;
                                break;
                        }

                        $dragDropService.setData(dragDropData);
                    }
                }
            }

            var processDragOver = function (e, childElem) {
                if ($listCtrl.labelEditStatus())
                    $listCtrl.closeEditor();

                e.preventDefault();

                var pass = true;
                if (e.dataTransfer)
                    pass = e.dataTransfer.effectAllowed === 'none' ? false : true;
                else if (e.originalEvent && e.originalEvent.dataTransfer)
                    pass = e.originalEvent.dataTransfer.effectAllowed === 'none' ? false : true;

                if (pass) {
                    var item = $listCtrl.getItemFromChildElem(childElem);
                    if (item) {
                        var boundRect = childElem[0].getBoundingClientRect();

                        var shiftPos = {
                            x: angular.element($window)[0].pageXOffset,
                            y: angular.element($window)[0].pageYOffset
                        }

                        var mousePos = $listCtrl.getMousePos(e);
                        mousePos.x -= (boundRect.left + shiftPos.x);
                        mousePos.y -= (boundRect.top + shiftPos.y);

                        var itemBounds = {
                            x: 0,
                            y: 0,
                            width: childElem[0].offsetWidth,
                            height: childElem[0].offsetHeight
                        }

                        var dropPos = $dragDropService.getDropPos(mousePos, itemBounds);
                        var dragDropData = $dragDropService.getData();
                        pass = $listCtrl.isDropAllowed(dragDropData.source, item, dropPos);

                        var eventObj = {
                            event: e,
                            sourceTree: dragDropData.sourceCtrl ? dragDropData.sourceCtrl.getTreeName() : '',
                            dragItem: dragDropData.source,
                            targetTree: $listCtrl.getTreeName(),
                            targetItem: item,
                            isDropAllowed: pass,
                            dropPos: dropPos,
                            mousePos: $listCtrl.getMousePos(e)
                        }

                        var dragResult = $listCtrl.callDragOver(eventObj);

                        if (!pass || dragResult == false) {
                            if (e.dataTransfer)
                                e.dataTransfer.dropEffect = "none";
                            else if (e.originalEvent && e.originalEvent.dataTransfer)
                                e.originalEvent.dataTransfer.dropEffect = "none";

                            $listCtrl.dropMark();
                        }
                        else {
                            var tempMousePos = $listCtrl.getMousePos(e);
                            var cssTopValue = tempMousePos.y + 16;
                            var cssLeftValue = tempMousePos.x + 20;

                            var popWin = $listCtrl.getDropMarkWindow();
                            popWin.empty();
                            var dropMarkerClass = 'iui-drop-marker-move-in';
                            var direction = 'Move to: ';
                            switch (dropPos) {
                                case 1:
                                    direction = 'Move before: ';
                                    dropMarkerClass = 'iui-drop-marker-move-up';
                                    break;
                                case 2:
                                    direction = 'Move after: ';
                                    dropMarkerClass = 'iui-drop-marker-move-down';
                                    break;
                            }
                            direction = '';

                            popWin.append("<span class='" + dropMarkerClass + "'></span><span class='iui-drop-marker-title'>" + direction + item[$listCtrl.options.dataFields.text] + "</span>");
                            $listCtrl.updateDropMarkElem($listCtrl.getDropMarkWindow(), {
                                top: cssTopValue,
                                left: cssLeftValue
                            });
                            $listCtrl.dropMark(pass);

                            // Update Drag Drop Data
                            $dragDropService.setData({
                                source: dragDropData.source,
                                sourceList: dragDropData.sourceList,
                                target: item,
                                dropPos: dropPos
                            });
                        }
                    }
                }

                //e.stopPropagation();
            }

            var processDragDrop = function (e, childElem) {
                e.preventDefault();

                cancelDragTimer();
                $listCtrl.dropMark();

                var pass = true;
                if (e.dataTransfer)
                    pass = e.dataTransfer.effectAllowed === 'none' ? false : true;
                else if (e.originalEvent && e.originalEvent.dataTransfer)
                    pass = e.originalEvent.dataTransfer.effectAllowed === 'none' ? false : true;

                if (pass) {
                    var item = $listCtrl.getItemFromChildElem(childElem);
                    if (item) {
                        var data = $dragDropService.getData();
                        var dragDropSource = data.source;
                        if (!dragDropSource)
                            dragDropSource = $listCtrl.getDnDSource(e);

                        pass = $listCtrl.isDropAllowed(dragDropSource, item, data.dropPos);
                        if (pass) {
                            //$listCtrl.toggle(item, true);

                            if (dragDropSource) {
                                var eventObj = {
                                    event: e,
                                    sourceTree: data.sourceCtrl ? data.sourceCtrl.getTreeName() : '',
                                    dragItem: dragDropSource,
                                    targetTree: $listCtrl.getTreeName(),
                                    targetItem: item,
                                    isDropAllowed: pass,
                                    dropPos: data.dropPos,
                                    mousePos: $listCtrl.getMousePos(e)
                                }

                                var dropResult = $listCtrl.callDragDrop(eventObj);

                                if (dropResult !== false) {
                                    $listCtrl.drop(data);

                                    if (!$scope.$$phase)
                                        $scope.$apply();
                                }
                            }
                        }
                    }
                }

                $dragDropService.clearData();
                $listCtrl.dragDropStatus(false);

                e.stopPropagation();
            }

            // Expand/Collapse -----------------------------------------------------------

            var isItemLoading = function (item) {
                return $listCtrl.options.loadItems.indexOf(item) >= 0 ? true : false;
            }

            var getExpandBoxClass = function (item) {
                var classNames = "";

                var defaultExpandBoxClass = $listCtrl.defaultStyle.item.expandBox.general;
                if ($listCtrl.options.controlStyle.item.expandBox.general != defaultExpandBoxClass)
                    defaultExpandBoxClass += ' ' + $listCtrl.options.controlStyle.item.expandBox.general;

                var currentItemStyle = $listCtrl.getCurrentItemStyle(item);
                var currentExpandBoxStyle = $listCtrl.getExpandBoxStyle(currentItemStyle.expandBox);

                if ($listCtrl.isThereChildItems || (item && item[$listCtrl.options.dataFields.hasChildren]))
                    classNames = defaultExpandBoxClass;

                if (item && (item[$listCtrl.options.dataFields.hasChildren] || (item[$listCtrl.options.dataFields.items] && item[$listCtrl.options.dataFields.items].length > 0 && $listCtrl.isThereVisibleChildren(item)))) {
                    if (isItemLoading(item))
                        classNames += " " + currentExpandBoxStyle.animated;
                    else {
                        if (item[$listCtrl.options.dataFields.hasChildren] && item[$listCtrl.options.dataFields.expanded] === undefined)
                            classNames += " " + currentExpandBoxStyle.expanded;
                        else if (item[$listCtrl.options.dataFields.expanded] != false)
                            classNames += " " + currentExpandBoxStyle.collapsed;
                        else
                            classNames += " " + currentExpandBoxStyle.expanded;

                        if ($listCtrl.options.rtl === true)
                            classNames += "-rtl";

                        if (!$listCtrl.isItemEnabled(item))
                            classNames += "-disabled";
                    }
                }

                return classNames;
            }

            // Events --------------------------------------------------------------------

            var clearEvents = function () {
                var elemList = blockElem.find("li");
                if (elemList.length > 0) {
                    for (var i = 0; i < elemList.length; i++) {
                        currentElem = angular.element(elemList[i]);

                        // Unbind all events for item element
                        currentElem.unbind("dragover drop dragenter dragleave dragend");

                        // Unbind all events for expand box element
                        clearExpBoxEvents($listCtrl.getElement(currentElem, 'expandbox'));

                        // Unbind all events for content element (item title or custom content)
                        clearContentEvents($listCtrl.getElement(currentElem));
                    }
                }
            }

            var bindEvents = function () {
                var currentItem = null;

                var elemList = blockElem.find("li");
                if (elemList.length > 0) {
                    var currentElem = null;
                    for (var i = 0; i < elemList.length; i++) {
                        currentElem = angular.element(elemList[i]);

                        currentItem = $listCtrl.getItemFromElem(currentElem);
                        if (currentItem && $listCtrl.isItemEnabled(currentItem)) {
                            // Bind all events for item element
                            bindItemEvents(currentElem);

                            // Bind all events for expand box element
                            bindExpBoxEvents($listCtrl.getElement(currentElem, 'expandbox'));

                            // Bind all events for expand box element
                            bindIconEvents($listCtrl.getElement(currentElem, 'icon'), currentItem);

                            // Bind all events for content element (item title or custom content)
                            bindContentEvents($listCtrl.getElement(currentElem), currentItem);
                        }
                    }
                }
            }

            // Item Element Events
            var bindItemEvents = function (itemElem) {
                if (itemElem) {
                    // Drag&Drop ---------------------------------------------------------

                    itemElem.bind("dragover", function (e) {
                        processScroll(e);

                        e.stopPropagation();
                    });

                    itemElem.bind("dragend", function (e) {
                        e.preventDefault();

                        $listCtrl.dragDropStatus(false);

                        $listCtrl.dropMark();

                        var data = $dragDropService.getData();
                        if (!data.source)
                            $dragDropService.clearData();

                        //e.stopPropagation();
                    });
                }
            }

            // ExpandBox Element Events
            var bindExpBoxEvents = function (expBoxElem) {
                if (expBoxElem) {
                    expBoxElem.bind("click", function (e) {
                        var elem = angular.element(this);

                        var item = $listCtrl.getItemFromChildElem(elem);
                        if (item)
                            $listCtrl.toggle(item);

                        e.stopPropagation();
                    });
                }
            }

            var clearExpBoxEvents = function (expBoxElem) {
                if (expBoxElem)
                    expBoxElem.unbind("click");
            }

            // Icon Element Events
            var bindIconEvents = function (iconElem, currentItem) {
                if (iconElem) {
                    iconElem.bind("dragover", function (e) {
                        processDragOver(e, angular.element(this));
                    });

                    iconElem.bind("drop", function (e) {
                        processDragDrop(e, angular.element(this));
                    });
                }
            }

            var clearIconEvents = function (iconElem) {
                if (iconElem)
                    iconElem.unbind("dragover drop");
            }

            $listCtrl.dragIcon = document.createElement('img');
            $listCtrl.dragIcon.width = 1;

            // Content Element Events
            var bindContentEvents = function (contentElem, currentItem) {
                if (contentElem) {
                    if ($listCtrl.isDragAllowed(currentItem))
                        contentElem.attr("draggable", true);

                    // Make each item to receive input focus
                    if ($listCtrl.options.allowFocus == true) {
                        var ctrlTabIndex = $listCtrl.getTabIndex();
                        var itemTabIndex = ctrlTabIndex.toString() + ($listCtrl.getItemCurrentIndex($listCtrl.getItemFromChildElem(contentElem)) + 1).toString();
                        contentElem.attr('tabindex', itemTabIndex);
                    }

                    // Drag&Drop ---------------------------------------------------------

                    contentElem.bind("dragstart", function (e) {
                        processDragStart(e, angular.element(this));
                    });

                    contentElem.bind("dragover", function (e) {
                        processDragOver(e, angular.element(this));
                    });

                    contentElem.bind("drop", function (e) {
                        processDragDrop(e, angular.element(this));
                    });

                    contentElem.bind("dragenter", function (e) {
                        e.preventDefault();

                        var elem = angular.element(this);
                        var item = $listCtrl.getItemFromChildElem(elem);
                        if (item) {
                            $listCtrl.hoverItem = item;
                            $listCtrl.refresh();//(item);

                            if ($listCtrl.options.autoExpand) {
                                var dragEnterTimer = $timeout(function () {
                                    if (!dragTimer) {
                                        dragTimer = $timeout(function () {
                                            if (dragTimer)
                                                $listCtrl.toggle(item, true);
                                        }, 750);
                                    }

                                    $timeout.cancel(dragEnterTimer);
                                }, 1);
                            }
                        }

                        var data = $dragDropService.getData();
                        if (!data.source)
                            data.source = $listCtrl.getDnDSource(e);

                        var eventObj = {
                            event: e,
                            sourceTree: data.sourceCtrl ? data.sourceCtrl.getTreeName() : '',
                            dragItem: data.source,
                            targetTree: $listCtrl.getTreeName(),
                            targetItem: data.target,
                            mousePos: $listCtrl.getMousePos(e)
                        }

                        $listCtrl.callDragEnter(eventObj);

                        e.stopPropagation();
                    });

                    contentElem.bind("dragleave", function (e) {
                        e.preventDefault();

                        $listCtrl.hoverItem = null;

                        var elem = angular.element(this);
                        var item = $listCtrl.getItemFromChildElem(elem);
                        if (item)
                            $listCtrl.refresh();//(item);

                        cancelDragTimer();

                        var data = $dragDropService.getData();
                        if (!data.source)
                            data.source = $listCtrl.getDnDSource(e);

                        var eventObj = {
                            event: e,
                            sourceTree: data.sourceCtrl ? data.sourceCtrl.getTreeName() : '',
                            dragItem: data.source,
                            targetTree: $listCtrl.getTreeName(),
                            targetItem: data.target,
                            mousePos: $listCtrl.getMousePos(e)
                        }

                        $listCtrl.callDragLeave(eventObj);

                        e.stopPropagation();
                    });

                    contentElem.bind("dragend", function (e) {
                        $listCtrl.dragDropStatus(false);
                    });

                    // Expand/Collapse ----------------------------------------------------------

                    contentElem.bind("dblclick", function (e) {
                        e.preventDefault();

                        if (e.which === 1) {
                            var item = $listCtrl.getItemFromChildElem(this);
                            if (item) {
                                var showEditor = $listCtrl.options.editorSettings.activate == 'dblclick';
                                if (showEditor)
                                    showEditBox(e, angular.element(this), 0);

                                var eventResult = $listCtrl.callItemDblClick(item, $listCtrl.getMousePos(e));
                                if (eventResult != false && !showEditor)
                                    $listCtrl.toggle(item);
                            }
                        }

                        e.stopPropagation();
                    });

                    // Hovering ----------------------------------------------------------

                    contentElem.bind("mouseenter", function (e) {
                        var item = $listCtrl.getItemFromChildElem(this);
                        if (item) {
                            var elem = angular.element(this);

                            $listCtrl.hoverItem = item;
                            $listCtrl.refresh();//(item);

                            $listCtrl.callItemHover(item);

                            if ($listCtrl.options.hoverSelection)
                                hoverTimer = $timeout(function () {
                                    if (hoverTimer)
                                        selectItem(e, item);
                                }, 500);
                        }
                    });

                    contentElem.bind("mouseleave", function (e) {
                        $listCtrl.hoverItem = null;

                        var item = $listCtrl.getItemFromChildElem(this);
                        if (item)
                            $listCtrl.refresh();//(item);

                        cancelHoverTimer();
                    });

                    // Keyboard Navigation -----------------------------------------------

                    var processDownArrowKey = function (e, item) {
                        e.preventDefault();

                        focusDelayTime = 0;
                        var nextIndex = $listCtrl.getItemCurrentIndex(item);
                        var lastIndex = currentIndex + itemCount - 2;
                        lastIndex = lastIndex < $listCtrl.currentList.length - 1 ? lastIndex : $listCtrl.currentList.length - 1;
                        if (nextIndex === lastIndex) {
                            $listCtrl.setScrollPos({
                                x: $listCtrl.scrollPos.x,
                                y: $listCtrl.scrollPos.y + Math.floor($elem[0].clientHeight / 4)
                            })
                            focusDelayTime = 1;
                        }

                        var nextItem = $listCtrl.getNextItem(nextIndex);
                        if (nextItem) {
                            $listCtrl.itemSelection(e, nextItem);
                            $scope.$apply();

                            var delayTimer = $timeout(function () {
                                $listCtrl.updateFocus(nextItem);
                                $timeout.cancel(delayTimer);
                            }, focusDelayTime);
                        }
                    }

                    var processUpArrowKey = function (e, item) {
                        e.preventDefault();

                        focusDelayTime = 0;
                        var prevIndex = $listCtrl.getItemCurrentIndex(item);
                        var firstIndex = currentIndex;
                        firstIndex = firstIndex > 0 ? firstIndex : 0;
                        if (prevIndex === firstIndex) {
                            $listCtrl.setScrollPos({
                                x: $listCtrl.scrollPos.x,
                                y: $listCtrl.scrollPos.y - Math.floor($elem[0].clientHeight / 4)
                            })
                            focusDelayTime = 1;
                        }

                        var prevItem = $listCtrl.getPrevItem($listCtrl.getItemCurrentIndex(item));
                        if (prevItem) {
                            $listCtrl.itemSelection(e, prevItem);
                            $scope.$apply();

                            var delayTimer = $timeout(function () {
                                $listCtrl.updateFocus(prevItem);
                                $timeout.cancel(delayTimer);
                            }, focusDelayTime);
                        }
                    }

                    contentElem.bind("keydown", function (e) {
                        var item = $listCtrl.getItemFromChildElem(this);
                        if (item) {
                            $listCtrl.callKeyDown(e, item);

                            var focusDelayTime = 0;

                            switch (e.keyCode) {
                                case 9: // TAB
                                    var listLength = $listCtrl.currentList.length;

                                    if (listLength > 0)
                                        if (e.shiftKey) {
                                            if (!$internalService.isEqual(item[$listCtrl.options.dataFields.id], $listCtrl.currentList[0][$listCtrl.options.dataFields.id]))
                                                processUpArrowKey(e, item);
                                        }
                                        else {
                                            if (!$internalService.isEqual(item[$listCtrl.options.dataFields.id], $listCtrl.currentList[listLength - 1][$listCtrl.options.dataFields.id]))
                                                processDownArrowKey(e, item);
                                        }
                                    break;

                                case 13: // ENTER
                                    showEditBox(e, contentElem, 0);
                                    break;

                                case 16: // SHIFT
                                    $listCtrl.updateSelectionStatus(e, 'shift');
                                    break;

                                case 17: // CTRL
                                    $listCtrl.updateSelectionStatus(e, 'ctrl');
                                    break;

                                case 33: // PAGE_UP
                                    e.preventDefault();

                                    var itemIndex = $listCtrl.getItemCurrentIndex(item);
                                    var newIndex = itemIndex - itemCount;
                                    newIndex = newIndex > 0 ? newIndex : 0;
                                    if (newIndex !== itemIndex) {
                                        //$listCtrl.setScrollPos({ x: $listCtrl.scrollPos.x, y: $listCtrl.scrollPos.y - $elem[0].clientHeight })
                                        focusDelayTime = 1;

                                        var newItem = $listCtrl.getPrevItem(newIndex + 1);
                                        if (newItem) {
                                            $listCtrl.scrollTo(newItem);
                                            $listCtrl.itemSelection(e, newItem);
                                            $scope.$apply();

                                            var delayTimer = $timeout(function () {
                                                $listCtrl.updateFocus(newItem);
                                                $timeout.cancel(delayTimer);
                                            }, focusDelayTime);
                                        }
                                    }
                                    break;

                                case 34: // PAGE_DOWN
                                    e.preventDefault();

                                    var itemIndex = $listCtrl.getItemCurrentIndex(item);
                                    var newIndex = itemIndex + itemCount;
                                    newIndex = newIndex < $listCtrl.currentList.length - 1 ? newIndex : $listCtrl.currentList.length - 1;
                                    if (newIndex !== itemIndex) {
                                        //$listCtrl.setScrollPos({ x: $listCtrl.scrollPos.x, y: $listCtrl.scrollPos.y + $elem[0].clientHeight })
                                        focusDelayTime = 1;

                                        var newItem = $listCtrl.getNextItem(newIndex - 1);
                                        if (newItem) {
                                            $listCtrl.scrollTo(newItem, "bottom");
                                            $listCtrl.itemSelection(e, newItem);
                                            $scope.$apply();

                                            var delayTimer = $timeout(function () {
                                                $listCtrl.updateFocus(newItem);
                                                $timeout.cancel(delayTimer);
                                            }, focusDelayTime);
                                        }
                                    }
                                    break;

                                case 35: // END
                                    e.preventDefault();

                                    $listCtrl.setScrollPos({x: $listCtrl.scrollPos.x, y: maxScrollPos.y})

                                    var lastItem = $listCtrl.getLastItem();
                                    if (lastItem) {
                                        $listCtrl.itemSelection(e, lastItem);
                                        var delayTimer = $timeout(function () {
                                            $listCtrl.updateFocus(lastItem);
                                            $timeout.cancel(delayTimer);
                                        }, 1);
                                    }
                                    break;

                                case 36: // HOME
                                    e.preventDefault();

                                    $listCtrl.setScrollPos({x: $listCtrl.scrollPos.x, y: 0})

                                    var firstItem = $listCtrl.getFirstItem();
                                    if (firstItem) {
                                        $listCtrl.itemSelection(e, firstItem);
                                        var delayTimer = $timeout(function () {
                                            $listCtrl.updateFocus(firstItem);
                                            $timeout.cancel(delayTimer);
                                        }, 1);
                                    }
                                    break;

                                case 37: // LEFT_ARROW
                                    e.preventDefault();

                                    if (item[$listCtrl.options.dataFields.items] && item[$listCtrl.options.dataFields.items].length > 0) {
                                        $listCtrl.toggle(item, false);
                                        $listCtrl.updateFocus(item);
                                    }
                                    break;

                                case 32: // SPACE_BAR
                                    e.preventDefault();

                                    $listCtrl.itemSelection(e, item, item.selected);
                                    $scope.$apply();
                                    break;

                                case 38: // UP_ARROW
                                    processUpArrowKey(e, item);
                                    break;

                                case 39: // RIGHT_ARROW
                                    e.preventDefault();

                                    if (item[$listCtrl.options.dataFields.items] && item[$listCtrl.options.dataFields.items].length > 0) {
                                        $listCtrl.toggle(item, true);
                                        $listCtrl.updateFocus(item);
                                    }
                                    break;

                                case 40: // DOWN_ARROW
                                    processDownArrowKey(e, item);
                                    break;

                                default:
                                    if (e.ctrlKey || e.metaKey)
                                        $listCtrl.updateSelectionStatus(e, 'ctrl');
                                    if (e.shiftKey)
                                        $listCtrl.updateSelectionStatus(e, 'shift');
                                    break;
                            }

                        }
                    });

                    contentElem.bind("keyup", function (e) {
                        switch (e.keyCode) {
                            case 16: // SHIFT
                                $listCtrl.multiSelection(false);
                                $listCtrl.shiftKeyStatus(false);
                                break;

                            case 17: // CTRL
                                $listCtrl.multiSelection(false);
                                break;

                            default:
                                if (!e.ctrlKey && !e.metaKey)
                                    $listCtrl.multiSelection(false);
                                if (!e.shiftKey) {
                                    $listCtrl.multiSelection(false);
                                    $listCtrl.shiftKeyStatus(false);
                                }
                                break;
                        }

                        var item = $listCtrl.getItemFromChildElem(this);
                        $listCtrl.callKeyUp(e, item);
                    });

                    contentElem.bind("keypress", function (e) {
                        var item = $listCtrl.getItemFromChildElem(this);
                        $listCtrl.callKeyPress(e, item);
                    });

                    contentElem.bind("click", function (e) {
                        if (e.which === 1) {
                            var item = $listCtrl.getItemFromChildElem(this);
                            if (item)
                                $listCtrl.callItemClick(e, item, $listCtrl.getMousePos(e));
                        }

                        e.stopPropagation();
                    });

                    contentElem.bind("mousedown", function (e) {
                        $listCtrl.mouseButtonStatus(true);

                        var item = $listCtrl.getItemFromChildElem(this);
                        if (item) {
                            selectItem(e, item);

                            switch (e.which) {
                                case 1:
                                    $listCtrl.changeCheckValue(item);

                                    var showEditor = $listCtrl.options.editorSettings.activate == 'click';
                                    if (showEditor)
                                        showEditBox(e, angular.element(this));
                                    break;

                                case 3:
                                    $listCtrl.callItemRightClick(item, $listCtrl.getMousePos(e));
                                    break;
                            }
                        }

                        e.stopPropagation();
                    });

                    contentElem.bind("mouseup", function (e) {
                        $listCtrl.mouseButtonStatus(false);

                        var item = $listCtrl.getItemFromChildElem(this);
                        if (item)
                            $listCtrl.updateSelection(e, item);

                        if (e.which === 1)
                            cancelEditTimer();
                    });

                    contentElem.bind("focus", function (e) {
                        var item = $listCtrl.getItemFromChildElem(this);
                        if (item)
                            $listCtrl.callGotFocus(e, item);
                    });

                    contentElem.bind("blur", function (e) {
                        var item = $listCtrl.getItemFromChildElem(this);
                        if (item)
                            $listCtrl.callLostFocus(e, item);
                    });
                }
            }

            var clearContentEvents = function (contentElem) {
                if (contentElem)
                    contentElem.unbind("blur click dragstart dragover drop dragenter dragleave dragend dblclick focus keydown keypress keyup mouseenter mouseleave mousedown mouseup");
            }

            // Editing ---------------------------------------------------------------

            $listCtrl.openEditor = function (item) {
                if (item) {
                    var itemElem = $listCtrl.getElemFromItem(item);
                    if (itemElem && item[$listCtrl.options.dataFields.allowEdit] != false) {
                        var childElem = $listCtrl.getElement(itemElem);
                        if (childElem)
                            showEditBox(null, childElem, 0);
                    }
                }
            }

            $listCtrl.closeEditor = function (item) {
                if (item) {
                    var itemElem = $listCtrl.getElemFromItem(item);
                    if (itemElem) {
                        var childElem = $listCtrl.getElement(itemElem);
                        if (childElem)
                            updateEditLayout(null, childElem, false);
                    }
                }
                else
                    updateEditLayout(null, null, false);
            }

            var showEditBox = function (e, elem, delay) {
                if ($listCtrl.options.labelEdit) {
                    if (delay === undefined)
                        delay = 500;

                    editTimer = $timeout(function () {
                        if (editTimer)
                            var showEditTimer = $timeout(function () {
                                updateEditLayout(e, elem, true);
                                $timeout.cancel(showEditTimer);
                            }, delay);

                        $timeout.cancel(editTimer);
                    }, delay / 3);
                }
            }

            var cancelEditTimer = function () {
                if (editTimer) {
                    $timeout.cancel(editTimer);
                    editTimer = null;
                }
            }

            var currentEditItem = null;

            var updateEditLayout = function (e, targetElem, editMode) {
                if ($listCtrl.dragDropStatus()) {
                    editValue = labelEditElem[0].value;

                    $listCtrl.labelEditStatus(false);
                    labelEditElem.unbind("blur focus keydown mousedown");
                    labelEditElem.remove();
                    currentEditItem = null;

                    return;
                }

                var item = $listCtrl.getItemFromChildElem(targetElem);
                if (item) {
                    if (editMode) {
                        var eventResult = $listCtrl.callBeforeLabelEdit(item);
                        var editValue = '';

                        if (eventResult != false) {
                            currentEditItem = item;

                            $listCtrl.labelEditStatus(true);

                            $elem.append(labelEditElem);

                            if (!item[$listCtrl.options.dataFields.text] || item[$listCtrl.options.dataFields.text] == '') {
                                var itemMargin = $internalService.getMargin(targetElem[0].parentElement);
                                var itemPadding = $internalService.getPadding(targetElem[0]);
                                targetElem.css("height", avgItemHeight - (itemMargin.top + itemMargin.bottom + 2) - (itemPadding.top + itemPadding.bottom) + "px");
                            }

                            var editBoxHeight = targetElem[0].offsetHeight - 4;//parseInt(getComputedStyle(targetElem[0]).height, 10) + 3;
                            var cssTopValue = targetElem[0].offsetTop;// + Math.floor((targetElem[0].offsetHeight - editBoxHeight) / 2);
                            var cssLeftValue = $listCtrl.scrollPos.x + targetElem[0].offsetLeft;
                            var editBoxWidth = $elem[0].clientWidth - targetElem[0].offsetLeft - 6;
                            if (isVerScrollVisible)
                                editBoxWidth -= 16;

                            $listCtrl.updateEditBox({
                                top: cssTopValue,
                                left: cssLeftValue,
                                width: editBoxWidth,
                                height: editBoxHeight
                            });

                            labelEditElem[0].value = item[$listCtrl.options.dataFields.text];

                            labelEditElem.bind("keydown", function (e) {
                                switch (e.keyCode) {
                                    case 13: // ENTER
                                        item[$listCtrl.options.dataFields.text] = labelEditElem[0].value ? labelEditElem[0].value : 'null';
                                        $scope.$apply();

                                        updateEditLayout(e, targetElem, false);
                                        $listCtrl.updateLayout();
                                        $listCtrl.updateFocus(item);
                                        break;

                                    case 27: // ESCAPE
                                        updateEditLayout(e, targetElem, false);
                                        break;
                                }

                                e.stopPropagation();
                            });

                            labelEditElem.bind("focus", function (e) {
                                var elem = angular.element(this);

                                $listCtrl.callGotFocus(e, currentEditItem, true, elem[0].value);
                            });

                            labelEditElem.bind("blur", function (e) {
                                updateEditLayout(e);
                            });

                            labelEditElem.bind("mousedown", function (e) {
                                e.stopPropagation();
                            });

                            var tempEditTimer = $timeout(function () {
                                labelEditElem[0].focus();
                                labelEditElem[0].select();

                                $timeout.cancel(tempEditTimer);
                            }, 10);
                        }
                    }
                    else {
                        editValue = labelEditElem[0].value;

                        $listCtrl.labelEditStatus(false);

                        labelEditElem.unbind("blur focus keydown mousedown");
                        labelEditElem.remove();

                        $listCtrl.updateView();
                        $listCtrl.updateFocus(item);
                        $listCtrl.callAfterLabelEdit(item);

                        $listCtrl.callLostFocus(e, item, true, editValue);
                        currentEditItem = null;
                    }
                }
                else {
                    editValue = labelEditElem[0].value;

                    $listCtrl.labelEditStatus(false);
                    labelEditElem.unbind("blur focus keydown mousedown");
                    labelEditElem.remove();
                    $listCtrl.callAfterLabelEdit();

                    $listCtrl.updateView();

                    $listCtrl.callLostFocus(e, currentEditItem, true, editValue);
                    currentEditItem = null;
                }
            }

            // General -------------------------------------------------------------------

            // Hovering -------------------------------------------------------------------

            var cancelHoverTimer = function () {
                if (hoverTimer) {
                    $timeout.cancel(hoverTimer);
                    hoverTimer = null;
                }
            }

            // Icons --------------------------------------------------------------------

            var getIconClass = function (item) {
                var classNames = '';

                if (item[$listCtrl.options.dataFields.icon])
                    classNames = item[$listCtrl.options.dataFields.icon];
                else if ($listCtrl.options.itemIcon)
                    classNames = $listCtrl.options.itemIcon;

                return classNames;
            }

            var getStatusIconClass = function (item) {
                var classNames = 'iui-treeview-status-icon ';
                classNames += item[$listCtrl.options.dataFields.statusIcon];

                return classNames;
            }

            var isIconPresent = function (item) {
                return item ? item[$listCtrl.options.dataFields.icon] || $listCtrl.options.itemIcon : false;
            }

            // Layout --------------------------------------------------------------------

            var currentIndex = 0;
            var itemScope = null;
            var visibleRange = 100;
            var avgItemHeight = 0;
            var blockElemHeight = 0;
            var panelElemHeight = 0;
            var lastElemSize = 0;
            var allItemWidth = 0;
            var allItemHeight = 0;
            var itemCount = 0;

            var blockSize = {
                width: 0,
                height: 0
            }

            var longItemWidth = 0;

            var horScrollStarted = false;
            var verScrollStarted = false;
            var thumbWidth = 9;
            var thumbHeight = 9;

            var horScrollSpace = 0;
            var horScrollValue = 0;
            var horThumbStartPos = 0;
            var horThumbEndPos = 0;
            var horThumbStep = 1;

            var verScrollSpace = 0;
            var verScrollValue = 0;
            var verThumbStartPos = 0;
            var verThumbEndPos = 0;
            var verThumbStep = 1;

            var horScrollLeftButton = null;
            var horScrollThumbButton = null;
            var horScrollRightButton = null;

            var verScrollUpButton = null;
            var verScrollThumbButton = null;
            var verScrollDownButton = null;

            var isHorScrollVisible = false;
            var isVerScrollVisible = false;

            this.scrollMousePos = null;
            var startScrollMousePos;
            var endScrollMousePos;
            var maxScrollPos = {x: 0, y: 0}
            var maxScrollThumbPos = {x: 0, y: 0}
            var verScrollValue = 0;

            var scrollToolTipElem = null;

            $listCtrl.updateViewSize = function () {
                var layoutTimer = $timeout(function () {
                    allItemWidth = 0;

                    isHorScrollVisible = false;
                    isVerScrollVisible = false;

                    if ($listCtrl.longestItem && $listCtrl.currentList.length > 0) {
                        var longestItemIndex = $listCtrl.getItemCurrentIndex($listCtrl.longestItem);
                        //var tempItemElem = angular.element(createItemElem(longestItemIndex, true));
                        //$elem.append(tempItemElem);
                        var tempItemElem = angular.element($compile(createItemElem(longestItemIndex, true))($scope));
                        $elem.append(tempItemElem);

                        allItemWidth = tempItemElem[0].offsetWidth;

                        var viewWidth = $elem[0].offsetWidth - 6;
                        if (isVerScrollVisible && verScrollElem)
                            viewWidth -= verScrollElem[0].offsetWidth;

                        if (allItemWidth > viewWidth) {
                            horScrollElem.unbind("click mousedown");
                            $elem.append(horScrollElem);

                            horScrollElem.bind("click", function (e) {
                                e.stopPropagation();
                            });

                            horScrollElem.bind("mousedown", function (e) {
                                var mousePos = $internalService.getClientMousePos(e, this);

                                var scrollStep = Math.floor($elem[0].clientWidth);

                                if (horScrollThumbButton) {
                                    if (mousePos.x < horScrollThumbButton[0].offsetLeft) {
                                        $listCtrl.setScrollPos({
                                            x: $listCtrl.scrollPos.x - scrollStep,
                                            y: $listCtrl.scrollPos.y
                                        });
                                    }
                                    else if (mousePos.x > horScrollThumbButton[0].offsetLeft + horScrollThumbButton[0].offsetWidth) {
                                        $listCtrl.setScrollPos({
                                            x: $listCtrl.scrollPos.x + scrollStep,
                                            y: $listCtrl.scrollPos.y
                                        });
                                    }
                                }
                            });

                            //horScrollLeftButton = angular.element(horScrollElem.children().eq(0));
                            horScrollThumbButton = angular.element(horScrollElem.children().eq(0));
                            //horScrollRightButton = angular.element(horScrollElem.children().eq(2));

                            isHorScrollVisible = true;

                            horScrollThumbButton.bind("mousedown", function (e) {
                                if (e.which === 1) {
                                    self.scrollMousePos = $listCtrl.getMousePos(e);
                                    startScrollMousePos = self.scrollMousePos;
                                    horScrollStarted = true;
                                }

                                e.stopPropagation();
                            });
                        }


                        var itemMargin = $internalService.getMargin(tempItemElem[0]);
                        avgItemHeight = tempItemElem[0].offsetHeight + (itemMargin.top + itemMargin.bottom);

                        var viewHeight = $elem[0].offsetHeight - 6;
                        if (isHorScrollVisible && horScrollElem)
                            viewHeight -= horScrollElem[0].offsetHeight;
                        visibleRange = Math.floor(viewHeight / avgItemHeight) + 1;

                        //if (autoHeight)
                        //visibleRange = $listCtrl.currentList.length + 1;

                        isVerScrollVisible = false;
                        if (visibleRange < $listCtrl.currentList.length + 1) {
                            verScrollElem.unbind("click mousedown");
                            $elem.append(verScrollElem);

                            verScrollElem.bind("click", function (e) {
                                e.stopPropagation();
                            });

                            verScrollElem.bind("mousedown", function (e) {
                                var mousePos = $internalService.getClientMousePos(e, this);

                                var scrollStep = Math.floor($elem[0].clientHeight);

                                if (verScrollThumbButton) {
                                    if (mousePos.y < verScrollThumbButton[0].offsetTop) {
                                        $listCtrl.setScrollPos({
                                            x: $listCtrl.scrollPos.x,
                                            y: $listCtrl.scrollPos.y - scrollStep
                                        });
                                        startScrollTimer(false, scrollStep);
                                    }
                                    else if (mousePos.y > verScrollThumbButton[0].offsetTop + verScrollThumbButton[0].offsetHeight) {
                                        $listCtrl.setScrollPos({
                                            x: $listCtrl.scrollPos.x,
                                            y: $listCtrl.scrollPos.y + scrollStep
                                        });
                                        startScrollTimer(true, scrollStep);
                                    }
                                }
                            });

                            //verScrollUpButton = angular.element(verScrollElem.children().eq(0));
                            verScrollThumbButton = angular.element(verScrollElem.children().eq(0));
                            //verScrollDownButton = angular.element(verScrollElem.children().eq(2));

                            isVerScrollVisible = true;

                            verScrollThumbButton.bind("mousedown", function (e) {
                                if (e.which === 1) {
                                    self.scrollMousePos = $listCtrl.getMousePos(e);
                                    verScrollStarted = true;
                                }

                                e.stopPropagation();
                            });
                        }

                        tempItemElem.remove();
                    }

                    if (!isHorScrollVisible) {
                        horScrollElem.unbind("mousedown");
                        horScrollElem.remove();
                    }

                    if (!isVerScrollVisible) {
                        verScrollElem.unbind("mousedown");
                        verScrollElem.remove();
                    }

                    if (isHorScrollVisible && isVerScrollVisible)
                        $elem.append(scrollCornerElem);
                    else
                        scrollCornerElem.remove();

                    $timeout.cancel(layoutTimer);

                    if (!isHorScrollVisible && $listCtrl.scrollPos.x > 0)
                        $listCtrl.setScrollPos({x: 0, y: $listCtrl.scrollPos.y});
                    if (!isVerScrollVisible && $listCtrl.scrollPos.y > 0)
                        $listCtrl.setScrollPos({x: $listCtrl.scrollPos.x, y: 0});
                }, 1);
            }

            var updateBlockSize = function () {
                var layoutTimer = $timeout(function () {
                    blockSize = {
                        width: $elem[0].offsetWidth - 6,
                        height: $elem[0].offsetHeight - 6
                    }

                    if (isHorScrollVisible)
                        blockSize.height -= horScrollElem[0].offsetHeight;
                    else
                        blockSize.height -= 4;

                    if (isVerScrollVisible)
                        blockSize.width -= verScrollElem[0].offsetWidth;
                    else
                        blockSize.width -= 4;

                    if (blockSize.width < allItemWidth)
                        blockElem.css("width", allItemWidth + "px");
                    else
                        blockElem.css("width", blockSize.width + "px");

                    blockElem.css("height", blockSize.height + "px");

                    if (isHorScrollVisible) {
                        horScrollElem.css("bottom", "0px");
                        if (!isVerScrollVisible)
                            blockSize.width += 3;
                        horScrollElem.css("width", blockSize.width + 1 + "px");
                    }

                    if (isVerScrollVisible) {
                        verScrollElem.css("top", "0px");
                        if (!isHorScrollVisible)
                            blockSize.height += 3;
                        verScrollElem.css("height", blockSize.height + 1 + "px");
                    }

                    if (isHorScrollVisible && isVerScrollVisible)
                        scrollCornerElem.css("bottom", "0px");

                    if ($listCtrl.options.rtl !== false) {
                        blockElem.css("left", "auto");
                        blockElem.css("right", "-" + ($listCtrl.scrollPos.x - 2).toString() + "px");

                        if (isHorScrollVisible) {
                            horScrollElem.css("left", "auto");
                            horScrollElem.css("right", "0px");
                        }

                        if (isVerScrollVisible) {
                            verScrollElem.css("left", "0px");
                            verScrollElem.css("right", "auto");
                        }

                        if (isHorScrollVisible && isVerScrollVisible) {
                            scrollCornerElem.css("left", "0px");
                            scrollCornerElem.css("right", "auto");
                        }
                    }
                    else {
                        blockElem.css("left", "-" + ($listCtrl.scrollPos.x - 2).toString() + "px");
                        blockElem.css("right", "auto");

                        if (isHorScrollVisible) {
                            horScrollElem.css("left", "0px");
                            horScrollElem.css("right", "auto");
                        }

                        if (isVerScrollVisible) {
                            verScrollElem.css("left", "auto");
                            verScrollElem.css("right", "0px");
                        }

                        if (isHorScrollVisible && isVerScrollVisible) {
                            scrollCornerElem.css("left", "auto");
                            scrollCornerElem.css("right", "0px");
                        }
                    }

                    var tempScrollTimer = $timeout(function () {
                        if (isHorScrollVisible && blockSize.width < allItemWidth) {
                            horScrollSpace = 0;
                            horThumbStartPos = 2;
                            horThumbEndPos = horScrollElem[0].clientWidth - 4;
                            if (horThumbEndPos > horThumbStartPos)
                                horScrollSpace = horThumbEndPos - horThumbStartPos;

                            thumbWidth = Math.floor(horScrollSpace * (blockSize.width - 4) / allItemWidth);
                            if (thumbWidth < 9)
                                thumbWidth = 9;
                            horScrollThumbButton.css("width", thumbWidth + "px");

                            maxScrollPos.x = allItemWidth - blockSize.width;
                            maxScrollThumbPos.x = horThumbEndPos - horScrollThumbButton[0].offsetWidth - horThumbStartPos;
                            if (maxScrollPos.x < 0)
                                maxScrollPos.x = 0;

                            horThumbStep = maxScrollPos.x / (horScrollSpace - thumbWidth - 2);
                        }

                        var numItems = $listCtrl.currentList.length + 1;

                        if (isVerScrollVisible && $listCtrl.currentList.length > 0 && visibleRange < numItems) {
                            verThumbStartPos = 2;
                            verThumbEndPos = verScrollElem[0].clientHeight - 4;
                            verScrollSpace = 0;

                            if (verThumbEndPos > verThumbStartPos)
                                verScrollSpace = verThumbEndPos - verThumbStartPos;
                            thumbHeight = Math.floor(verScrollSpace * visibleRange / numItems);
                            if (thumbHeight < 9)
                                thumbHeight = 9;
                            verScrollThumbButton.css("height", thumbHeight + "px");

                            verThumbStep = (numItems - visibleRange) / (verScrollSpace - thumbHeight - 2);
                            maxScrollPos.y = (numItems - visibleRange) * avgItemHeight;

                            maxScrollThumbPos.y = verThumbEndPos - verScrollThumbButton[0].offsetHeight - verThumbStartPos;
                            if (maxScrollPos.y < 0)
                                maxScrollPos.y = 0;

                            if (currentIndex == 0)
                                verScrollThumbButton.css("top", verThumbStartPos + "px");
                            else if (currentIndex + visibleRange - 1 == $listCtrl.currentList.length)
                                verScrollThumbButton.css("top", verThumbEndPos - verScrollThumbButton[0].offsetHeight + "px");
                        }

                        $timeout.cancel(tempScrollTimer);
                    }, 1);

                    $timeout.cancel(layoutTimer);
                }, 5);
            }

            var autoWidth = false;
            var autoHeight = false;

            var loadBlockSize = {width: 0, height: 0}
            var loadBlockPos = {top: 0, left: 0}

            var beginLoadActive = false;
            var endLoadActive = false;
            var loadAnimation = {type: 'none', speed: 'normal', opacity: 0};
            var loadCircularInterval = null;
            var showLoading = false;
            var isLoadCompleted = false;

            var tempBlockElem = angular.element('<ul class="iui-treeview-block" style="position:absolute;top:-9999999px"></ul>');

            $listCtrl.updateActive = false;
            $listCtrl.updateStatus = 0;

            var updateLoadWindow = function (increase) {
                var loadInterval = $interval(function () {
                    if (increase)
                        loadBlockSize.height++;
                    else
                        loadBlockSize.height--;

                    loadBlockPos.top = ($elem[0].clientHeight - loadBlockSize.height) / 2 + 2;

                    loadBlockProgress.css("height", loadBlockSize.height + "px");
                    loadBlock.css("top", loadBlockPos.top + "px");

                    if (increase && loadBlockSize.height >= 5) {
                        showLoading = true;
                        updateLoading(0);
                        beginLoadActive = false;
                        isLoadCompleted = false;
                        $interval.cancel(loadInterval);
                    }
                    else if (!increase && loadBlockSize.height <= 0) {
                        if (loadBlock)
                            loadBlock.remove();

                        loadProgress = 0;
                        isLoadCompleted = true;
                        $listCtrl.callLoadComplete();
                        $interval.cancel(loadInterval);
                    }
                }, 20);
            }

            var endCircularAnimation = function () {
                if (loadCircularInterval)
                    $interval.cancel(loadCircularInterval);

                if (loadCircularElem)
                    loadCircularElem.remove();
            }

            $listCtrl.beginLoad = function (animation) {
                if (beginLoadActive)
                    return;

                beginLoadActive = true;
                if (animation) {
                    loadAnimation = {
                        type: animation.type != undefined ? animation.type : 'none',
                        speed: animation.speed != undefined ? animation.speed : 'normal',
                        opacity: animation.opacity != undefined ? animation.opacity : 0
                    }
                }
                else
                    loadAnimation = {type: 'none', speed: 'normal', opacity: 0};

                updateElemOpacity(loadAnimation.opacity);

                switch (loadAnimation.type) {
                    case 'circular':
                        endCircularAnimation();

                        $elem.append(loadCircularElem);
                        loadCircularElem.css("top", ($elem[0].clientHeight - loadCircularElem[0].offsetHeight) / 2 + "px");
                        loadCircularElem.css("left", ($elem[0].clientWidth - loadCircularElem[0].offsetWidth) / 2 + "px");

                        showLoading = true;
                        beginLoadActive = false;
                        isLoadCompleted = false;

                        var angle = 0;
                        var speedFactor = 3;
                        switch (loadAnimation.speed) {
                            case 'veryfast':
                                speedFactor = 7;
                                break;
                            case 'fast':
                                speedFactor = 5;
                                break;
                            case 'slow':
                                speedFactor = 2;
                                break;
                            case 'veryslow':
                                speedFactor = 1;
                                break;
                        }

                        loadCircularInterval = $interval(function () {
                            angle += speedFactor;
                            if (angle > 360)
                                angle = 0;

                            var transformValue = 'rotate(' + angle + 'deg)';
                            loadCircularElem.css('-ms-transform', transformValue);
                            loadCircularElem.css('-webkit-transform', transformValue);
                            loadCircularElem.css('transform', transformValue);
                        }, 1);
                        break;

                    case 'linear':
                        loadBlockProgress.css("width", "0px");
                        loadBlockProgress.css("height", "0px");

                        $elem.append(loadBlock);

                        loadProgress = 0;

                        loadBlockSize = {width: Math.floor($elem[0].clientWidth * 0.50), height: 0}
                        loadBlockPos = {
                            top: $elem[0].clientHeight / 2 + 2,
                            left: ($elem[0].clientWidth - loadBlockSize.width) / 2
                        }

                        loadBlock.css("width", loadBlockSize.width + "px");
                        loadBlock.css("top", loadBlockPos.top + "px");
                        loadBlock.css("left", loadBlockPos.left + "px");
                        loadBlock.css("opacity", "1");

                        updateLoadWindow(true);
                        break;

                    default:
                        showLoading = true;
                        beginLoadActive = false;
                        isLoadCompleted = false;
                        break;
                }
            }

            $listCtrl.endLoad = function (item) {
                if (endLoadActive)
                    return;

                endLoadActive = true;

                var itemIndex = $listCtrl.options.loadItems.indexOf(item);
                if (itemIndex >= 0)
                    $listCtrl.options.loadItems.splice(itemIndex, 1);

                if (showLoading) {
                    showLoading = false;

                    var loadInterval = 3;
                    var elemOpacity = loadAnimation.opacity;
                    var loadTimer = $interval(function () {
                        if (isLoadCompleted) {
                            if (loadInterval > 10 || elemOpacity >= 1) {
                                updateElemOpacity(1);

                                isLoadCompleted = false;
                                beginLoadActive = false;
                                endLoadActive = false;
                                loadAnimation = {type: 'none', speed: 'normal'};

                                $interval.cancel(loadTimer);
                            }
                            else {
                                elemOpacity += (loadInterval / 10);
                                updateElemOpacity(elemOpacity);

                                loadInterval += 3;
                            }
                        }
                    }, 1);
                }
                else
                    endLoadActive = false;
            }

            var updateElemOpacity = function (value) {
                if (blockElem)
                    blockElem.css("opacity", value);

                if (horScrollElem)
                    horScrollElem.css("opacity", value);
                if (verScrollElem)
                    verScrollElem.css("opacity", value);
                if (scrollCornerElem)
                    scrollCornerElem.css("opacity", value);
            }

            var loadBlockProgress = angular.element('<div style="background:#0080c0;width:0px;height:5px;"></div>');
            var loadBlock = angular.element('<div style="background:#e5e5e5;position:absolute;top:10px;left:10px;z-index:999"></div>');
            loadBlock.append(loadBlockProgress);

            var loadProgress = 0;
            var isLoadingUpdated = false;

            var loadCircularElem = angular.element('<div class="iui-load-circular"></div>');

            var updateLoading = function (value) {
                if (showLoading && loadAnimation.type == 'linear') {
                    isLoadingUpdated = false;

                    var nextStep = Math.floor(loadBlockSize.width * value / 100);
                    var progressStep = loadProgress;

                    var speedFactor = 10;
                    switch (loadAnimation.speed) {
                        case 'veryfast':
                            speedFactor = 2;
                            break;
                        case 'fast':
                            speedFactor = 5;
                            break;
                        case 'slow':
                            speedFactor = 15;
                            break;
                        case 'veryslow':
                            speedFactor = 20;
                            break;
                    }

                    var stepValue = nextStep > progressStep ? Math.floor((nextStep - progressStep) / speedFactor) : 1;
                    stepValue = stepValue > 0 ? stepValue : 1;

                    var updateInterval = $interval(function () {
                        progressStep += stepValue;
                        loadBlockProgress.css("width", progressStep + "px");

                        if (progressStep >= nextStep) {
                            loadProgress = nextStep;
                            isLoadingUpdated = true;
                            $interval.cancel(updateInterval);
                        }
                    }, 1);
                }
                else
                    isLoadingUpdated = true;
            }

            var startLayout = function () {
                $listCtrl.updateCurrentList();

                updateCheckBoxWidth();

                updateLoading(10);

                createLayout('init');
            }

            var initLayout = function () {
                if (tempBlockElem)
                    tempBlockElem.remove();

                if (!horScrollStarted && !verScrollStarted)
                    updateBlockSize();

                // Clear all active element events
                clearEvents();

                //blockElem.empty();

                if (itemScope)
                    itemScope.$destroy();

                updateCurrentIndex(false);

                if ($listCtrl.currentList.length >= visibleRange && currentIndex + visibleRange - 1 > $listCtrl.currentList.length)
                    currentIndex = $listCtrl.currentList.length - visibleRange + 1;

                updateLoading(20);

                createLayout('items');
            }

            var sumItemHeight = 0;

            var updateItemLayout = function () {
                $elem.append(tempBlockElem);

                var itemTimer = $timeout(function () {
                    if (currentIndex < $listCtrl.currentList.length) {
                        itemScope = $scope.$new();
                        itemScope.data = $listCtrl.currentList;
                        itemScope.checkBoxStyle = $listCtrl.options.checkBoxSettings.style;
                        if (!itemScope.checkBoxStyle && $listCtrl.options.controlStyle.item.checkBox)
                            itemScope.checkBoxStyle = $listCtrl.options.controlStyle.item.checkBox;

                        var blockContent = '';

                        itemCount = 0;

                        var itemContent = '';
                        var itemElem = null;
                        firstItemElem = null;

                        var itemMargin = $internalService.getMargin();
                        sumItemHeight = 0;

                        for (var i = currentIndex; i < currentIndex + visibleRange && i < $listCtrl.currentList.length; i++) {
                            itemContent = createItemElem(i);

                            if ($listCtrl.currentList[i].content)
                                itemElem = $compile(itemContent)($scope.$parent);
                            else
                                itemElem = $compile(itemContent)(itemScope);

                            itemElem = angular.element(itemElem);
                            //blockElem.append(itemElem);
                            tempBlockElem.append(itemElem);

                            itemMargin = $internalService.getMargin(itemElem[0]);
                            sumItemHeight += itemElem[0].offsetHeight + (itemMargin.top + itemMargin.bottom);

                            blockContent += itemContent;

                            itemCount++;
                        }
                    }

                    updateLoading(70);
                    createLayout('scroll');

                    $timeout.cancel(itemTimer);
                }, 1);
            }

            var updateScrollLayout = function () {
                if (itemCount > 0) {
                    //tempBlockElem.append($compile(blockContent)(itemScope));

                    // Update ScrollBar Size
                    blockElemHeight = tempBlockElem[0].offsetHeight;
                    var viewHeight = $elem[0].offsetHeight - 6;
                    if (isHorScrollVisible && horScrollElem)
                        viewHeight -= horScrollElem[0].offsetHeight;
                    avgItemHeight = sumItemHeight / itemCount;
                    visibleRange = Math.floor(viewHeight / avgItemHeight) + 1;
                    updateBlockSize();
                }

                scrollCurrentView();

                var viewTimer = $timeout(function () {
                    $listCtrl.updateViewSize();
                    $listCtrl.updateViewSize();
                    updateBlockSize();

                    updateLoading(80, 'complete');

                    createLayout('complete');

                    $timeout.cancel(viewTimer);
                }, 1);
            }

            var updateCompleteLayout = function () {
                updateLoading(90);
                createLayout('events');
            }

            var updateEvents = function () {
                if (tempBlockElem) {
                    blockElem.empty();
                    blockElem.append(tempBlockElem.children());
                }

                // Update the appearance of elements in current view
                $listCtrl.refresh();

                $listCtrl.allowEvents = true;

                // Bind Item events
                if ($listCtrl.currentList.length > 0)
                    bindEvents();

                updateLoading(100);
                createLayout('end');
            }

            var updateEndLayout = function () {
                if (tempBlockElem)
                    tempBlockElem.remove();

                $listCtrl.callUpdateComplete();

                switch (loadAnimation.type) {
                    case 'circular':
                        endCircularAnimation();

                        loadProgress = 0;
                        isLoadCompleted = true;
                        $listCtrl.callLoadComplete();
                        break;

                    case 'linear':
                        updateLoadWindow(false);
                        break;

                    default:
                        loadProgress = 0;
                        isLoadCompleted = true;
                        $listCtrl.callLoadComplete();
                        break;
                }

                $listCtrl.updateActive = false;

                $listCtrl.updateStatus--;
                if ($listCtrl.updateStatus > 0) {
                    $listCtrl.updateActive = true;

                    isLoadingUpdated = true;
                    createLayout("start");
                }
            }

            var createLayout = function (type) {
                if (isLoadingUpdated && !beginLoadActive) {
                    switch (type) {
                        case 'start':
                            startLayout();
                            break;

                        case 'init':
                            initLayout();
                            break;

                        case 'items':
                            updateItemLayout();
                            break;

                        case 'scroll':
                            updateScrollLayout();
                            break;

                        case 'complete':
                            updateCompleteLayout();
                            break;

                        case 'events':
                            updateEvents();
                            break;

                        case 'end':
                            updateEndLayout();
                            break;
                    }
                }
                else
                    $timeout(function () {
                        createLayout(type)
                    }, 1);
            }

            $listCtrl.updateCurrentLayout = function () {
                $listCtrl.updateLayout();
            }

            $listCtrl.updateLayout_BACK = function (flag) {
                if ($listCtrl.allowUpdate) {
                    updateBlockStyle();

                    $listCtrl.allowEvents = false;

                    allItemWidth = 0;
                    allItemHeight = 0;
                    avgItemHeight = 0;
                    visibleRange = 100;

                    //autoWidth = false;
                    //if ($elem[0].offsetWidth <= 8)
                    //autoWidth = true;

                    //autoHeight = false;
                    //if ($elem[0].offsetHeight <= 8)
                    //autoHeight = true;

                    //if (autoWidth && autoHeight)
                    //$elem.css("overflow", "visible");

                    visibleRange = Math.floor($elem[0].clientHeight / 20);

                    $listCtrl.updateCurrentList();

                    updateCheckBoxWidth();

                    $listCtrl.updateView(flag);
                    $listCtrl.updateView(flag);

                    var viewTimer = $timeout(function () {
                        $listCtrl.allowEvents = true;

                        $listCtrl.updateViewSize();
                        $listCtrl.updateViewSize();
                        updateBlockSize();
                    }, 1);
                }
            }

            $listCtrl.updateLayout = function (flag) {
                if ($listCtrl.allowUpdate) {
                    $listCtrl.updateStatus++;

                    if (!$listCtrl.updateActive) {
                        $listCtrl.updateActive = true;

                        updateBlockStyle();

                        $listCtrl.allowEvents = false;

                        allItemWidth = 0;
                        allItemHeight = 0;
                        avgItemHeight = 0;
                        visibleRange = 100;

                        visibleRange = Math.floor($elem[0].clientHeight / 20);

                        isLoadingUpdated = true;
                        createLayout('start');
                    }
                }
            }

            $scope.$watch(function () {
                return $elem[0].offsetWidth;
            }, function (newValue, oldValue) {
                if (visibleRange == 100 || newValue != oldValue)
                    $listCtrl.updateLayout();
            });

            $scope.$watch(function () {
                return $elem[0].offsetHeight;
            }, function (newValue, oldValue) {
                if (newValue != oldValue)
                    $listCtrl.updateLayout();
            });

            var setDefaultCheckValue = function (i, threeState) {
                var item = $listCtrl.currentList[i];

                if (threeState && item[$listCtrl.options.dataFields.checkState] == undefined)
                    item[$listCtrl.options.dataFields.checkState] = 'unchecked';
                else if (item[$listCtrl.options.dataFields.checked] == undefined)
                    item[$listCtrl.options.dataFields.checked] = false;
            }

            $scope.onCheckValueChanging = function (e, i) {
                var checkValue = $listCtrl.options.checkBoxSettings && $listCtrl.options.checkBoxSettings.threeState == true ? e.checkState : e.checked;
                return $listCtrl.callCheckValueChanging($listCtrl.currentList[i], checkValue);
            }


            $scope.onCheckValueChanged = function (e, i) {
                var checkValue = $listCtrl.options.checkBoxSettings && $listCtrl.options.checkBoxSettings.threeState == true ? e.checkState : e.checked;
                $listCtrl.callCheckValueChanged($listCtrl.currentList[i], checkValue);

                $listCtrl.fillCheckList($listCtrl.currentList[i]);
            }

            var createItemElem = function (i, flag) {
                var currentItem = $listCtrl.currentList[i];
                var defaultItemClass = $listCtrl.defaultStyle.item.general.normal;

                if ($listCtrl.options.controlStyle.item.general.normal != defaultItemClass)
                    itemElem += ' ' + $listCtrl.options.controlStyle.item.general.normal;

                var currentItemClass = $listCtrl.getCurrentItemStyle(currentItem, $listCtrl.getObjState(currentItem));

                var itemElem = '<li class="' + defaultItemClass;
                if (currentItemClass != defaultItemClass)
                    itemElem += ' ' + currentItemClass;
                itemElem += '" ';

                if (flag)
                    itemElem += 'style="position:absolute;top:-9999px;padding-left:' + $listCtrl.indentList[i] + 'px"';
                else
                    itemElem += 'data-index="' + i + '"';
                if (!flag && $listCtrl.indentList[i] > 0) {
                    if ($listCtrl.options.rtl)
                        itemElem += ' style="padding-right:' + $listCtrl.indentList[i] + 'px"';
                    else
                        itemElem += ' style="padding-left:' + $listCtrl.indentList[i] + 'px"';
                }
                itemElem += '>';

                // Status Icon
                if ($listCtrl.options.showStatusIcons !== false)
                    itemElem += '<span class="' + getStatusIconClass($listCtrl.currentList[i]) + '" data-element="statusicon"></span>';

                // Expand Box
                itemElem += '<span class="' + getExpandBoxClass($listCtrl.currentList[i]) + '" data-element="expandbox"></span>';

                // Check Box
                if ($listCtrl.options.showCheckBoxes == true) {
                    itemElem += '<iui-checkbox name="cb-' + $internalService.getUniqueId(4) + '"';

                    var isThreeStateAllowed = $listCtrl.options.checkBoxSettings ? $listCtrl.options.checkBoxSettings.threeState == true : false;

                    setDefaultCheckValue(i, isThreeStateAllowed);

                    if (isThreeStateAllowed) {
                        itemElem += ' check-state="data[' + i + '].' + $listCtrl.options.dataFields.checkState + '"';
                        itemElem += ' checkstate-changing="onCheckValueChanging(e, ' + i + ')"';
                        itemElem += ' checkstate-changed="onCheckValueChanged(e, ' + i + ')"';
                        itemElem += ' three-state="true"';
                    }
                    else {
                        itemElem += ' checked="data[' + i + '].' + $listCtrl.options.dataFields.checked + '"';
                        itemElem += ' checked-changing="onCheckValueChanging(e, ' + i + ')"';
                        itemElem += ' checked-changed="onCheckValueChanged(e, ' + i + ')"';
                    }

                    if (itemScope) {
                        if ($listCtrl.options.checkBoxSettings && $listCtrl.options.checkBoxSettings.style && itemScope.checkBoxStyle)
                            itemElem += ' control-style="checkBoxStyle"';
                        else if ($listCtrl.options.controlStyle.item.checkBox && itemScope.checkBoxStyle)
                            itemElem += ' control-style="checkBoxStyle"';
                    }

                    if (!$listCtrl.isItemEnabled($listCtrl.currentList[i]))
                        itemElem += ' enabled="false"';

                    itemElem += ' style="display:inline-block;margin:0 2px;padding-bottom:2px;vertical-align:middle;';

                    if (checkBoxWidth > 0)
                        itemElem += 'width: ' + checkBoxWidth + 'px;';
                    itemElem += '"></iui-checkbox>';
                }

                // Icon
                if ($listCtrl.options.showIcons !== false && isIconPresent($listCtrl.currentList[i]))
                    itemElem += '<span class="' + getIconClass($listCtrl.currentList[i]) + '" data-element="icon"></span>';

                var defaultContentClass = $listCtrl.defaultStyle.item.content.normal;

                if ($listCtrl.options.controlStyle.item.content.normal != defaultContentClass)
                    defaultContentClass += ' ' + $listCtrl.options.controlStyle.item.content.normal;

                var currentContentClass = $listCtrl.getCurrentItemContentStyle($listCtrl.currentList[i], 'normal');

                if ($listCtrl.currentList[i].content) {
                    itemElem += '<div class="' + defaultContentClass + ' ' + currentContentClass + '" data-element="content">';
                    itemElem += $listCtrl.currentList[i][$listCtrl.options.dataFields.content];
                    itemElem += '</div>';
                }
                else {
                    itemElem += '<span class="' + defaultContentClass + ' ' + currentContentClass + '" data-element="content"';
                    if (!flag && $listCtrl.currentList[i].contextMenu)
                        itemElem += ' iui-contextmenu menu-items="data[' + i + '].contextMenu"';
                    itemElem += '>';
                    if (flag)
                        itemElem += $listCtrl.currentList[i][$listCtrl.options.dataFields.text];
                    else
                        itemElem += '{{data[' + i + '].' + $listCtrl.options.dataFields.text + '}}';
                    itemElem += '</span>';
                }

                itemElem += '</li>';

                return itemElem;
            }

            var checkBoxWidth = 0;
            var updateCheckBoxWidth = function () {
                if ($listCtrl.options.showCheckBoxes == true) {
                    var checkContent = '<iui-checkbox style="position:absolute;top:-9999px"></iui-checkbox>';

                    var tempCheckElem = angular.element($compile(checkContent)($scope));
                    $elem.append(tempCheckElem);

                    checkBoxWidth = 0;
                    if (tempCheckElem) {
                        if (tempCheckElem.children().length > 0)
                            checkBoxWidth = parseInt(getComputedStyle(angular.element(tempCheckElem.children().eq(0))[0]).width, 10);
                    }

                    tempCheckElem.remove();
                }
            }

            $listCtrl.updateViewActive = false;

            $listCtrl.updateView = function (flag) {
                if (!$listCtrl.updateViewActive) {
                    $listCtrl.updateViewActive = true;

                    var timer = $timeout(function () {
                        if (!horScrollStarted && !verScrollStarted)
                            updateBlockSize();

                        // Clear all active element events
                        clearEvents();

                        blockElem.empty();

                        if (itemScope)
                            itemScope.$destroy();

                        updateCurrentIndex(false);

                        if ($listCtrl.currentList.length >= visibleRange && currentIndex + visibleRange - 1 > $listCtrl.currentList.length)
                            currentIndex = $listCtrl.currentList.length - visibleRange + 1;

                        if (currentIndex < $listCtrl.currentList.length) {
                            itemScope = $scope.$new();
                            itemScope.data = $listCtrl.currentList;
                            itemScope.checkBoxStyle = $listCtrl.options.checkBoxSettings.style;
                            if (!itemScope.checkBoxStyle && $listCtrl.options.controlStyle.item.checkBox)
                                itemScope.checkBoxStyle = $listCtrl.options.controlStyle.item.checkBox;

                            var blockContent = '';

                            itemCount = 0;

                            var itemContent = '';
                            var itemElem = null;
                            firstItemElem = null;

                            var itemMargin = $internalService.getMargin();
                            var sumItemHeight = 0;

                            for (var i = currentIndex; i < currentIndex + visibleRange && i < $listCtrl.currentList.length; i++) {
                                itemContent = createItemElem(i);

                                if ($listCtrl.currentList[i].content)
                                    itemElem = $compile(itemContent)($scope.$parent);
                                else
                                    itemElem = $compile(itemContent)(itemScope);

                                itemElem = angular.element(itemElem);
                                blockElem.append(itemElem);

                                itemMargin = $internalService.getMargin(itemElem[0]);
                                sumItemHeight += itemElem[0].offsetHeight + (itemMargin.top + itemMargin.bottom);

                                blockContent += itemContent;

                                itemCount++;
                            }

                            if (itemCount > 0) {
                                //blockElem.append($compile(blockContent)(itemScope));

                                // Bind element events
                                bindEvents();

                                // Update ScrollBar Size
                                blockElemHeight = blockElem[0].offsetHeight;
                                var viewHeight = $elem[0].offsetHeight - 6;
                                if (isHorScrollVisible && horScrollElem)
                                    viewHeight -= horScrollElem[0].offsetHeight;
                                avgItemHeight = sumItemHeight / itemCount;
                                visibleRange = Math.floor(viewHeight / avgItemHeight) + 1;
                                updateBlockSize();
                            }

                            scrollCurrentView();

                            // Update the appearance of elements in current view
                            $listCtrl.refresh();
                        }

                        $listCtrl.updateViewActive = false;

                        $timeout.cancel(timer);
                    }, 1);
                }
            }

            $listCtrl.refresh = function (item, parent) {
                if (item) {
                    var objElem = null;

                    switch (item.type) {
                        case 'item':
                            objElem = $listCtrl.getElemFromItem(item);
                            if (objElem) {
                                objElem.removeAttr("class");
                                objElem.addClass($listCtrl.defaultStyle.item.general.normal);
                                objElem.addClass($listCtrl.options.controlStyle.item.general.normal);

                                var currentItemClass = $listCtrl.getCurrentItemStyle(item, $listCtrl.getObjState(item));
                                if (currentItemClass != $listCtrl.options.controlStyle.item.general.normal)
                                    objElem.addClass(currentItemClass);

                                var contentElem = $listCtrl.getElement(objElem);
                                if (contentElem) {
                                    contentElem.removeAttr("class");
                                    contentElem.addClass($listCtrl.defaultStyle.item.content.normal);
                                    contentElem.addClass($listCtrl.options.controlStyle.item.content.normal);

                                    var currentItemClass = $listCtrl.getCurrentItemContentStyle(item, $listCtrl.getObjState(item));
                                    if (currentItemClass != $listCtrl.options.controlStyle.item.content.normal)
                                        contentElem.addClass(currentItemClass);
                                }
                            }
                            break;
                    }
                }
                else {
                    for (var i = currentIndex; i < currentIndex + visibleRange && i < $listCtrl.currentList.length; i++)
                        $listCtrl.refresh($listCtrl.currentList[i]);
                }
            }

            // Reorder --------------------------------------------------------------

            $listCtrl.moveItem = function (item, targetItem, direction, position) {
                if (item) {
                    $listCtrl.allowUpdate = false;

                    var newItemIndex = -1;
                    switch (direction) {
                        case 'first':
                            newItemIndex = 0;
                            break;

                        case 'at':
                            newItemIndex = position;
                            break;
                    }

                    if (Array.isArray(item)) {
                        var moveList = [];

                        // To avoid duplicate items, only move items which parents are not included
                        for (var i = 0; i < item.length; i++) {
                            var found = false;
                            var parentItem = $listCtrl.getParent(item[i]);
                            while (parentItem) {
                                if (item.indexOf(parentItem) >= 0) {
                                    found = true;
                                    break;
                                }

                                parentItem = $listCtrl.getParent(parentItem);
                            }

                            if (!found)
                                moveList.push(item[i]);
                        }

                        if (moveList.length > 0) {
                            var firstIndex = $listCtrl.getObjCurrentIndex(moveList[0]);
                            var lastIndex = $listCtrl.getObjCurrentIndex(moveList[moveList.length - 1]);

                            if (firstIndex <= lastIndex)
                                for (var i = 0; i < moveList.length; i++)
                                    moveItemAt(moveList[i], targetItem, newItemIndex, direction);
                            else
                                for (var i = moveList.length - 1; i >= 0; i--)
                                    moveItemAt(moveList[i], targetItem, newItemIndex, direction);
                        }
                    }
                    else
                        moveItemAt(item, targetItem, newItemIndex, direction);

                    $listCtrl.allowUpdate = true;
                    $listCtrl.updateCurrentLayout();
                    $listCtrl.callChange();
                }
            }

            var moveItemAt = function (item, targetItem, position, direction) {
                var isObjRemoved = $listCtrl.dataObj.removeAt(item, -1, null, $listCtrl.objIsRemoved);
                if (isObjRemoved) {
                    // Add item at specified position
                    if (direction == 'first' || direction == 'last' || direction == 'at')
                        $listCtrl.dataObj.insertAt(item, position, targetItem, $listCtrl.itemIsAdded);
                    // Insert item before target item 
                    else if (direction == 'before')
                        $listCtrl.dataObj.insertByRef(item, targetItem, false, $listCtrl.itemIsAdded);
                    // Insert item after target item 
                    else if (direction == 'after')
                        $listCtrl.dataObj.insertByRef(item, targetItem, true, $listCtrl.itemIsAdded);
                }
            }

            // Scrolling -------------------------------------------------------------

            var isScrollTimerActive = false;
            var scrollCount = 0;
            var scrollTimerID = null;
            var accelerator = 0.5;

            $listCtrl.isScrollBarVisible = function (type) {
                switch (type) {
                    case "horizontal":
                        return isHorScrollVisible;

                    case "vertical":
                        return isVerScrollVisible;
                }

                return isHorScrollVisible && isVerScrollVisible;
            }

            $listCtrl.prevScrollPos = {x: 0, y: 0}
            $listCtrl.scrollPos = {x: 0, y: 0}

            $listCtrl.getScrollPos = function () {
                return $listCtrl.scrollPos;
            }

            $listCtrl.setScrollPos = function (pos) {
                if (pos) {
                    var fireEvent = true;

                    if (pos.x < 0) {
                        pos.x = 0;
                        fireEvent = false;
                    }
                    if (pos.x > maxScrollPos.x) {
                        pos.x = maxScrollPos.x;
                        fireEvent = false;
                    }

                    if (pos.y < 0) {
                        pos.y = 0;
                        fireEvent = false;
                    }
                    if (pos.y > maxScrollPos.y) {
                        pos.y = maxScrollPos.y;
                        fireEvent = false;
                    }

                    $listCtrl.scrollPos = pos;

                    verScrollValue = Math.floor($listCtrl.scrollPos.y / (avgItemHeight * verThumbStep));

                    var newThumbPos = {
                        x: 0,
                        y: verThumbStartPos + verScrollValue
                    }

                    if (isHorScrollVisible && horScrollThumbButton) {
                        if ($listCtrl.options.rtl !== false)
                            newThumbPos.x = Math.floor($listCtrl.scrollPos.x / horThumbStep) - (horThumbEndPos - horScrollThumbButton[0].offsetWidth - horThumbStartPos);
                        else
                            newThumbPos.x = Math.floor($listCtrl.scrollPos.x / horThumbStep) + horThumbStartPos;

                        horScrollThumbButton.css("left", newThumbPos.x + "px");
                    }

                    if (isVerScrollVisible && verScrollThumbButton)
                        verScrollThumbButton.css("top", newThumbPos.y + "px");

                    scrollCurrentView();
                    updateCurrentIndex();

                    if (fireEvent)
                        $listCtrl.callScrollPosChanged();
                }
            }

            var isScrollPosInRange = function (pos) {
                return (pos.x > 0 && pos.x < maxScrollPos.x) || (pos.y > 0 && pos.y < maxScrollPos.y);
            }

            var processScroll = function (e) {
                if ($listCtrl.isScrollBarVisible('vertical')) {
                    var mousePos = $listCtrl.getMousePos(e);
                    var boundRect = $elem[0].getBoundingClientRect();

                    mousePos.x -= angular.element($window)[0].pageXOffset;
                    mousePos.y -= angular.element($window)[0].pageYOffset;

                    if (mousePos.y < boundRect.top + 25)
                        startScrollTimer(false);
                    else if (mousePos.y > boundRect.bottom - 25)
                        startScrollTimer(true);
                    else
                        stopScrollTimer();
                }
                else
                    stopScrollTimer();
            }

            var scrollTimerElapsed = function (flag, scrollStep) {
                var pos = $listCtrl.getScrollPos();
                var oldPos = pos;

                if (!scrollStep) {
                    if (scrollCount === 0)
                        scrollCount = 5;
                    scrollCount += 5 + verThumbStep;//10;

                    accelerator += 0.5;//Math.floor(scrollCount / 100) * 33;
                    scrollCount += Math.floor(accelerator);
                    scrollStep = scrollCount;
                }

                if (flag)
                    pos.y += scrollStep;
                else
                    pos.y -= scrollStep;

                $listCtrl.setScrollPos(pos);

                if (oldPos.y <= 0 || $listCtrl.getScrollPos().y < oldPos.y)
                    stopScrollTimer();
            }

            var startScrollTimer = function (flag, scrollStep, interval) {
                if (!isScrollTimerActive) {
                    scrollCount = 0;
                    isScrollTimerActive = true;

                    var scrollInterval = interval ? interval : 100;

                    scrollTimerID = $interval(function () {
                        scrollTimerElapsed(flag, scrollStep);
                    }, scrollInterval);
                }
            }

            var stopScrollTimer = function () {
                if (isScrollTimerActive) {
                    if (scrollTimerID) {
                        $interval.cancel(scrollTimerID);
                        scrollTimerID = null;
                    }

                    isScrollTimerActive = false;
                    scrollCount = 0;
                    accelerator = 0.5;
                }
            }

            $listCtrl.cancelScrollTimer = function () {
                stopScrollTimer();
            }

            $listCtrl.scrollTo = function (item, pos) {
                if (item) {
                    var index = $listCtrl.getItemCurrentIndex(item);

                    if ($listCtrl.isIndexInRange(index)) {
                        var numVisibleItems = 0;
                        var scrollIndex = index;

                        switch (pos) {
                            case 'center':
                                numVisibleItems = Math.floor(itemCount / 2);
                                scrollIndex = index > numVisibleItems ? index - numVisibleItems : 0;
                                break;
                            case 'bottom':
                                numVisibleItems = itemCount - 2;
                                scrollIndex = index > numVisibleItems ? index - numVisibleItems : 0;
                                break;
                        }

                        var scrollPosTimer = $timeout(function () {
                            $listCtrl.setScrollPos({x: $listCtrl.scrollPos.x, y: scrollIndex * avgItemHeight});

                            $timeout.cancel(scrollPosTimer);
                        }, 1);

                    }
                }
            }

            var processHorScrollThumbMove = function (e) {
                if (e.which === 1) {
                    var horScrollThumbRect = horScrollThumbButton[0].getBoundingClientRect();

                    var newMousePos = $listCtrl.getMousePos(e);
                    if (!self.scrollMousePos)
                        self.scrollMousePos = newMousePos;

                    var distance = newMousePos.x - self.scrollMousePos.x;
                    var newThumbPos = horScrollThumbButton[0].offsetLeft + distance;

                    //if (newMousePos.x >= horScrollThumbRect.left && newMousePos.x <= horScrollThumbRect.right){
                    if (newThumbPos < horThumbStartPos)
                        newThumbPos = horThumbStartPos;
                    else if (newThumbPos + horScrollThumbButton[0].offsetWidth > horThumbEndPos)
                        newThumbPos = horThumbEndPos - horScrollThumbButton[0].offsetWidth;

                    horScrollThumbButton.css("left", newThumbPos + "px");
                    self.scrollMousePos = newMousePos;

                    $listCtrl.prevScrollPos = {x: $listCtrl.scrollPos.x, y: $listCtrl.scrollPos.y};

                    if ($listCtrl.options.rtl !== false)
                        $listCtrl.scrollPos.x = parseInt((horThumbEndPos - horScrollThumbButton[0].offsetLeft - horScrollThumbButton[0].offsetWidth) * horThumbStep, 10);
                    else
                        $listCtrl.scrollPos.x = parseInt((horScrollThumbButton[0].offsetLeft - horThumbStartPos) * horThumbStep, 10);

                    scrollCurrentView();

                    if (isScrollPosInRange($listCtrl.scrollPos) || $listCtrl.scrollPos.x != $listCtrl.prevScrollPos.x)
                        $listCtrl.callScrollPosChanged();
                    //}
                    /*else if (newMousePos.x < horScrollThumbRect.left){
                     newThumbPos = horThumbStartPos;

                     horScrollThumbButton.css("left", newThumbPos + "px");
                     self.scrollMousePos = startScrollMousePos;

                     $listCtrl.scrollPos.x = 0;

                     scrollCurrentView(0);
                     }
                     else if (newMousePos.x > horScrollThumbRect.right){
                     newThumbPos = horThumbEndPos - horScrollThumbButton[0].offsetWidth;
                     horScrollThumbButton.css("left", newThumbPos + "px");

                     $listCtrl.scrollPos.x = allColumnWidth - blockSize.width;
                     scrollCurrentView(blockSize.width - allColumnWidth);
                     }*/
                }
            }

            var scrollCurrentView = function () {
                if (blockElem) {
                    var horScrollValue = $listCtrl.scrollPos.x;

                    if (horScrollValue < 0)
                        horScrollValue = 0;
                    if (horScrollValue > maxScrollPos.x)
                        horScrollValue = maxScrollPos.x;

                    horScrollValue = 2 - horScrollValue;

                    if ($listCtrl.options.rtl !== false)
                        blockElem.css("right", horScrollValue + "px");
                    else
                        blockElem.css("left", horScrollValue + "px");
                }
            }

            var processVerScrollThumbMove = function (e) {
                if (e.which === 1) {
                    var verScrollThumbRect = verScrollThumbButton[0].getBoundingClientRect();

                    var newMousePos = $listCtrl.getMousePos(e);
                    if (!self.scrollMousePos)
                        self.scrollMousePos = newMousePos;

                    var distance = newMousePos.y - self.scrollMousePos.y;
                    var newThumbPos = verScrollThumbButton[0].offsetTop + distance;

                    //if (newMousePos.y >= verScrollThumbRect.top && newMousePos.y <= verScrollThumbRect.bottom){
                    if (newThumbPos < verThumbStartPos)
                        newThumbPos = verThumbStartPos;
                    else if (newThumbPos + verScrollThumbButton[0].offsetHeight > verThumbEndPos)
                        newThumbPos = verThumbEndPos - verScrollThumbButton[0].offsetHeight;

                    verScrollThumbButton.css("top", newThumbPos + "px");
                    self.scrollMousePos = newMousePos;

                    verScrollValue = newThumbPos - verThumbStartPos;
                    $listCtrl.prevScrollPos = {x: $listCtrl.scrollPos.x, y: $listCtrl.scrollPos.y};
                    $listCtrl.scrollPos.y = Math.floor(verScrollValue * verThumbStep * avgItemHeight);

                    if (isScrollPosInRange($listCtrl.scrollPos) || $listCtrl.scrollPos.y != $listCtrl.prevScrollPos.y)
                        $listCtrl.callScrollPosChanged();

                    updateCurrentIndex();
                    //}
                    /*else if (newMousePos.x < verScrollThumbRect.top){
                     newThumbPos = horThumbStartPos;

                     horScrollThumbButton.css("left", newThumbPos + "px");
                     self.scrollMousePos = startScrollMousePos;

                     scrollCurrentView(0);
                     }
                     else if (newMousePos.x > verScrollThumbRect.bottom){
                     newThumbPos = horThumbEndPos - horScrollThumbButton[0].offsetWidth;
                     horScrollThumbButton.css("left", newThumbPos + "px");

                     scrollCurrentView(blockSize.width - allColumnWidth);
                     }*/
                }
            }

            var updateCurrentIndex = function (flag) {
                if (flag == false && avgItemHeight <= 0)
                    return;

                newIndex = avgItemHeight > 0 ? Math.floor($listCtrl.scrollPos.y / avgItemHeight) : 0;

                if (newIndex + visibleRange - 1 > $listCtrl.currentList.length)
                    newIndex = $listCtrl.currentList.length - visibleRange + 1;
                if (newIndex < 0)
                    newIndex = 0;

                if (newIndex !== currentIndex) {
                    currentIndex = newIndex;
                    if (flag != false)
                        $listCtrl.updateView(true);
                }
            }

            $elem.bind("scroll", function (e) {
                $elem[0].scrollTop = 0;
                $elem[0].scrollLeft = 0;
            });

            $elem.bind("mousewheel", function (e) {
                e.preventDefault();

                $listCtrl.hoverItem = null;

                var delta = 0;
                if (e.wheelDelta)
                    delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
                else if (e.originalEvent)
                    delta = Math.max(-1, Math.min(1, (e.originalEvent.wheelDelta || -e.originalEvent.detail)));

                var wheelStep = Math.floor($elem[0].clientHeight / 4);
                $listCtrl.prevScrollPos = {x: $listCtrl.scrollPos.x, y: $listCtrl.scrollPos.y};
                $listCtrl.setScrollPos({x: $listCtrl.scrollPos.x, y: $listCtrl.scrollPos.y + wheelStep * delta * (-1)});

                if (!isScrollPosInRange($listCtrl.scrollPos) && $listCtrl.scrollPos.y != $listCtrl.prevScrollPos.y)
                    $listCtrl.callScrollPosChanged();

                // Update hover item and refresh the view
                var wheelTimer = $timeout(function () {
                    var mousePos = $listCtrl.getMousePos(e);
                    var shiftPos = {
                        x: angular.element($window)[0].pageXOffset,
                        y: angular.element($window)[0].pageYOffset
                    }

                    mousePos.x -= shiftPos.x;
                    mousePos.y -= shiftPos.y;

                    var tempItem = $listCtrl.getItemAt(mousePos.x, mousePos.y);

                    if (tempItem) {
                        $listCtrl.hoverItem = tempItem;
                        $listCtrl.refresh();
                    }
                }, 1);
            });

            $(window).on("dragover." + $scope.$id, function (e) {
                stopScrollTimer();
            });

            $(window).on("dragend." + $scope.$id, function (e) {
                $listCtrl.dragDropStatus(false);
            });

            $(window).on("mousemove." + $scope.$id, function (e) {
                if (horScrollStarted)
                    processHorScrollThumbMove(e);
                else if (verScrollStarted)
                    processVerScrollThumbMove(e);
            });

            $(window).on("mouseup." + $scope.$id, function (e) {
                $listCtrl.dropMark();

                if (verScrollStarted)
                    $listCtrl.updateView();

                stopScrollTimer();

                self.scrollMousePos = null;
                horScrollStarted = false;
                verScrollStarted = false;
            });

            // Selection -------------------------------------------------------------

            var selectItem = function (e, item) {
                $listCtrl.itemSelection(e, item);
                //$scope.$apply();
            }

            // Initialize properties
            if (angular.isDefined($scope.options))
                $listCtrl.updateOptions($scope.options);
            else {
                if ($scope.allowAnimation == false)
                    $listCtrl.options.allowAnimation = $scope.allowAnimation;

                if ($scope.allowDrag == true)
                    $listCtrl.options.allowDrag = $scope.allowDrag;

                if ($scope.allowDrop == false)
                    $listCtrl.options.allowDrop = $scope.allowDrop;

                if (angular.isDefined($scope.animationSpeed) && $scope.animationSpeed !== 200)
                    $listCtrl.options.animationSpeed = $scope.animationSpeed;

                if ($scope.allowFocus == false)
                    $listCtrl.options.allowFocus = $scope.allowFocus;

                if ($scope.autoCheck == true)
                    $listCtrl.options.autoCheck = $scope.autoCheck;

                if ($scope.autoExpand == false)
                    $listCtrl.options.autoExpand = $scope.autoExpand;

                if (angular.isDefined($scope.checkboxSettings))
                    $listCtrl.updateCheckBoxSettings($scope.checkboxSettings);

                if (angular.isDefined($scope.controlStyle))
                    $listCtrl.updateControlStyle($scope.controlStyle);

                if (angular.isDefined($scope.editorSettings))
                    $listCtrl.updateEditorSettings($scope.editorSettings);

                if (angular.isDefined($scope.fields)) {
                    $listCtrl.updateDataFields($scope.fields);
                    $listCtrl.updateData();
                }

                if ($scope.hoverSelection === true)
                    $listCtrl.options.hoverSelection = $scope.hoverSelection;

                if (angular.isDefined($scope.indent))
                    $listCtrl.options.indent = $scope.indent;

                if (angular.isDefined($scope.itemIcon))
                    $listCtrl.options.itemIcon = $scope.itemIcon;

                if (angular.isDefined($scope.labelEdit))
                    $listCtrl.options.labelEdit = $scope.labelEdit;

                if ($scope.rtl === true)
                    $listCtrl.options.rtl = $scope.rtl;

                if (angular.isDefined($scope.selectedIndex))
                    $listCtrl.options.selectedIndex = $scope.selectedIndex;

                if (angular.isDefined($scope.selectedItem))
                    $listCtrl.options.selectedItem = $scope.selectedItem;

                if (angular.isDefined($scope.selectionMode))
                    $listCtrl.options.selectionMode = $scope.selectionMode;

                if ($scope.showCheckBoxes === true)
                    $listCtrl.options.showCheckBoxes = $scope.showCheckBoxes;

                if ($scope.showIcons === false)
                    $listCtrl.options.showIcons = $scope.showIcons;

                if ($scope.showStatusIcons === true)
                    $listCtrl.options.showStatusIcons = $scope.showStatusIcons;

                if (angular.isDefined($scope.sorting))
                    $listCtrl.options.sorting = $scope.sorting;
            }

            // Initialize the layout of component 
            $listCtrl.updateLayout();
        }
    }]);