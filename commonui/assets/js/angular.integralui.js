/*
  filename: angular.integralui.js
  version : 2.3.0
  Copyright © 2014-2015 Lidor Systems. All rights reserved.

  This file is part of the "IntegralUI" Library. 
                                                                   
  The contents of this file are subject to the IntegralUI Studio for Web License, and may not be used except in compliance with the License.
  A copy of the License should have been installed in the product's root installation directory or it can be found at
  http://www.lidorsystems.com/products/web/studio/license-agreement.aspx.
                                                            
  This SOFTWARE is provided "AS IS", WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language 
  governing rights and limitations under the License. Any infringement will be prosecuted under applicable laws.                           
*/

angular.module("integralui", [])
	// IntegralUI Transclude Directive ------------------------------------------------------
	.directive("iuiTransclude", ["$timeout", "IntegralUIInternalService", function($timeout, $internalService){
        return {
            link: linkFn
        }
        
        function linkFn($scope, $elem, $attrs){
			var $ctrl = null;
			
			var getParentCtrl = function(){
				var parentElem = $elem.parent();
				while (parentElem[0].tagName.toLowerCase() !== "body"){
					if (parentElem[0].attributes['name']){
						var ctrlName = parentElem[0].attributes['name'].value;
						$ctrl = $internalService.getCtrl(ctrlName);
						break;
					}
					parentElem = parentElem.parent();
				}
			}

			var initTimer = $timeout(function(){
				getParentCtrl();
				$timeout.cancel(initTimer);
			}, 1);


        	$scope.$watch(
        			function(){
        				if ($ctrl)
        					return $ctrl[$attrs.iuiTransclude];
        				else
        					return null;
        			},
        			function(newValue){
		        		$elem.empty();
		        		$elem.append(newValue);
        			}
        		);
        }
	}])
	// IntegralUI Focus Directive ------------------------------------------------------
	.directive("iuiFocus", ["$timeout", "IntegralUIInternalService", function($timeout, $internalService){
        return {
            restrict: "A",
            link: linkFn
        };
        
        function linkFn($scope, $elem, $attrs){
        	var params = {
        		active: false
        	}

			$scope.$watch($attrs.iuiFocus, function(newValue, oldValue){
				if (newValue != oldValue)
					updateParams(newValue);
			}, true);

			var updateParams = function(value){
				if (value)
					params = {
		        		active: $internalService.isFieldAvailable(value.active, false)
		        	} 
				else
					params = {
		        		active: false
		        	} 

				updateFocus();
			}

			var updateFocus = function(){
				if (params && params.active != false){
					var focusTimer = $timeout(function(){
						$elem[0].focus();
						$timeout.cancel(focusTimer);
					}, 1);
				}
			}

			updateParams($scope.$eval($attrs.iuiFocus));
       }
    }])

	// IntegralUI Resize Directive ------------------------------------------------------
	.directive("iuiResize", ["$window", "$timeout", "$interval", "IntegralUIInternalService", function($window, $timeout, $interval, $internalService){
        return {
            restrict: "A",
            link: linkFn
        };
        
        function linkFn($scope, $elem, $attrs, $listCtrl){
        	var parentElem = $elem.parent();
        	var windowElem = angular.element($window);
			var currentOpacity = getComputedStyle($elem[0]).opacity; 
			currentOpacity = !currentOpacity || currentOpacity == '' ? 1 : currentOpacity;
			$elem.css("opacity", "0");

			var parentSize = {
				width: parentElem[0].offsetWidth,
				height: parentElem[0].offsetHeight
			}
			
        	var defaultSizeParams = {
        		delay: 100,
        		height: parseInt(getComputedStyle($elem[0]).height, 10),
        		minHeight: 0,
        		minWidth: 0,
        		maxHeight: 9999999,
        		maxWidth: 9999999,
        		ref: 'window',
        		width: parseInt(getComputedStyle($elem[0]).width, 10)
        	}

        	var resizeParams = $scope.$eval($attrs.iuiResize);
        	var delay = resizeParams.delay != undefined ? resizeParams.delay : defaultSizeParams.delay;

			var updateElemSize = function(){
				resizeParams = $scope.$eval($attrs.iuiResize);
				if (resizeParams){
					var refObject = $internalService.isFieldAvailable(resizeParams.ref, defaultSizeParams.ref);
					var elemSize = {
						width: defaultSizeParams.width,
						height: defaultSizeParams.height
					}

					var sizeLimits = {
						minWidth: parseInt($internalService.isFieldAvailable(resizeParams.minWidth, defaultSizeParams.minWidth), 10),
						minHeight: parseInt($internalService.isFieldAvailable(resizeParams.minHeight, defaultSizeParams.minHeight), 10),
						maxWidth: parseInt($internalService.isFieldAvailable(resizeParams.maxWidth, defaultSizeParams.maxWidth), 10),
						maxHeight: parseInt($internalService.isFieldAvailable(resizeParams.maxHeight, defaultSizeParams.maxHeight), 10)
					}

					switch (refObject){
						case 'parent':
							var parentPadding = $internalService.getPadding(parentElem[0]);
							var parentClientSize = {
								width: parentElem[0].clientWidth - (parentPadding.left + parentPadding.right),
								height: parentElem[0].clientHeight - (parentPadding.top + parentPadding.bottom)
							}
							if (parentElem){
								if (resizeParams.width)
									elemSize.width = Math.floor(resizeParams.width * parentClientSize.width);

								if (resizeParams.height)
									elemSize.height = Math.floor(resizeParams.height * parentClientSize.height);
							}
							break;

						case 'page':
							if (resizeParams.width)
								elemSize.width = Math.floor(resizeParams.width * windowElem[0].innerWidth);

							if (resizeParams.height)
								elemSize.height = Math.floor(resizeParams.height * windowElem[0].innerHeight);
							break;

						default:
							if (resizeParams.width)
								elemSize.width = Math.floor(resizeParams.width * windowElem[0].outerWidth);

							if (resizeParams.height)
								elemSize.height = Math.floor(resizeParams.height * windowElem[0].outerHeight);
							break;
					}

					if (elemSize.width < sizeLimits.minWidth)
						elemSize.width = sizeLimits.minWidth;
					if (elemSize.width > sizeLimits.maxWidth)
						elemSize.width = sizeLimits.maxWidth;

					if (elemSize.height < sizeLimits.minHeight)
						elemSize.height = sizeLimits.minHeight;
					if (elemSize.height > sizeLimits.maxHeight)
						elemSize.height = sizeLimits.maxHeight;

	        		$elem.css("width", elemSize.width + "px");
	        		$elem.css("height", elemSize.height + "px");

	        		var resizeTimer = $timeout(function(){
			        	$scope.$apply();
	
		        		$timeout.cancel(resizeTimer);
	        		}, 1);
				}
			}

			var initTimer = $timeout(function(){
				updateElemSize();

				if (delay == 0)
					$elem.css("opacity", currentOpacity);
				else {
					var showInterval = currentOpacity / 3;
					var updateTimer = $interval(function(){
						if (showInterval > currentOpacity){
							$elem.css("opacity", currentOpacity);
							$interval.cancel(updateTimer);
						}
						else {
							$elem.css("opacity", showInterval / currentOpacity);
							showInterval += currentOpacity / 3;
						}
					}, 10);
				}

				$timeout.cancel(initTimer);
			}, delay);

			var sizeInterval = $interval(function(){
				resizeParams = $scope.$eval($attrs.iuiResize);
				var refObject = $internalService.isFieldAvailable(resizeParams.ref, defaultSizeParams.ref);

				if (refObject == 'parent' && parentElem[0].offsetWidth != parentSize.width || parentElem[0].offsetHeight != parentSize.height){
					updateElemSize();

					parentSize.width = parentElem[0].offsetWidth;
					parentSize.height = parentElem[0].offsetHeight;
				}
			}, delay);

			$scope.$watch($attrs.iuiResize, function(newValue, oldValue){
				if (newValue != oldValue)
					updateElemSize();
			}, true);

			windowElem.bind("resize", function(e){
				resizeParams = $scope.$eval($attrs.iuiResize);
				var refObject = $internalService.isFieldAvailable(resizeParams.ref, defaultSizeParams.ref);

				if (refObject != 'parent')
					updateElemSize();
			});
			
			$scope.$on("$destroy", function(e){
				if (sizeInterval)
					$interval.cancel(sizeInterval);
				
				if (windowElem)
					windowElem.unbind("resize");
			});
       }
    }])

	// IntegralUI Class Directive ------------------------------------------------------
	.directive("iuiClass", function(){
        return {
            restrict: "A",
            link: linkFn
        };
        
        function linkFn($scope, $elem, $attrs){
			$attrs.$observe("iuiClass", function(newValue, oldValue){
				if (newValue != oldValue){
					$elem.removeAttr("class");

					if (newValue != '')
						$elem.addClass(newValue);
				}
			});
       }
    })

	// IntegralUI Style Directive ------------------------------------------------------
	.directive("iuiStyle", function(){
        return {
            restrict: "A",
            link: linkFn
        };
        
        function linkFn($scope, $elem, $attrs){
			$attrs.$observe("iuiStyle", function(newValue, oldValue){
				if (newValue != oldValue){
					var styleAttr = newValue.split(';');
					for (var i = 0; i < styleAttr.length; i++){
						var currentAttr = styleAttr[i].split(':');
						if (currentAttr.length == 2)
							$elem.css(currentAttr[0], currentAttr[1]);
					}
				}
			});
       }
    })

	// IntegralUI Show Directive ------------------------------------------------------
	.directive("iuiShow", function(){
        return {
            restrict: "A",
            link: linkFn
        };
        
        function linkFn($scope, $elem, $attrs){
			$attrs.$observe("iuiShow", function(newValue, oldValue){
				if (newValue != oldValue){
					if (newValue != 'false'){
						if ($attrs.showDefault == 'true')
							$elem.css("display", "inline");
						else
							$elem.css("display", "block");
					}
					else
						$elem.css("display", "none");
				}
			});
       }
    })

	// IntegralUIPublicService -----------------------------------------------------------
	.factory("IntegralUIPublicService", function(){
		var tempData = null;

		return {
			clearTempData: function(){
				tempData = null;
			},
			
			getTempData: function(){
				return tempData;
			},
			
			setTempData: function(data){
				tempData = data;
			}
		}
	})
	// IntegralUIDataService -------------------------------------------------------------
 	.factory("IntegralUIDataService", function(){
		var constructor = function(obj){
			if (!obj)
				return null;
			
			var data = obj;
		    var dataFields = {
				content: 'content',
                icon: 'icon',
                id : 'id',
                pid : 'pid',
				objects: 'items',
                statusIcon: 'statusIcon',
                subobjects : 'subitems',
                text : 'text'
            }
			
			this.updateDataFields = function(value){
				if (value){
					dataFields = {
						content: value.content ? value.content : 'content',
						icon : value.icon ? value.icon : 'icon',
						id : value.id ? value.id : 'id',
						pid : value.pid ? value.pid : 'pid',
						objects: value.objects ? value.objects : 'items',
						statusIcon : value.statusIcon ? value.statusIcon : 'statusIcon',
						subobjects : value.subobjects ? value.subobjects : 'subitems',
						text : value.text ? value.text : 'text'
					}
				}
			}
			
			this.updateDataFields(data.fields);
			
			this.update = function(value){
				if (value){
					data = value;
					this.updateDataFields(data.fields);
				}
			}
			
			var isThereObjects = angular.isDefined(data.objects);
	
			// Add/Remove --------------------------------------------------------------------
			
			this.clear = function(parent, callback){
				var objList = this.getList(parent);
				if (objList.length > 0 && data.events)
					data.events.clear({ e: { parent: parent} });
					
				objList.length = 0;
							
				if (callback)
					callback(parent);
			}
			
			this.insertAt = function (obj, index, parent, callback) {
				this.insert(obj, index, parent, null, false, callback);
			}
			
			this.insert = function(obj, index, parent, refObject, flag, callback){
				if (isThereObjects){
					var allowAdd = data.events ? data.events.objAdding({ e: { obj: obj} }) : true;
					if (allowAdd !== false){
						if (obj){
							if (parent)
								obj[dataFields.pid] = parent[dataFields.id];
							else 
								obj[dataFields.pid] = '';
							
							var objList = this.getList(parent);

							if (index < 0 || index === null || index === undefined)
								objList.push(obj);
							else {
								index = Math.max(Math.min(index, objList.length), 0);
								if (!refObject && index < objList.length)
									refObject = objList[index];
								objList.splice(index, 0, obj);
							}
								
							if (!obj[dataFields.id])
								obj[dataFields.id] = this.getUniqueId();
							
							if (data.events)
								data.events.objAdded({ e: { obj: obj} });
							
							if (callback)
								callback();
						}
					}
				}
			}
			
			this.insertByRef = function(obj, refObject, flag, callback){
				if (isThereObjects && obj && refObject){
					var parent = this.getParent(refObject);
					var objList = this.getList(parent);
					var refIndex = this.getIndexOf(refObject, objList);
					if (flag)
						refIndex += 1;
					
					this.insert(obj, refIndex, parent, refObject, flag, callback);
					
					return refIndex;
				}        
			}
			
			this.removeAt = function(obj, index, parent, callback){
				if (isThereObjects){
					var objList = null;
					
					if (obj){
						parent = this.getParent(obj);
						objList = this.getList(parent);
						index = this.getIndexOf(obj, objList);
					}
				
					if (index === null || index === undefined)
						return false;
				
					objList = this.getList(parent);
					if (index >= 0 && index < objList.length){
						var objToRemove = objList[index];
						var allowRemove = data.events ? data.events.objRemoving({ e: { obj: objToRemove} }) : true;
						if (allowRemove !== false){
							objToRemove[dataFields.pid] = '';
							objList.splice(index, 1);
							
							if (data.events)
								data.events.objRemoved({ e: { obj: objToRemove} });
								
							if (callback)
								callback(objToRemove, objList, index, parent);
								
							return true;
						}
					}
				}
				
				return false;
			}

			this.isIndexinRange = function(index){
				return isThereObjects && index >= 0 && index < data.objects.length ? true : false;
			}
			
			this.moveObject = function(from, to){
				if (isThereObjects && this.isIndexinRange(from) && this.isIndexinRange(to))
					data.objects.splice(to, 0, data.objects.splice(from, 1)[0]);
			}
			
			this.getNewIndex = function(obj, refObject, flag){
				if (isThereObjects && obj && refObject){
					var parent = this.getParent(refObject);
					var objList = this.getList(parent);
					var refIndex = this.getIndexOf(refObject, objList);
					if (flag)
						refIndex += 1;
					
					return refIndex;
				}        
			}
			
			// General -----------------------------------------------------------------------

			this.getObjectByIndex = function(index){
				if (isThereObjects && this.isIndexinRange(index))
					return data.objects[index];
					
				return null;
			}
			
			this.findObjectById = function(id){
				return id ? searchObj(data.objects, id) : null;
			}		
			
			this.findObjectByText = function(text){
				return text ? searchObj(data.objects, text, "text") : null;
			}		
        
			var searchObj = function(list, value, type){
				var found = null;
				if (list && value){
					var i = 0;
                    var j = 0;
					var match = false;
				//	var results = [];
					while (!found && i < list.length){
						//var item = (list[i][dataFields.text]).toLowerCase();
						switch (type){
							case "text":
								if (list[i][dataFields.text]) {
                                    if(list[i][dataFields.text].toString().toLowerCase().indexOf(value.toString().toLowerCase()) > -1){
                                        //results.push(list[i]);
                                        match = true;

                                    }

								}

								break;

							default:
								if (list[i][dataFields.id])
									match = list[i][dataFields.id].toString() === value.toString();
								break;
						}

						found = match ? list[i] : searchObj(list[i][dataFields.objects], value, type);
						//found = results;
						//console.log(results);
						i++;
					}
				}

				return found;
			}

			this.getIndexOf = function(obj, list){
				var foundIndex = -1;
				
				if (!list)
					list = this.getList();
					
				if (obj && list){
					for (var i = 0; i < list.length; i++){
						if (list[i][dataFields.id] && obj[dataFields.id] && list[i][dataFields.id].toString() === obj[dataFields.id].toString()){
							foundIndex = i;
							break;
						}
					}
				}
				
				return foundIndex;
			}		

			this.getList = function(obj){
				if (obj)
				{
					if (!obj[dataFields.objects])
						obj[dataFields.objects] = [];

					return obj[dataFields.objects];
				}
				
				return data.objects;
			}
        
			this.findParent = function(obj, objList){
				var found = null;
				
				if (obj && objList){
					var i = 0;
					while (!found && i < objList.length){
						if (objList[i][dataFields.id] && obj[dataFields.pid] && objList[i][dataFields.id].toString() === obj[dataFields.pid].toString())
							found = objList[i];
						else
							found = this.findParent(obj, objList[i][dataFields.objects]); 
								
						i++;
					}
				}
				
				return found;
			}
	
			this.getParent = function(obj){
				return obj ? this.findParent(obj, data.objects) : null;
			}

			this.getUniqueId = function (separator) {
				var delimiter = separator || "-";

				function S4() {
					return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
				}

				return (S4() + S4() + delimiter + S4() + delimiter + S4() + delimiter + S4() + delimiter + S4() + S4() + S4());
			}
		}
		
		return constructor;
	})
	
	// IntegralUIDragDrop ----------------------------------------------------------------
	.factory("IntegralUIDragDrop", function(){
		var data = {
			dropPos: -1,
			source: null,
			sourceCtrl: null,
			sourceCollection: null,
			sourceIndex: -1,
			target: null,
			type: ''
		}
		
		var getDropPosHalf = function(pos, bounds, type){
			var innerBounds = {
				left: bounds.x,
				top: bounds.y,
				right: bounds.x + bounds.width,
				bottom: bounds.y + bounds.height
			}
				
			if (type === 'horizontal'){
				innerBounds.right = bounds.x + bounds.width / 2;
				
				if (checkHit(pos.x, pos.y, innerBounds))
					return 1;
				else {
					innerBounds.left = innerBounds.right;
					innerBounds.right = bounds.x + bounds.width;
				   
					if (checkHit(pos.x, pos.y, innerBounds))
						return 2;
				}
			}
			else {
				innerBounds.bottom = bounds.y + bounds.height / 2;
					
				if (checkHit(pos.x, pos.y, innerBounds))
					return 1;
				else {  
					innerBounds.top = innerBounds.bottom;
					innerBounds.bottom = bounds.y + bounds.height;
			
					if (checkHit(pos.x, pos.y, innerBounds))
						return 2;
				}
			}
			
			return -1;
		}
		
		var getDropPosHorizontal = function(pos, bounds){
			var innerBounds = {
				left: bounds.x + bounds.width / 4,
				top: bounds.y,
				right: bounds.x + 3 * bounds.width / 4,
				bottom: bounds.y + bounds.height
			}
				
			if (checkHit(pos.x, pos.y, innerBounds))
				return 0;
			else {  
				innerBounds.right = innerBounds.left;
				innerBounds.left = bounds.x;
			   
				if (checkHit(pos.x, pos.y, innerBounds))
					return 1;
				else {
					innerBounds.left = bounds.x + 3 * bounds.width / 4;
					innerBounds.right = bounds.x + bounds.width;
			
					if (checkHit(pos.x, pos.y, innerBounds))
						return 2;
				}
			}
			
			return -1;
		}
		
		var getDropPosVertical = function(pos, bounds){
			var innerBounds = {
				left: bounds.x,
				top: bounds.y + bounds.height / 4,
				right: bounds.x + bounds.width,
				bottom: bounds.y + 3 * bounds.height / 4
			}
				
			if (checkHit(pos.x, pos.y, innerBounds))
				return 0;
			else {  
				innerBounds.bottom = innerBounds.top;
				innerBounds.top = bounds.y;
			   
				if (checkHit(pos.x, pos.y, innerBounds))
					return 1;
				else {
					innerBounds.top = bounds.y + 3 * bounds.height / 4;
					innerBounds.bottom = bounds.y + bounds.height;
			
					if (checkHit(pos.x, pos.y, innerBounds))
						return 2;
				}
			}
			
			return -1;
		}
		
		var checkHit = function(x, y, bounds){
			if (x >= bounds.left &&
				x <= bounds.right &&
				y >= bounds.top &&
				y <= bounds.bottom)
				return true;
				
			return false;
		}
		
		return {
			clearData: function(){
				data = {
					dropPos: -1,
					source: null,
					sourceCtrl: null,
					sourceCollection: null,
					sourceIndex: -1,
					target: null,
					type: ''
				}
			},
			
			getData: function(){
				return data;
			},
			
			setData: function(value){
				if (value){
					if (!isNaN(value.dropPos))
						data.dropPos = value.dropPos;
					if (value.source)
						data.source = value.source;
					if (value.sourceCtrl)
						data.sourceCtrl = value.sourceCtrl;
					if (value.sourceCollection)
						data.sourceCollection = value.sourceCollection;
					if (!isNaN(value.sourceIndex))
						data.sourceIndex = value.sourceIndex;
					if (value.target)
						data.target = value.target;
					if (value.type)
						data.type = value.type;
				}
			},
		
			hitTest: function(x, y, bounds){
				return checkHit(x, y, bounds);
			},
					
			getDropPos: function(pos, bounds, flag, type){
				if (flag)
					return getDropPosHalf(pos, bounds, type);
				else if (type === 'horizontal')
					return getDropPosHorizontal(pos, bounds);
				
				return getDropPosVertical(pos, bounds);
			}
		}
	})

	// IntegralUIInternalService -------------------------------------------------------------
	.factory("IntegralUIInternalService", ["$rootScope", "$window", function($rootScope, $window){
		var tempData = null;

		return {
		
			getCtrl: function(name){
				$rootScope.$broadcast(name+"-get-ctrl");
				var ctrl = this.getTempData();
				this.clearTempData();

				return ctrl ? ctrl : null;
			},
			
			getUniqueId: function (length, separator) {
				var delimiter = separator || "-";

				function S4() {
					return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
				}

				var retValue = (S4() + S4() + delimiter + S4() + delimiter + S4() + delimiter + S4() + delimiter + S4() + S4() + S4());

				if (length)
					retValue = retValue.substring(0, length);

				return retValue;
			},
			
			isBoolean: function(value){
				return value ? typeof value == 'boolean' : false;
			},
		
			isEnabled: function(value){
				return value || value === undefined ? true : false;
			},

			isEqual: function(first, second){
				if (first && second)
					return first.toString() === second.toString();
				
				return false;
			},

			isFieldAvailable: function(field, value){
				return field != undefined ? field : value;
			},
			
			isImage: function(value){
				return value ? value instanceof HTMLImageElement : false;
			},
			
			isNumber: function(value){
				return value ? typeof value == 'number' : false;
			},
			
			isObject: function(value){
				return value ? typeof value == 'object' && value != null && !Array.isArray(value) : false;
			},
		
			isPercent: function(value){
				if (value){
					var str = value.toString();

					if (str.substring(str.length-1) == '%')
						return true;

				}

				return false;
			},

			isSelected: function(obj){
				return obj && obj.selected ? true : false;
			},
			
			isString: function(value){
				return value ? typeof value == 'string' || value instanceof String : false;
			},

			// General -------------------------------------------------------------------
			
			clearTempData: function(){
				tempData = null;
			},
			
			getTempData: function(){
				return tempData;
			},
			
			setTempData: function(data){
				tempData = data;
			},

			getBodyElem: function(obj){
				var elem = null;
				while (obj){
					if (obj === document.getElementsByTagName("body")[0]){
						elem = obj;
						break;
					}

					obj = obj.offsetParent;
				}
			
				return elem;
			},
			
			// Coordinates ---------------------------------------------------------------
		
			checkHit: function(x, y, bounds){
				if (x >= bounds.left &&
					x <= bounds.right &&
					y >= bounds.top &&
					y <= bounds.bottom)
					return true;
					
				return false;
			},

			getBorderWidth: function(elem){
				if (elem)
					return {
						top: parseInt(getComputedStyle(elem)['border-top-width'], 10),
						right: parseInt(getComputedStyle(elem)['border-right-width'], 10),
						bottom: parseInt(getComputedStyle(elem)['border-bottom-width'], 10),
						left: parseInt(getComputedStyle(elem)['border-left-width'], 10)
					}

				return { top: 0, right: 0, bottom: 0, left: 0 }
			},

			getMargin: function(elem){
				if (elem)
					return {
						top: parseInt(getComputedStyle(elem)['margin-top'], 10),
						right: parseInt(getComputedStyle(elem)['margin-right'], 10),
						bottom: parseInt(getComputedStyle(elem)['margin-bottom'], 10),
						left: parseInt(getComputedStyle(elem)['margin-left'], 10)
					}

				return { top: 0, right: 0, bottom: 0, left: 0 }
			},

			getPadding: function(elem){
				if (elem)
					return {
						top: parseInt(getComputedStyle(elem)['padding-top'], 10),
						right: parseInt(getComputedStyle(elem)['padding-right'], 10),
						bottom: parseInt(getComputedStyle(elem)['padding-bottom'], 10),
						left: parseInt(getComputedStyle(elem)['padding-left'], 10)
					}

				return { top: 0, right: 0, bottom: 0, left: 0 }
			},

			getMousePos: function(e){
				return {
					x: e.pageX ? e.pageX : e.originalEvent ? e.originalEvent.pageX : 0,
					y: e.pageY ? e.pageY : e.originalEvent ? e.originalEvent.pageY : 0
				}
			},

			getClientMousePos: function(e, elem){
				if (e && elem){
					elem = angular.element(elem);
					var boundRect = elem[0].getBoundingClientRect();
					
					var shiftPos = {
						x: angular.element($window)[0].pageXOffset,
						y: angular.element($window)[0].pageYOffset
					}
					
					var mousePos = this.getMousePos(e);
					mousePos.x -= (boundRect.left + shiftPos.x);
					mousePos.y -= (boundRect.top + shiftPos.y);

					return mousePos;
				}

				return { x: 0, y: 0 };
			},

			getPageRect: function(elem){
				if (elem){
					elem = angular.element(elem);
					var boundRect = elem[0].getBoundingClientRect();

					var shiftPos = {
						x: angular.element($window)[0].pageXOffset,
						y: angular.element($window)[0].pageYOffset
					}
					
					boundRect.left -= shiftPos.x;
					boundRect.top -= shiftPos.y;
					boundRect.right = boundRect.left + boundRect.width;
					boundRect.bottom = boundRect.top + boundRect.height;

					return boundRect;
				}
				
				return { left: 0, top: 0, right: 0, bottom: 0};
			}
		}
	}]);


