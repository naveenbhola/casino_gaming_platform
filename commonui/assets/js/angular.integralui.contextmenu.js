/*
 filename: angular.integralui.contextmenu.js
 version : 2.1.0
 Copyright © 2014-2015 Lidor Systems. All rights reserved.

 This file is part of the "IntegralUI" Library.

 The contents of this file are subject to the IntegralUI Studio for Web License, and may not be used except in compliance with the License.
 A copy of the License should have been installed in the product's root installation directory or it can be found at
 http://www.lidorsystems.com/products/web/studio/license-agreement.aspx.

 This SOFTWARE is provided "AS IS", WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language
 governing rights and limitations under the License. Any infringement will be prosecuted under applicable laws.
 */

angular.module("integralui")

    // IntegralUI Menu Directive ------------------------------------------------------
    .directive("iuiContextmenu", ["$compile", "$window", "$timeout", "$interval", "IntegralUIInternalService", function ($compile, $window, $timeout, $interval, $internalService) {
        return {
            restrict: "A",
            link: linkFn
        };

        function linkFn($scope, $elem, $attrs, $ctrl, $transclude) {
            var bodyElem = $internalService.getBodyElem($elem[0]);
            var menuElem = angular.element('<div class="iui-contextmenu" data-element="context-menu"></div>');
            var blockElem = angular.element('<ul class="iui-contextmenu-block"></ul>');
            var itemList = $scope.$eval($attrs.menuItems);

            menuElem.append(blockElem);

            var parentName = '';
            var hoverItem = null;

            var generalClassName = "iui-contextmenu";
            var blockClassName = generalClassName + '-block';
            var markerClassName = generalClassName + '-marker';
            var markerExpandClassName = markerClassName + '-expand';
            var itemClassName = generalClassName + '-item';
            var itemContentClassName = itemClassName + '-content';
            var itemHeaderClassName = generalClassName + '-item-header';
            var itemSeparatorClassName = generalClassName + '-item-separator';


            var defaultStyle = {
                general: generalClassName,
                block: {
                    general: blockClassName,
                    marker: {
                        top: markerClassName + "-top",
                        left: markerClassName + "-left",
                        bottom: markerClassName + "-bottom",
                        right: markerClassName + "-right",
                        rtlTop: markerClassName + "-top-rtl",
                        expand: {
                            down: markerExpandClassName + "-down",
                            right: markerExpandClassName + "-right",
                            rtlDown: markerExpandClassName + "-rtl-down",
                            up: markerExpandClassName + "-up",
                            left: markerExpandClassName + "-left",
                            space: markerExpandClassName + "-space"
                        }
                    }
                },
                item: {
                    general: {
                        disabled: itemClassName + '-disabled',
                        focused: itemClassName + '-focused',
                        normal: itemClassName,
                        hovered: itemClassName + '-hovered',
                        selected: itemClassName + '-selected'
                    },
                    content: itemContentClassName,
                    header: itemHeaderClassName,
                    loadIcon: {
                        general: generalClassName + "-load",
                        icon: generalClassName + "-load-icon"
                    },
                    separator: itemSeparatorClassName
                }
            }

            var menuOptions = {
                controlStyle: defaultStyle,
                dataFields: {
                    enabled: 'enabled',
                    icon: 'icon',
                    id: 'id',
                    hasChildren: 'hasChildren',
                    pid: 'pid',
                    items: 'items',
                    style: 'style',
                    text: 'text',
                    type: 'type'
                },
                enabled: true,
                itemClick: null,
                itemIcon: '',
                items: [],
                loadItem: null,
                open: null,
                openOnHover: true,
                position: 'mouse',
                rtl: false,
                activate: 'rightclick',
                showIcons: true
            }

            // Search for parent IntegralUI directive and retrieve its unique name
            var getParentDirective = function () {
                var currentElem = $elem;

                while (currentElem && currentElem[0] && currentElem[0] !== document.getElementsByTagName("body")[0]) {
                    if (currentElem[0].attributes && currentElem[0].attributes['name']) {
                        parentName = currentElem[0].attributes['name'].value;
                        break;
                    }

                    currentElem = currentElem.parent();
                }
            }

            // Current List --------------------------------------------------------------

            var currentList = [];
            var fullList = [];

            var addItemToCurrentList = function (item, pid, flag) {
                if (!item.type)
                    item.type = "item";

                if (!item[menuOptions.dataFields.id])
                    item[menuOptions.dataFields.id] = $internalService.getUniqueId();

                if (pid)
                    item[menuOptions.dataFields.pid] = pid;

                if (flag)
                    fullList.push(item);
                else
                    currentList.push(item);
            }

            var addChildItems = function (parentItem, pid, flag) {
                if (!parentItem[menuOptions.dataFields.items]) {
                    addItemToCurrentList(parentItem, pid, flag);
                    return;
                }

                addItemToCurrentList(parentItem, pid, flag);

                var list = parentItem[menuOptions.dataFields.items];
                if (list) {
                    for (var i = 0; i < list.length; i++)
                        addChildItems(list[i], parentItem[menuOptions.dataFields.id], flag);
                }
            }

            var getFullList = function (item) {
                return fullList;
            }

            var updateFullList = function () {
                fullList.length = 0;

                var list = menuOptions[menuOptions.dataFields.items];
                for (var i = 0; i < list.length; i++)
                    addChildItems(list[i], null, true);

                return fullList;
            }

            var getCurrentList = function () {
                return currentList;
            }

            var updateCurrentList = function () {
                currentList.length = 0;

                var list = menuOptions[menuOptions.dataFields.items];
                if (list) {
                    for (var i = 0; i < list.length; i++)
                        addItemToCurrentList(list[i], 0, null, false);
                }
            }

            var getItemFullIndex = function (item) {
                return item && fullList ? fullList.indexOf(item) : -1;
            }

            // Events --------------------------------------------------------------------

            // Element

            var activateMenu = function (e) {
                if (!menuOptions.items || (menuOptions.items && menuOptions.items.length == 0))
                    return false;

                removeMenu();

                if (!e.ctrlKey && !e.metaKey) {
                    if (menuElem) {
                        menuElem.unbind("contextmenu");
                        menuElem.remove();
                    }

                    showMenu(e);
                }

                return true;
            }

            $elem.bind("contextmenu", function (e) {
                var pass = menuOptions.activate != 'click' && menuOptions.items && menuOptions.items.length > 0;

                if (pass)
                    e.preventDefault();

                var pass = true;
                switch (menuOptions.activate) {
                    case 'both':
                        activateMenu(e);
                        break;

                    case 'click':
                        removeMenu();
                        break;

                    default:
                        activateMenu(e);
                        break;
                }

                if (pass)
                    e.stopPropagation();
            });

            $elem.bind("click", function (e) {
                e.preventDefault();

                switch (menuOptions.activate) {
                    case 'both':
                        activateMenu(e);
                        break;

                    case 'click':
                        activateMenu(e);
                        break;

                    default:
                        removeMenu();
                        break;
                }

                e.stopPropagation();
            });


            $elem.bind("blur", function (e) {
                //removeMenu();
            });

            // Window

            angular.element($window).bind("click", function (e) {
                removeMenu();
            });

            angular.element($window).bind("contextmenu", function (e) {
                removeMenu();
            });

            angular.element($window).bind("keydown", function (e) {
                switch (e.keyCode) {
                    case 27: // ESCAPE
                        removeMenu();
                        break;
                }
            });


            var clearEvents = function (block) {
                var currentBlock = block ? block : blockElem;
                currentBlock.unbind("contextmenu");

                var elemList = block ? block.find("li") : blockElem.children();
                if (elemList.length > 0) {
                    for (var i = 0; i < elemList.length; i++) {
                        currentElem = angular.element(elemList[i]);

                        // Unbind all events for item element
                        currentElem.unbind("click mouseenter mouseleave");
                    }
                }
            }

            var bindEvents = function (block) {
                clearEvents(block);

                var currentBlock = block ? block : blockElem;

                currentBlock.bind("contextmenu", function (e) {
                    e.preventDefault();
                });

                var currentItem = null;

                var elemList = block ? block.find("li") : blockElem.children();
                if (elemList.length > 0) {
                    var currentElem = null;
                    for (var i = 0; i < elemList.length; i++) {
                        currentElem = angular.element(elemList[i]);

                        currentItem = getItemFromElem(currentElem);
                        if (currentItem && isItemEnabled(currentItem) && isItemNormal(currentItem)) {
                            // Bind all events for item element
                            bindItemEvents(currentElem);
                        }
                    }
                }
            }

            // Item Element Events
            var bindItemEvents = function (itemElem) {
                if (itemElem) {

                    // Click -------------------------------------------------------------

                    itemElem.bind("click", function (e) {
                        var item = getItemFromElem(this);
                        if (item) {
                            if (item.itemClick)
                                item.itemClick({
                                    parentName: parentName,
                                    item: item,
                                    mousePos: {x: e.pageX, y: e.pageY}
                                });
                            else if (menuOptions.itemClick)
                                menuOptions.itemClick({
                                    parentName: parentName,
                                    item: item,
                                    mousePos: {x: e.pageX, y: e.pageY}
                                });

                            removeMenu();
                        }

                        e.stopPropagation();
                    });

                    // Hovering ----------------------------------------------------------

                    itemElem.bind("mouseenter", function (e) {
                        var item = getItemFromElem(this);
                        if (item) {
                            var elem = angular.element(this);

                            hoverItem = item;
                            refresh(null, true);

                            if (menuOptions.openOnHover) {
                                if (hoverOpenTimer)
                                    $timeout.cancel(hoverOpenTimer);

                                hoverOpenTimer = $timeout(function () {
                                    if (hoverOpenTimer)
                                        openItem(item);
                                }, 500);
                            }
                            else if (isMenuOpen && item != activeMenuItem) {
                                //var hoverOpenNewTimer = $timeout(function(){
                                if (activeMenuItem)
                                    closeItem(activeMenuItem);

                                openItem(item);

                                //$timeout.cancel(hoverOpenNewTimer);
                                //}, 100);
                            }
                        }

                        e.stopPropagation();
                    });

                    itemElem.bind("mouseleave", function (e) {
                        hoverItem = null;

                        var item = getItemFromElem(this);
                        if (item) {
                            refresh(null, true);

                            if (activeMenuItem) {
                                activeMenuItem[menuOptions.dataFields.selected] = true;
                                refresh(activeMenuItem);
                            }

                            if (menuOptions.openOnHover)
                                var hoverCloseTimer = $timeout(function () {
                                    closeItem(item);

                                    $timeout.cancel(hoverCloseTimer);
                                }, 250);
                        }

                        cancelHoverTimer();

                        e.stopPropagation();
                    });
                }
            }

            // Functionality --------------------------------------------------------------

            var isMenuOpen = false;
            var activeMenuItem = null;
            var activeMenuList = [];

            var isChildrenPresent = function (item) {
                if (item) {
                    var list = item[menuOptions.dataFields.items];
                    return list != undefined && list.length > 0;
                }

                return false;
            }

            var openItem = function (item) {
                var itemElem = getElemFromItem(item);
                if (item && isParent(item) && itemScope && itemElem) {
                    var itemBlockElem = itemElem.find("ul");
                    if (itemBlockElem.length > 0) {
                        itemBlockElem = angular.element(itemBlockElem.eq(0));

                        // Clear all active element events
                        clearEvents(itemBlockElem);

                        if (isChildrenPresent(item)) {
                            itemElem.removeClass(menuOptions.controlStyle.block.marker.expand.down);
                            itemElem.removeClass(menuOptions.controlStyle.block.marker.expand.left);
                            itemElem.removeClass(menuOptions.controlStyle.block.marker.expand.right);
                            itemElem.removeClass(menuOptions.controlStyle.block.marker.expand.rtlDown);
                        }

                        isMenuOpen = true;
                        activeMenuItem = isRoot(item) ? item : activeMenuItem;
                        activeMenuItem[menuOptions.dataFields.selected] = true;
                        if (activeMenuList.indexOf(activeMenuItem) < 0)
                            activeMenuList.unshift(activeMenuItem);

                        // Clear all previously opened root menus
                        for (var i = 0; i < activeMenuList.length; i++) {
                            if (activeMenuList[i] != activeMenuItem) {
                                activeMenuList[i][menuOptions.dataFields.selected] = false;
                                closeItem(activeMenuList[i]);
                            }
                        }
                        activeMenuList.splice(1, activeMenuList.length - 1);

                        if (isChildrenPresent(item)) {
                            var itemIndex = getItemIndex(item);
                            if (itemIndex >= 0) {

                                var blockPos = {
                                    top: 0,
                                    right: "auto",
                                    left: "auto"
                                }

                                var parentBlockElem = angular.element(itemElem.parent());
                                var padding = $internalService.getPadding(itemElem[0]);
                                var parentPadding = $internalService.getPadding(parentBlockElem[0]);

                                blockPos.top -= parentPadding.top;
                                if (menuOptions.rtl)
                                    blockPos.right = parentBlockElem[0].offsetWidth - 8;
                                else
                                    blockPos.left = parentBlockElem[0].offsetWidth - 8;


                                var blockStyle = "display:block;";
                                blockStyle += "top:" + blockPos.top + "px;";
                                if (blockPos.left != 'auto')
                                    blockStyle += "left:" + blockPos.left + "px;";
                                if (blockPos.right != 'auto')
                                    blockStyle += "right:" + blockPos.right + "px;";

                                var itemScopeData = getItemScopeData(getParent(item));
                                if (itemScopeData && itemScopeData.data && itemIndex < itemScopeData.data.length) {
                                    itemScopeData.data[itemIndex].inlineBlockStyle = blockStyle;
                                    itemScope.$apply();
                                }
                            }

                            // Bind element events
                            var eventTimer = $timeout(function () {
                                bindEvents(itemBlockElem);

                                updateLoadIconPosition();
                            }, 1);
                        }
                    }
                }
            }


            var closeItem = function (item) {
                var itemElem = getElemFromItem(item);
                if (item && itemScope && itemElem) {
                    var itemBlockElem = itemElem.find("ul");
                    if (itemBlockElem.length > 0) {
                        itemBlockElem = angular.element(itemBlockElem.eq(0));

                        // Clear all active element events
                        clearEvents(itemBlockElem);

                        if (isParent(item)) {
                            if (menuOptions.rtl)
                                itemElem.addClass(menuOptions.controlStyle.block.marker.expand.left);
                            else
                                itemElem.addClass(menuOptions.controlStyle.block.marker.expand.right);
                        }

                        var itemIndex = getItemIndex(item);
                        if (itemIndex >= 0) {
                            var blockStyle = "display:none;";

                            var itemScopeData = getItemScopeData(getParent(item));
                            if (itemScopeData && itemScopeData.data && itemIndex < itemScopeData.data.length) {
                                itemScopeData.data[itemIndex].inlineBlockStyle = blockStyle;
                                itemScope.$apply();
                            }
                        }
                    }
                }
            }


            var removeMenu = function () {
                if (menuElem)
                    menuElem.remove();

                bodyElem = $internalService.getBodyElem($elem[0]);
                if (bodyElem) {
                    var elemList = angular.element(bodyElem).children();
                    for (var i = 0; i < elemList.length; i++) {
                        var currentElem = angular.element(elemList[i]);

                        if (currentElem[0].attributes && currentElem[0].attributes['data-element'] && currentElem[0].attributes['data-element'].value === 'context-menu')
                            currentElem.remove();
                    }
                }

                isMenuOpen = false;
                activeMenuItem = null;

                cancelHoverTimer();
            }

            var showMenu = function (e) {
                bodyElem = $internalService.getBodyElem($elem[0]);
                if (bodyElem) {
                    menuElem.css("top", "-999px");
                    angular.element(bodyElem).append(menuElem);

                    updateLayout();

                    var showTimer = $timeout(function () {
                        var cssTopValue = e.pageY;
                        var cssLeftValue = e.pageX;

                        var elemPageRect = $internalService.getPageRect($elem[0]);
                        switch (menuOptions.position) {
                            case 'above':
                                cssTopValue = elemPageRect.top - 2 - blockElem[0].offsetHeight;
                                cssLeftValue = elemPageRect.right - blockElem[0].offsetWidth + 1;
                                break;

                            case 'below':
                                cssTopValue = elemPageRect.bottom + 2;
                                cssLeftValue = elemPageRect.right - blockElem[0].offsetWidth + 1;
                                break;

                            case 'left':
                                cssTopValue = elemPageRect.top - 1;
                                cssLeftValue = elemPageRect.left - 2 - blockElem[0].offsetWidth;
                                break;

                            case 'right':
                                cssTopValue = elemPageRect.top - 1;
                                cssLeftValue = elemPageRect.right + 2;
                                break;
                        }

                        menuElem.css("top", cssTopValue + "px");
                        menuElem.css("left", cssLeftValue + "px");

                        getParentDirective();

                        bindEvents();

                        if (menuOptions.open)
                            menuOptions.open({mousePos: {x: e.pageX, y: e.pageY}});

                        var prevTrialWindows = menuElem.find("div");
                        if (prevTrialWindows && prevTrialWindows.length > 0)
                            prevTrialWindows.remove();

                        $timeout.cancel(showTimer);
                    }, 1);
                }
            }


            // General -------------------------------------------------------------------

            var getElemFromItem = function (item) {
                var foundElem = null;

                if (item) {
                    var index = getItemFullIndex(item);
                    var elemList = menuElem.find("li");
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

            var getBlockElemFromItem = function (item) {
                var foundElem = null;

                if (item) {
                    var itemElem = getElemFromItem(item);
                    if (itemElem) {
                        var blockList = itemElem.find("ul");
                        if (blockList.length > 0)
                            foundElem = angular.element(blockList.eq(0));
                    }
                }

                return foundElem;
            }

            var getItemFromChildElem = function (childElem) {
                if (childElem) {
                    childElem = angular.element(childElem);
                    return childElem ? getItemFromElem(childElem[0].parentElement) : null;
                }

                return null;
            }

            var getItemFromElem = function (elem) {
                if (elem) {
                    elem = angular.element(elem);
                    if (elem && elem[0].attributes['data-index']) {
                        var index = elem[0].attributes['data-index'].value;
                        if (index >= 0 && index < fullList.length)
                            return fullList[index];
                    }
                }
            }

            var findParent = function (item, list) {
                var found = null;

                if (item && list) {
                    var i = 0;
                    while (!found && i < list.length) {
                        if (list[i][menuOptions.dataFields.id] && item[menuOptions.dataFields.pid] && list[i][menuOptions.dataFields.id].toString() === item[menuOptions.dataFields.pid].toString())
                            found = list[i];
                        else
                            found = findParent(item, list[i][menuOptions.dataFields.items]);

                        i++;
                    }
                }

                return found;
            }

            var getItemIndex = function (item) {
                var parent = getParent(item);
                var list = getList(parent);

                return getIndexOf(item, list);
            }

            var getIndexOf = function (item, list) {
                var foundIndex = -1;

                if (!list)
                    list = getList();

                if (!item[menuOptions.dataFields.id] && list)
                    foundIndex = list.indexOf(item);
                else if (item && list) {
                    for (var i = 0; i < list.length; i++) {
                        if (list[i][menuOptions.dataFields.id] && item[menuOptions.dataFields.id] && list[i][menuOptions.dataFields.id].toString() === item[menuOptions.dataFields.id].toString()) {
                            foundIndex = i;
                            break;
                        }
                    }
                }

                return foundIndex;
            }

            var getParent = function (item) {
                return item ? findParent(item, menuOptions[menuOptions.dataFields.items]) : null;
            }

            var getList = function (item) {
                if (item) {
                    if (!item[menuOptions.dataFields.items])
                        item[menuOptions.dataFields.items] = [];

                    return item[menuOptions.dataFields.items];
                }

                return menuOptions.items;
            }

            var getObjState = function (obj) {
                if (obj) {
                    if (obj.type == 'separator')
                        return 'normal';
                    else {
                        if (obj[menuOptions.dataFields.enabled] == false)
                            return 'disabled';
                        else if (obj == self.hoverItem)
                            return 'hovered';
                        else if (obj[menuOptions.dataFields.selected] == true)
                            return 'selected';
                    }
                }

                return 'normal';
            }

            var isItemEnabled = function (item) {
                return item ? $internalService.isEnabled(item[menuOptions.dataFields.enabled]) : false;
            }

            var isItemNormal = function (item) {
                return item ? item.type == 'item' : false;
            }

            var isRoot = function (item) {
                return item && (item[menuOptions.dataFields.pid] == undefined || item[menuOptions.dataFields.pid] == null) ? true : false;
            }


            // Hovering -------------------------------------------------------------------

            var hoverOpenTimer = null;

            var cancelHoverTimer = function () {
                if (hoverOpenTimer)
                    $timeout.cancel(hoverOpenTimer);

                hoverOpenTimer = null;
            }

            // Layout --------------------------------------------------------------------

            var allowUpdate = true;
            var itemScope = null;
            var itemCount = 0;

            var isParent = function (item) {
                if (item) {
                    var list = item[menuOptions.dataFields.items];
                    return item[menuOptions.dataFields.hasChildren] || (list && list.length > 0);
                }

                return false;
            }

            var getIconClass = function (item) {
                var classNames = '';

                if (item[menuOptions.dataFields.icon] || item[menuOptions.dataFields.icon] == '')
                    classNames = item[menuOptions.dataFields.icon];
                else if (menuOptions.itemIcon)
                    classNames = menuOptions.itemIcon;

                return classNames;
            }

            var isIconPresent = function (item) {
                return item.icon != null || menuOptions.itemIcon != null;
            }

            var createItemObj = function (item, i, flag) {
                var obj = {
                    icon: getIconClass(item),
                    iconVisible: menuOptions.showIcons != false && isIconPresent(item),
                    index: i,
                    inlineBlockStyle: 'display:none',
                    item: item,
                    style: {},
                    //tabindex: flag ? getItemTabIndex(i) : '',
                    visible: flag
                }

                return obj;
            }

            var updateItemScopeData = function (list) {
                var tempList = [];

                if (list)
                    for (var i = 0; i < list.length; i++)
                        tempList.push(createItemObj(list[i], getItemFullIndex(list[i])));

                return tempList;
            }

            var updateLoadIconPosition = function () {
                var elemList = blockElem.find("li");
                if (elemList.length > 0) {
                    for (var i = 0; i < elemList.length; i++) {
                        var currentElem = angular.element(elemList[i]);
                        var childList = currentElem.children();
                        for (var k = 0; k < childList.length; k++) {
                            var childElem = angular.element(childList[k]);
                            if (childElem[0].attributes['data-element'] && childElem[0].attributes['data-element'].value.toString() == 'load-icon')
                                childElem.css("top", (currentElem[0].clientHeight - childElem[0].offsetHeight) / 2 + "px");
                        }
                    }
                }
            }

            var updateElemDataIndex = function () {
                var elemList = blockElem.find("li");
                if (elemList.length > 0) {
                    for (var i = 0; i < elemList.length; i++) {
                        var currentElem = angular.element(elemList[i]);
                        if (currentElem) {
                            currentElem.attr("data-index", i);
                        }
                    }
                }
            }

            var searchItem = function (list, item) {
                var found = null;
                if (list && item) {
                    var i = 0;
                    while (!found && i < list.length) {
                        found = list[i].item == item ? list[i] : searchItem(list[i].data, item);
                        i++;
                    }
                }

                return found;
            }

            var getItemScopeData = function (item) {
                if (item)
                    return searchItem(itemScope.data, item);

                return itemScope;
            }

            var createLayout = function (item) {
                var initTimer = $timeout(function () {
                    // Clear all active element events
                    clearEvents();

                    if (menuOptions.rtl)
                        menuElem.css("direction", "rtl");
                    else
                        menuElem.css("direction", "ltr");

                    if (!item) {
                        blockElem.empty();

                        if (itemScope)
                            itemScope.$destroy();
                    }

                    $timeout.cancel(initTimer);
                }, 1);


                var itemTimer = $timeout(function () {
                    var blockContent = '';
                    if (item) {
                        var itemScopeData = getItemScopeData(item);
                        if (itemScopeData) {
                            var list = item[menuOptions.dataFields.items];
                            if (list && list.length > 0) {
                                itemScopeData.data = updateItemScopeData(list);
                                refresh();
                                itemScope.$apply();

                                for (var k = 0; k < list.length; k++)
                                    blockContent += createItemLayout(k, list[k], itemScopeData.scopeRef, itemScopeData.data);

                                if (blockContent != '') {
                                    var itemBlockElem = getBlockElemFromItem(item);
                                    if (itemBlockElem) {
                                        itemBlockElem.empty();
                                        itemBlockElem.append($compile(blockContent)(itemScope));
                                    }
                                }
                            }

                            updateElemDataIndex();
                        }
                    }
                    else {
                        itemScope = $scope.$new();
                        itemScope.data = updateItemScopeData(currentList);
                        refresh();
                        itemScope.$apply();

                        for (var i = 0; i < currentList.length; i++)
                            blockContent += createItemLayout(i, currentList[i], 'data', itemScope.data);

                        if (blockContent != '')
                            blockElem.append($compile(blockContent)(itemScope));
                    }

                    // Bind element events
                    bindEvents();

                    var updateIconTimer = $timeout(function () {
                        updateLoadIconPosition();

                        $timeout.cancel(updateIconTimer);
                    }, 1);


                    $timeout.cancel(itemTimer);
                }, 1);
            }

            var createItemLayout = function (index, item, parentScope, scopeData) {
                var itemIndex = getItemFullIndex(item);
                var itemElem = '<li iui-class="{{' + parentScope + '[' + index + '].style';
                if (item.type == 'header')
                    itemElem += '.header}}"';
                else
                    itemElem += '.general}}"';

                itemElem += ' data-index="' + getItemFullIndex(item) + '">';

                switch (item.type) {
                    case 'header':
                        itemElem += '<span data-element="header">';
                        itemElem += '{{' + parentScope + '[' + index + '].item.' + menuOptions.dataFields.text + '}}';
                        itemElem += '</span>';
                        break;

                    case 'separator':
                        itemElem += '<hr iui-class="{{' + parentScope + '[' + index + '].style.separator}}" data-element="separator" />';
                        break;

                    default:
                        itemElem += '<span iui-class="{{' + parentScope + '[' + index + '].icon}}" data-element="icon" ng-show="' + parentScope + '[' + index + '].iconVisible"></span>';
                        itemElem += '<span iui-class="{{' + parentScope + '[' + index + '].style.content}}"  data-element="content">';
                        itemElem += '{{' + parentScope + '[' + index + '].item.' + menuOptions.dataFields.text + '}}';
                        itemElem += '</span>';
                        itemElem += '<span iui-class="{{' + parentScope + '[' + index + '].style.loadIcon}}" data-element="load-icon"></span>';
                        break;
                }


                var list = item[menuOptions.dataFields.items];
                if (item[menuOptions.dataFields.hasChildren] || (list && list.length > 0)) {

                    itemElem += '<ul iui-class="{{' + parentScope + '[' + index + '].style.block';
                    switch (menuOptions.displayMode) {
                        case 'vertical':
                            if (menuOptions.rtl)
                                itemElem += '.marker.right}}"';
                            else
                                itemElem += '.marker.left}}"';
                            break;

                        default:
                            if (menuOptions.rtl)
                                itemElem += '.marker.right}}"';
                            else
                                itemElem += '.marker.left}}"';
                            break;
                    }

                    itemElem += ' iui-style="{{' + parentScope + '[' + index + '].inlineBlockStyle}}">';

                    parentScope += '[' + index + '].data';
                    scopeData[index].data = updateItemScopeData(list);
                    scopeData[index].scopeRef = parentScope;

                    if (list && list.length > 0)
                        for (var k = 0; k < list.length; k++)
                            itemElem += createItemLayout(k, list[k], scopeData[index].scopeRef, scopeData[index].data);

                    itemElem += '</ul>';
                }


                itemElem += '</li>';

                return itemElem;
            }

            var updateLayout = function (item) {
                if (allowUpdate) {
                    updateCurrentList();
                    updateFullList();

                    createLayout(item);
                }
            }

            // Styles --------------------------------------------------------------------

            var getBlockStyle = function (value) {
                if (value)
                    return {
                        general: $internalService.isFieldAvailable(value.general, blockClassName),
                        marker: getMarkerStyle(value.marker)
                    }

                return menuOptions.controlStyle.block;
            }

            var getMarkerStyle = function (value) {
                if (value)
                    return {
                        top: $internalService.isFieldAvailable(value.top, markerClassName + '-top'),
                        left: $internalService.isFieldAvailable(value.left, markerClassName + '-left'),
                        bottom: $internalService.isFieldAvailable(value.bottom, markerClassName + '-bottom'),
                        right: $internalService.isFieldAvailable(value.right, markerClassName + '-right'),
                        expand: getMarkerExpandStyle(value.expand)
                    }

                return menuOptions.controlStyle.block.marker;
            }

            var getMarkerExpandStyle = function (value) {
                if (value)
                    return {
                        down: $internalService.isFieldAvailable(value.down, markerExpandClassName + '-down'),
                        right: $internalService.isFieldAvailable(value.right, markerExpandClassName + '-right'),
                        up: $internalService.isFieldAvailable(value.up, markerExpandClassName + '-up'),
                        left: $internalService.isFieldAvailable(value.left, markerExpandClassName + '-left'),
                        space: $internalService.isFieldAvailable(value.space, markerExpandClassName + '-space')
                    }

                return menuOptions.controlStyle.block.marker.expand;
            }

            var getItemStyle = function (value) {
                if (value)
                    return {
                        general: getItemGeneralStyle(value.general),
                        content: $internalService.isFieldAvailable(value.content, itemContentClassName),
                        header: $internalService.isFieldAvailable(value.header, itemHeaderClassName),
                        loadIcon: getItemLoadIconStyle(value.loadIcon),
                        separator: $internalService.isFieldAvailable(value.separator, itemSeparatorClassName)
                    }

                return menuOptions.controlStyle.item;
            }

            var getItemGeneralStyle = function (value) {
                if (value)
                    return {
                        disabled: $internalService.isFieldAvailable(value.disabled, itemClassName + '-disabled'),
                        focused: $internalService.isFieldAvailable(value.focused, itemClassName + '-focused'),
                        normal: $internalService.isFieldAvailable(value.normal, itemClassName),
                        hovered: $internalService.isFieldAvailable(value.hovered, itemClassName + '-hovered'),
                        selected: $internalService.isFieldAvailable(value.selected, itemClassName + '-selected')
                    }

                return menuOptions.controlStyle.item.general;
            }

            var getItemLoadIconStyle = function (value) {
                if (value)
                    return {
                        general: $internalService.isFieldAvailable(value.general, generalClassName + '-load'),
                        icon: $internalService.isFieldAvailable(value.icon, 'iui-submenu-load-icon')
                    }

                return menuOptions.controlStyle.item.loadIcon;
            }

            this.getCurrentItemStyle = function (item, state) {
                var retStyle = menuOptions.controlStyle.item;

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
                                return retStyle.general && retStyle.general.disabled ? retStyle.general.disabled : menuOptions.controlStyle.item.general.disabled;
                            case 'focused':
                                return retStyle.general && retStyle.general.focused ? retStyle.general.focused : menuOptions.controlStyle.item.general.focused;
                            case 'hovered':
                                return retStyle.general && retStyle.general.hovered ? retStyle.general.hovered : menuOptions.controlStyle.item.general.hovered;
                            case 'selected':
                                return retStyle.general && retStyle.general.selected ? retStyle.general.selected : menuOptions.controlStyle.item.general.selected;
                            default:
                                return retStyle.general && retStyle.general.normal ? retStyle.general.normal : menuOptions.controlStyle.item.general.normal;
                        }
                    }
                }
                else
                    return retStyle ? retStyle : menuOptions.controlStyle.item;
            }

            var updateControlStyle = function (value) {
                if (value) {
                    return {
                        general: $internalService.isFieldAvailable(value.general, generalClassName),
                        block: getBlockStyle(value.block),
                        item: getItemStyle(value.item)
                    }
                }
                else
                    return {
                        general: $internalService.isFieldAvailable(defaultStyle.general, generalClassName),
                        block: getBlockStyle(defaultStyle.block),
                        item: getItemStyle(defaultStyle.item)
                    }
            }

            var getDefaultStyle = function (type, flag) {
                var objStyle = {
                    block: defaultStyle.block,
                    content: '',
                    general: '',
                    header: defaultStyle.item.header,
                    label: '',
                    loadIcon: '',
                    separator: defaultStyle.item.separator
                };

                var objClass = '';

                switch (type) {
                    default:
                        objClass = defaultStyle.item.general.normal;
                        if (menuOptions.controlStyle.item.general.normal != objClass)
                            objClass += ' ' + menuOptions.controlStyle.item.general.normal;

                        objStyle.general = objClass;

                        // Content Class
                        objClass = defaultStyle.item.content;
                        if (menuOptions.controlStyle.item.content != objClass)
                            objClass += ' ' + menuOptions.controlStyle.item.content;

                        objStyle.content = objClass;

                        // Load Icon
                        objClass = defaultStyle.item.loadIcon.general;

                        if (menuOptions.controlStyle.item.loadIcon.general != objClass)
                            objClass += ' ' + menuOptions.controlStyle.item.loadIcon.general;
                        if (menuOptions.rtl)
                            objClass += '-rtl';

                        objStyle.loadIcon = objClass;
                        break;
                }

                return objStyle;
            }

            var getStyle = function (obj, flag) {
                var objState = getObjState(obj);
                var objStyle = getDefaultStyle(obj.type, flag);
                var objClass = '';
                var currentObjClass = '';

                switch (obj.type) {
                    case 'header':
                        // Header Class
                        currentObjClass = getCurrentItemStyle(obj).header;
                        if (currentObjClass != menuOptions.controlStyle.item.header)
                            objStyle.header += ' ' + currentObjClass;
                        break;

                    case 'separator':
                        // Separator Class
                        currentObjClass = getCurrentItemStyle(obj).separator;
                        if (currentObjClass != menuOptions.controlStyle.item.separator)
                            objStyle.separator += ' ' + currentObjClass;
                        break;

                    default:
                        var itemStyle = getCurrentItemStyle(obj);

                        currentObjClass = getCurrentItemStyle(obj, objState);
                        if (currentObjClass != menuOptions.controlStyle.item.general.normal)
                            objStyle.general += ' ' + currentObjClass;

                        if (flag && objState != 'selected' && !menuOptions.loadItem) {
                            if (menuOptions.rtl)
                                objStyle.general += ' ' + menuOptions.controlStyle.block.marker.expand.left;
                            else
                                objStyle.general += ' ' + menuOptions.controlStyle.block.marker.expand.right;
                        }

                        // Content Class
                        currentObjClass = itemStyle.content;
                        if (currentObjClass != menuOptions.controlStyle.item.content)
                            objStyle.content += ' ' + currentObjClass;

                        // Load Icon
                        if (obj == menuOptions.loadItem) {
                            currentObjClass = itemStyle.loadIcon.icon;
                            objStyle.loadIcon += ' ' + currentObjClass;

                            if (currentObjClass != menuOptions.controlStyle.item.loadIcon.icon)
                                objStyle.loadIcon += ' ' + currentObjClass;
                        }
                        break;
                }

                return objStyle;
            }

            var updateSelection = function () {
                for (var i = 0; i < fullList.length; i++)
                    fullList[i][menuOptions.dataFields.selected] = false;

                var parent = hoverItem;
                while (parent) {
                    parent[menuOptions.dataFields.selected] = true;
                    parent = getParent(parent);
                }
            }

            var refresh = function (item, flag) {
                if (itemScope) {
                    if (item) {
                        var objElem = null;

                        switch (item.type) {
                            default:
                                var itemData = getItemScopeData(item);
                                if (itemData) {
                                    itemData.style = getStyle(item, isParent(item));

                                    if (flag == undefined)
                                        itemScope.$apply();
                                }
                                break;
                        }
                    }
                    else {
                        updateSelection();

                        for (var i = 0; i < fullList.length; i++) {
                            refresh(fullList[i], false);
                        }

                        if (flag == true)
                            itemScope.$apply();
                    }
                }
            }

            // Initialize ----------------------------------------------------------------

            var getDataFields = function (value) {
                if (value)
                    return {
                        enabled: $internalService.isFieldAvailable(value.enabled, 'enabled'),
                        hasChildren: $internalService.isFieldAvailable(value.hasChildren, 'hasChildren'),
                        icon: $internalService.isFieldAvailable(value.icon, 'icon'),
                        id: $internalService.isFieldAvailable(value.id, 'id'),
                        items: $internalService.isFieldAvailable(value.items, 'items'),
                        pid: $internalService.isFieldAvailable(value.pid, 'pid'),
                        style: $internalService.isFieldAvailable(value.style, 'style'),
                        text: $internalService.isFieldAvailable(value.text, 'text'),
                        type: $internalService.isFieldAvailable(value.type, 'type')
                    }
                else
                    return {
                        enabled: 'enabled',
                        icon: 'icon',
                        id: 'id',
                        hasChildren: 'hasChildren',
                        pid: 'pid',
                        items: 'items',
                        style: 'style',
                        text: 'text',
                        type: 'type'
                    }
            }

            var updateMenuOptions = function (value) {
                if (value) {
                    menuOptions = {
                        controlStyle: updateControlStyle(value.style),
                        dataFields: getDataFields(value.dataFields),
                        enabled: $internalService.isFieldAvailable(value.enabled, true),
                        itemClick: $internalService.isFieldAvailable(value.itemClick, null),
                        itemIcon: $internalService.isFieldAvailable(value.itemIcon, ''),
                        items: $internalService.isFieldAvailable(value.items, []),
                        loadItem: null,
                        open: $internalService.isFieldAvailable(value.open, null),
                        openOnHover: $internalService.isFieldAvailable(value.openOnHover, true),
                        position: $internalService.isFieldAvailable(value.position, 'mouse'),
                        rtl: $internalService.isFieldAvailable(value.rtl, false),
                        activate: $internalService.isFieldAvailable(value.activate, 'rightclick'),
                        showIcons: $internalService.isFieldAvailable(value.showIcons, true)
                    }
                }
                else
                    menuOptions = {
                        controlStyle: updateControlStyle(),
                        dataFields: getDataFields(),
                        enabled: true,
                        itemClick: null,
                        itemIcon: '',
                        items: [],
                        loadItem: null,
                        open: null,
                        openOnHover: true,
                        position: 'mouse',
                        rtl: false,
                        activate: 'rightclick',
                        showIcons: true
                    }
            }

            var initData = $scope.$eval($attrs.iuiContextmenu);
            updateMenuOptions(initData);

            if (itemList)
                menuOptions.items = itemList;

            $attrs.$observe("menuUpdate", function (newValue, oldValue) {
                if (newValue != oldValue)
                    menuOptions.items = $scope.$eval($attrs.menuItems);
            });

            $scope.$watch($attrs.iuiContextmenu, function (newValue, oldValue) {
                if (newValue != oldValue)
                    updateMenuOptions(newValue);
            }, true);

            $scope.$on("$destroy", function (e) {
                $elem.unbind("contextmenu blur click");

                angular.element($window).unbind("blur click contextmenu keydown keyup");

                clearEvents();

                if (itemScope)
                    itemScope.$destroy();
            });
        }
    }]);
