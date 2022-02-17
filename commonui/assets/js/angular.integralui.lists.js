/*
  filename: angular.integralui.lists.js
  version : 2.2.0
  Copyright © 2014-2015 Lidor Systems. All rights reserved.

  This file is part of the "IntegralUI" Library. 
                                                                   
  The contents of this file are subject to the IntegralUI Studio for Web License, and may not be used except in compliance with the License.
  A copy of the License should have been installed in the product's root installation directory or it can be found at
  http://www.lidorsystems.com/products/web/studio/license-agreement.aspx.
                                                            
  This SOFTWARE is provided "AS IS", WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language 
  governing rights and limitations under the License. Any infringement will be prosecuted under applicable laws.                           
*/

angular.module("integralui")
	// IntegralUIFilter -----------------------------------------------------------
	.factory("IntegralUIFilter", function(){
		var isString = function(value){
			return value ? typeof value == 'string' || value instanceof String : false;
		}

		var isFilterCondition = function(symbol){
			if (symbol == 'a' || symbol == 'b' || symbol == 'c' || symbol == 'd' || symbol == 'e' || symbol == 'f' || symbol == 'g' || symbol == 'h' || symbol == 'i' || symbol == 'j' || symbol == 'k' || symbol == 'l' || symbol == 'm' ||
				symbol == 'n' || symbol == 'o' || symbol == 'p' || symbol == 'q' || symbol == 'r' || symbol == 's' || symbol == 't' || symbol == 'u' || symbol == 'v' || symbol == 'w' || symbol == 'x' || symbol == 'y' || symbol == 'z')
					return true;

			return false;
		}


		var beginsWith = function(value, match){
			if (value != undefined && match != undefined && isString(value) && isString(match)){
				if (value.length >= match.length){
					if (value.substring(0, match.length) == match)
						return true;
				}
			}

			return false;
		}

		var endsWith = function(value, match){
			if (value != undefined && match != undefined && isString(value) && isString(match)){
				if (value.length >= match.length){
					if (value.substring(value.length - match.length, value.length) == match)
						return true;
				}
			}

			return false;
		}

		var getFilterCondition = function(conditionList, symbol){
			var symbolList = 'abcdefghijklmnopqrstuvwxyz';
			var index = symbolList.indexOf(symbol);

			return conditionList && index >= 0 && index < conditionList.length ? conditionList[index] : null;
		}

		var createFilterNode = function(){
			var node = {
				result: false
			}

			return node;
		}

		var setFilterNode = function(node, conditionList, symbol, negative){
			var conditionNode = createFilterNode();
			conditionNode.condition = getFilterCondition(conditionList, symbol);
			conditionNode.negative = negative;

			if (!node.left)
				node.left = conditionNode;
			else if (!node.right)
				node.right = conditionNode;
		}

		var getMatchResult = function(value, operation, match, negative){
			var result = false;

			if (value != undefined && match != undefined){
				switch (operation){
					case '>':
						result = value > match;
						break;

					case '>=':
						result = value >= match;
						break;

					case '<':
						result = value < match;
						break;

					case '<=':
						result = value <= match;
						break;

					case '=':
						result = value == match;
						break;

					case '!=':
						result = value != match;
						break;

					case '<>':
						result = value != match;
						break;

					case '->':
						result = beginsWith(value, match);
						break;

					case '<-':
						result = endsWith(value, match);
						break;

					case '><':
						result = isString(value) ? value.indexOf(match) > -1 : false;
						break;

					case '[]':
						result = isString(value) ? value.indexOf(match) > -1 : false;
						break;
				}

				if (negative == true)
					result = !result;
			}

			return result;
		}

		var getFilterResult = function(value, condition, negative){
			if (Array.isArray(condition.value)){
				var resultList = [];
				for (var k = 0; k < condition.value.length; k++){
					resultList.push(getMatchResult(value, condition.operation, condition.value[k], negative));
				}

				var res = true;
				if (condition.join == '&'){
					for (var k = 0; k < resultList.length; k++)
						res = res && resultList[k];
				}
				else {
					res = false;
					for (var k = 0; k < resultList.length; k++)
						res = res || resultList[k];
				}

				return res;
			}

			return getMatchResult(value, condition.operation, condition.value, negative);
		}

		var	applyFilter = function(value, tree){
			if (tree){
				var rootNode = tree;
				var currentNode = rootNode;

				if (currentNode.left){
					if (currentNode.left.condition)
						currentNode.left.result = getFilterResult(value, currentNode.left.condition, currentNode.left.negative);
					else {
						currentNode = currentNode.left;
						applyFilter(value, currentNode);
					}
				}

				currentNode = rootNode;
				if (currentNode.right){
					if (currentNode.right.condition)
						currentNode.right.result = getFilterResult(value, currentNode.right.condition, currentNode.right.negative);
					else {
						currentNode = currentNode.right;
						applyFilter(value, currentNode);
					}
				}

				if (rootNode.operator == '&'){
					rootNode.result = true;
					if (rootNode.left)
						rootNode.result = rootNode.result && rootNode.left.result;
					if (rootNode.right)
						rootNode.result = rootNode.result && rootNode.right.result;
				}
				else{
					rootNode.result = false;
					if (rootNode.left)
						rootNode.result = rootNode.result || rootNode.left.result;
					if (rootNode.right)
						rootNode.result = rootNode.result || rootNode.right.result;
				}

				return rootNode.result;
			}

			return true;
		}

		return {

			createTree: function(conditionList, formula){
				if (formula){
					var rootNode = createFilterNode();
					var currentNode = rootNode;
					var childNode = null;
					var negativeActive = false;

					for (var i = 0; i < formula.length; i++){
						if (isFilterCondition(formula[i])){
							setFilterNode(currentNode, conditionList, formula[i], negativeActive);
						}
						else if (formula[i] == '&' || formula[i] == '|'){
							negativeActive = false;
							currentNode.operator = formula[i];
						}
						else if (formula[i] == '!')
							negativeActive = true;
						else if (formula[i] == '('){
							negativeActive = false;
							childNode = createFilterNode();
							childNode.parent = currentNode;
							currentNode = childNode;
						}
						else if (formula[i] == ')'){
							negativeActive = false;
							if (currentNode.parent){
								if (!currentNode.parent.left)
									currentNode.parent.left = currentNode;
								else if (!currentNode.parent.right)
									currentNode.parent.right = currentNode;
							}

							currentNode = currentNode.parent;
						}
					}

					return rootNode;
				}

				return null;
			},

			match: function(value, conditions, formula, tree){
				if (Array.isArray(conditions)){
					if (!tree)
						tree = this.createTree(conditions, formula);

					return applyFilter(value, tree);
				}

				var negative = conditions ? conditions.negative : false;

				return getFilterResult(value, conditions, negative);
			},

			filter: function(list, field, conditions, formula, tree){
				var result = [];

				if (list && Array.isArray(list)){
					for (var i = 0; i < list.length; i++){
						var currentObj = field ? list[i][field] : list[i];

						if (this.match(currentObj, conditions, formula, tree))
							result.push(list[i]);
					}
				}

				return result;
			}
		}
	})

	// IntegralUIListCtrlService ---------------------------------------------------------
 	.factory("IntegralUIListCtrlService", ["$rootScope", "IntegralUIPublicService", function($rootScope, $publicService){
		return {

			// Add/Remove ----------------------------------------------------------------
		
			addItem: function(name, item){
				$rootScope.$broadcast(name+"-add-item", item);
			},
		
			clearItems: function(name){
				$rootScope.$broadcast(name+"-clear-items");
			},
		
			insertItemAt: function(name, item, index){
				$rootScope.$broadcast(name+"-insert-item-at", item, index);
			},
		
			insertItemBefore: function(name, item, refItem){
				$rootScope.$broadcast(name+"-insert-item-before", item, refItem);
			},
		
			insertItemAfter: function(name, item, refItem){
				$rootScope.$broadcast(name+"-insert-item-after", item, refItem);
			},
		
			removeItem: function(name, item){
				$rootScope.$broadcast(name+"-remove-item", item);
			},
		
			removeItemAt: function(name, index){
				$rootScope.$broadcast(name+"-remove-item-at", index);
			},
		
			// Data ----------------------------------------------------------------------
		
			loadData: function(name, data, fields){
				$rootScope.$broadcast(name+"-load-data", data, fields);
			},
		
			// Find ----------------------------------------------------------------------

			findItemById: function(name, id){
				$rootScope.$broadcast(name+"-find-item-by-id", id);
				var item = this.getTempData();
				this.clearTempData();
				
				return item ? item : null;
			},
			
			findItemByText: function(name, text){
				$rootScope.$broadcast(name+"-find-item-by-text", text);
				var item = this.getTempData();
				this.clearTempData();
				
				return item ? item : null;
			},
		
			// Focus ---------------------------------------------------------------------
		
			focus: function(name, item){
				$rootScope.$broadcast(name+"-focus", item);
			},
		
			// General -------------------------------------------------------------------
		
			ensureVisible: function(name, item, pos){
				$rootScope.$broadcast(name+"-ensure-visible", item, pos);
			},
			
			getCheckList: function(name, value){
				$rootScope.$broadcast(name+"-get-check-list", value);
				var list = $publicService.getTempData();
				$publicService.clearTempData();
				
				return list ? list : [];
			},
			
			getList: function(name){
				$rootScope.$broadcast(name+"-get-list");
				var list = $publicService.getTempData();
				$publicService.clearTempData();
				
				return list ? list : [];
			},
			
			// Selection -----------------------------------------------------------------
		
			selectedItem: function(name, item){
				if (item)
					$rootScope.$broadcast(name+"-set-selected-item", item);
				else {
					$rootScope.$broadcast(name+"-get-selected-item");
					var selItem = $publicService.getTempData();
					$publicService.clearTempData();
					
					return selItem ? selItem : null;
				}
			},
		
			selectedItems: function(name){
				$rootScope.$broadcast(name+"-get-selected-items");
				var selItems = $publicService.getTempData();
				$publicService.clearTempData();
				
				return selItems ? selItems : null;
			},

			// Scrolling -----------------------------------------------------------------
		
			scrollTo: function(name, item, pos){
				$rootScope.$broadcast(name+"-scroll-to", item, pos);
			},

			// Update --------------------------------------------------------------------
			
			refresh: function(name, obj){
				$rootScope.$broadcast(name+"-refresh", obj);
			},
			
			resumeLayout: function(name){
				$rootScope.$broadcast(name+"-resume-layout");
			},
			
			suspendLayout: function(name){
				$rootScope.$broadcast(name+"-suspend-layout");
			},
			
			updateLayout: function(name){
				$rootScope.$broadcast(name+"-update-layout");
			},
			
			updateView: function(name){
				$rootScope.$broadcast(name+"-update-view");
			}
		}
	}])

	// IntegralUIListService -------------------------------------------------------------
 	.factory("IntegralUIListService", ["$rootScope", function($rootScope){
		var tempData = null;
		
		return {

			// Add/Remove ----------------------------------------------------------------
		
			addItem: function(name, item, parent){
				$rootScope.$broadcast(name+"-add-item", item, parent);
			},
		
			clearItems: function(name, parent){
				$rootScope.$broadcast(name+"-clear-items", parent);
			},
		
			insertItemAt: function(name, item, index){
				$rootScope.$broadcast(name+"-insert-item-at", item, index);
			},
		
			insertItemBefore: function(name, item, refItem){
				$rootScope.$broadcast(name+"-insert-item-before", item, refItem);
			},
		
			insertItemAfter: function(name, item, refItem){
				$rootScope.$broadcast(name+"-insert-item-after", item, refItem);
			},
		
			removeItem: function(name, item){
				$rootScope.$broadcast(name+"-remove-item", item);
			},
		
			removeItemAt: function(name, index){
				$rootScope.$broadcast(name+"-remove-item-at", index);
			},
		
			// General -------------------------------------------------------------------
			
			clearTempData: function(){
				tempData = null;
			},
		
			ensureVisible: function(name, item){
				$rootScope.$broadcast(name+"-ensure-visible", item);
			},
			
			getTempData: function(){
				return tempData;
			},
			
			setTempData: function(data){
				tempData = data;
			},

			// Selection -----------------------------------------------------------------
		
			selectedItem: function(name, item){
				if (item)
					$rootScope.$broadcast(name+"-set-selected-item", item);
				else {
					$rootScope.$broadcast(name+"-get-selected-item");
					var selItem = this.getTempData();
					this.clearTempData();
					
					return selItem ? selItem : null;
				}
			},
		
			selectedItems: function(name){
				$rootScope.$broadcast(name+"-get-selected-items");
				var selItems = this.getTempData();
				this.clearTempData();
				
				return selItems ? selItems : null;
			}
		}
	}])

	// Filters ---------------------------------------------------------------------------
	.filter('pagination', function(){
		return function(input, curPage, itemsPerPage){
			curPage = parseInt(curPage, 10);
			itemsPerPage = parseInt(itemsPerPage, 10);
			
			curPage = curPage <= 0 ? 1 : curPage;
			var start = (curPage-1) * itemsPerPage;
			
			return input.slice(start, start+itemsPerPage);
		};
	});


