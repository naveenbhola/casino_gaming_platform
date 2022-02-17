import {FlatTreeControl} from '@angular/cdk/tree';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  AfterViewInit, AfterViewChecked
} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {ActivatedRoute, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {AppService} from '../../app.service';
import {ITopologyNodes, TopologytreeService} from '../../services/topologytree.service';
import {CageService} from '../../services/cage.service';
import {CasinomanagerService} from '../../services/casinomanager.service';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatDialog} from '@angular/material/dialog';
import {MatMenuTrigger} from '@angular/material/menu';
import {MatSnackBar} from '@angular/material/snack-bar';
import {
  CommonTranslationService,
  TopologyService,
  AppAddNodeTopologyComponent,
  dialogSize,
  tableUIProtocol,
  tableUIPort,
  webServerDNS,
  protocol,
  webCasinoManagerTLSPort
} from 'common-ui';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {DragDropItemFlatNode, DragDropItemNode, TreeDragDropItemDataBase} from './topology-dragdrop-database';
import {TranslateService} from '@ngx-translate/core';
import {urls, DecodedTokenService} from 'common-ui';
import {HttpParams} from '@angular/common/http';
import {JwtHelperService} from '@auth0/angular-jwt';
import {CreateVirtualGroupComponent} from '../create-virtual-group/create-virtual-group';
import {NGXLogger} from 'ngx-logger';
import {WDTSUtility} from '../../utils/wdts-utils';

@Component({
  selector: 'topology-tree',
  templateUrl: 'topology-tree.component.html',
  styleUrls: ['topology-tree.component.scss'],
  providers: [TreeDragDropItemDataBase]
})
export class TopologyTreeComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = {x: '0px', y: '0px'};
  routeParams;
  globalObj;

  /* Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<DragDropItemFlatNode, DragDropItemNode>();
  /* Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<DragDropItemNode, DragDropItemFlatNode>();
  treeControl: FlatTreeControl<DragDropItemFlatNode>;
  treeFlattener: MatTreeFlattener<DragDropItemNode, DragDropItemFlatNode>;
  /* Drag and drop */
  dragNode: any;
  dragNodeExpandOverWaitTimeMs = 300;
  dragNodeExpandOverNode: any;
  dragNodeExpandOverTime: number;
  dragNodeExpandOverArea: string;
  @ViewChild('emptyItem') emptyItem: ElementRef;
  @Input() arrTrees: Array<any>;
  topologyTreeConfig = urls.topologyTree;
  assignedDataSource: MatTreeFlatDataSource<DragDropItemNode, DragDropItemFlatNode>;
  unassignedDataSource: MatTreeFlatDataSource<DragDropItemNode, DragDropItemFlatNode>;
  accessGroupDataSource: MatTreeFlatDataSource<DragDropItemNode, DragDropItemFlatNode>;
  virtualGroupDataSource: MatTreeFlatDataSource<DragDropItemNode, DragDropItemFlatNode>;
  arrNestedDataSource = [];
  virtualGroupNodesLength: number;
  virtualDataNodes: any;
  nodeNames: any;
  searchText: string;
  isEditable = false;
  nodeToEdit: string;
  changedName: string;
  currentClickedNode: any;
  isGroupNameInvalid = false;
  selectedNode: string;
  selectedVGNode;
  @Output() addNode = new EventEmitter();
  @Input() permissionToAccess = true;
  trsTypesNotAllowedInVg = [500, 510, 520, 1100];

  @Input('cdkTreeNodePadding')
  treeIndent: number = 20;
  // Subscribers
  languageChanged;
  nodeUpdated;
  nodeSubs;
  globlObjSub;
  initializedSub;
  nodeUpdateSub;
  dataChangeAssignedSub;
  dataChangeUnassignedSub;
  dataChangeAGSub;
  dataChnageAG_1;
  topoNodeUnassignSub;
  topoIniSub_1;
  topInitialSub;
  deleteVGSub;
  updateVGSub_1;
  updateVGSub_2;
  getVGroupSubs;
  updateVGSub;

  constructor(private router: Router,
              public appService: AppService,
              private database: TreeDragDropItemDataBase,
              public _topologyTreeService: TopologytreeService,
              private _topologyService: TopologyService,
              public snackBar: MatSnackBar,
              public dialog: MatDialog,
              public fb: FormBuilder,
              private translate: TranslateService,
              private decodedTokenService: DecodedTokenService,
              private jwtHelper: JwtHelperService,
              private nGXLogger: NGXLogger) {
    this.getClickedNode();
    this.initTreeData();

    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<DragDropItemFlatNode>(this.getLevel, this.isExpandable);
    this.handleSubscribers();
    this.addFormValidations();
  }

  public virtualGroupForm = this.fb.group({});
  public virtualGroupEditForm = this.fb.group({});


  addFormValidations() {
    this.virtualGroupForm.addControl('groupName', new FormControl('', [Validators.required, Validators.maxLength(20)]));
    this.virtualGroupEditForm.addControl('groupParentName', new FormControl('', [Validators.required, Validators.maxLength(20)]));
  }

  ngOnInit() {
    this.initFunction();
    this.arrTrees = [
      {treegroup: 'assignednode', isPlusIconToShow: false, label: 'application.app.CONFIGURATION_LABELS.TABTEXT.AREAS'},
      {treegroup: 'virtualgroup', isPlusIconToShow: true, label: 'application.app.common.labels.VIRTUAL_GROUP'}
    ];
  }

  getClickedNode() {
    this.nodeSubs = this._topologyService.nodeClicked.subscribe((obj) => {
      if (obj.nodeClicked.dataSourceName === 'accessgroup') {
        const urlForVirtual = '/overview/virtualGroup/' + obj.topologyGroupId + '/' + this.globalObj.gamingDay;
        this.router.navigate([urlForVirtual]).then(res => {
        }, err => {
          this.nGXLogger.log(err);
        });
      } else {
        const response = this.appService.createRouteUrl(obj);
        if (response !== 'CAGE_AREAS' && response !== 'CAGE') {
          this.router.navigate([response]).then(res => {
          }, err => {
            this.nGXLogger.log(err);
          });
        }
      }
    });
  }

  initTreeData() {
    this.globlObjSub = this.appService.broadcastGlobalObj.subscribe(globalObj => {
      if (this._topologyService.topologyNodes) {
        this.globalObj = globalObj;
      } else {
        this.initializedSub = this._topologyService.initialized.subscribe(res => {
          this.globalObj = globalObj;
        });
      }
    });
  }

  initFunction() {
    this.nodeUpdateSub = this._topologyService.nodeUpdated.subscribe((data) => {
      if (data.msg === 'updateChangeLabel') {
        this.updateTopologyNodes(data.res[0]);
        this.updateNodeNames(data.res[0]);
        this._getAssignedNodes();
      }
    });
    if (!this._topologyService.topologyNodes) {
      this.assignTreeObject();
      this._setUnassignedNodes();
      this._setVirtualGroupNodes();
      this._getAssignedNodes();
      this._createDataSources();
      this.databaseSubscriber();
    } else {
      this.assignTreeObject();
      this.setAssignedNodes(this._topologyService.topologyNodes);
      this.createVirtualGroupNodes(this._topologyService.virtualGroupNodes);
      this.database.dataChangeUnassigned.next(this._topologyService.unAssignedNodes);
      this.nodeNames = this._topologyService.topologyNodeNames;
      this.databaseSubscriber();
      this._createDataSources();
    }
  }

  handleSubscribers() {
    this.nodeUpdated = this._topologyService.nodeUpdated
      .subscribe((res) => {
        if (res.msg === 'createNode') {
          this.addNodeToTopology(res);
          this.handleClick(this.currentClickedNode.node, this.currentClickedNode.nodeDetails);
        }
        if (res.msg === 'createVirtualGroup') {
          const isExist = this.groupAlreadyExists(res.res[0]);
          if (isExist) {
            this.nodeUpdated.unsubscribe();
            return;
          } else {
            this.addVirtualGroupToTopology(res.res);
          }
        }
      });
    const language = sessionStorage.getItem('language');
    if (language) {
      this.translate.setDefaultLang(language);
    }
    this.languageChanged = this.appService.languageChanged
      .subscribe((translation) => {
        this.translate.setDefaultLang(translation);
      });
  }

  groupAlreadyExists(node) {
    let isNodePresent = false;
    for (let i = 0, iLen = this._topologyService.virtualGroupNodes.length; i < iLen; i++) {
      const accessNode = this._topologyService.virtualGroupNodes[i];
      if (accessNode.groupName === node.groupName) {
        isNodePresent = true;
      }
    }
    return isNodePresent;
  }

  addVirtualGroupToTopology(res) {
    this._topologyService.virtualGroupNodes.push(res[0]);
    this._topologyService.virtualGroupNodes.sort(WDTSUtility.compareValues('groupName'));
    this.createVirtualGroupNodes(this._topologyService.virtualGroupNodes);
  }

  // updateVirtualGroup: updates the tree structure of access group nodes
  updateVirtualGroup() {
    this._topologyService.virtualGroupNodes.sort(WDTSUtility.compareValues('groupName'));
    this.createVirtualGroupNodes(this._topologyService.virtualGroupNodes);
    this.databaseSubscriber();
    this._createDataSources();
  }

  addNodeToTopology(newNode) {
    if (!this._topologyService.topologyNodes[newNode.res[0].parentNodeId]) {
      this._topologyService.topologyNodes[newNode.clickNode.nodeId] = newNode.res;
    }
    if (!this._topologyService.topologyNodeNames[newNode.res[0].nodeId]) {
      this._topologyService.topologyNodeNames[newNode.res[0].nodeId] = newNode.res[0];
    }
    if (!this._topologyService.topologyNodeNames[newNode.res[0].parentNodeId].children) {
      this._topologyService.topologyNodeNames[newNode.res[0].parentNodeId].children = [];
    }
    this._topologyService.topologyNodeNames[newNode.res[0].parentNodeId].children.push(newNode.res[0]);
    const assignData = this._topologyService.topologyNodes;
    this._topologyService.topologyNodeNames = this._topologyService.createNodeNamesObject(this._topologyService.topologyNodes);
    this._topologyService.siteChildren = this._topologyService.getSiteChildren(this._topologyService.topologyNodeNames);
    this.setAssignedNodes(assignData);
    this.nodeNames = this._topologyService.topologyNodeNames;
    this.databaseSubscriber();
    this._createDataSources();
  }

  updateEventObj(obj) {
    this.addNode.emit(obj);
  }

  openCreateVG() {
    const listOfSites = this.getAllSitesInTopology();
    let dialog = this.dialog.open(CreateVirtualGroupComponent, {
      width: dialogSize.small,
      data: {
        listOfSites: listOfSites
      }
    }).afterClosed().subscribe(res => {
      dialog = null;
    });
  }

  getAllSitesInTopology() {
    const arrListOfSites = [];
    for (const node in this._topologyService.topologyNodeNames) {
      if (150 === this.getTopologyTypeFromId(this._topologyService.topologyNodeNames[node].nodeId)) {
        arrListOfSites.push({'name': this._topologyService.topologyNodeNames[node]});
      }
    }
    return arrListOfSites;
  }

  private assignTreeObject() {
    this.assignedDataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.unassignedDataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.accessGroupDataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.virtualGroupDataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  }

  private databaseSubscriber() {
    this.dataChangeAssignedSub = this.database.dataChangeAssigned.subscribe(data => {
      this.assignedDataSource.data = [];
      this.assignedDataSource.data = data;
      this.treeControl.expandAll();
    });
    this.dataChangeUnassignedSub = this.database.dataChangeUnassigned.subscribe(data => {
      this.unassignedDataSource.data = [];
      this.unassignedDataSource.data = data;
      this.treeControl.expandAll();
    });
    this.dataChangeAGSub = this.database.dataChangeAG.subscribe(data => {
      this.accessGroupDataSource.data = [];
      this.accessGroupDataSource.data = data;
      this.treeControl.expandAll();
    });
    this.dataChnageAG_1 = this.database.dataChangeAG.subscribe(data => {
      this.virtualGroupDataSource.data = data;
      this.treeControl.expandAll();
    });
  }

  /*
   * this function create data source for different group of nodes.
   */
  private _createDataSources() {
    this.arrNestedDataSource['assignednode'] = this.assignedDataSource;
    this.arrNestedDataSource['unassignednode'] = this.unassignedDataSource;
    this.arrNestedDataSource['accessgroup'] = this.accessGroupDataSource;
    this.arrNestedDataSource['virtualgroup'] = this.virtualGroupDataSource;
  }

  /*
   * this function set unassigned data and create the tree for unassigned nodes.
   */
  private _setUnassignedNodes() {
    const unassignedItemsArr = [];
    if (!this._topologyService.unAssignedNodes) {
      this.topoNodeUnassignSub = this._topologyTreeService.getTopologyNodeUnassigned(this.topologyTreeConfig.unassignedNondeUrl).subscribe(
        (unassignedresponse) => {
          const childNodes = [];
          if (unassignedresponse.length > 0) {
            const params = new HttpParams().set('parentId', unassignedresponse[0].nodeId);
            this._topologyTreeService.getTopologyNodeByNodeId
            (this.topologyTreeConfig.topologyNodesUrls, params).subscribe((response) => {
              for (const item of response) {
                unassignedItemsArr.push(item);
                childNodes.push(item.name);
              }
              this._topologyService.unassignedNodesArr = unassignedItemsArr;
              const dataUnassigned = this.database.buildFileTree(childNodes, 0, 'unassignednode');
              this._topologyService.unAssignedNodes = dataUnassigned;
              this.database.dataChangeUnassigned.next(dataUnassigned);
            });
          }
        }
      );
    } else {
      this.database.dataChangeUnassigned.next(this._topologyService.unAssignedNodes);
    }
  }


  /*
   * this function set Virtual group data and create the tree for accessgroup nodes.
   */
  private _setVirtualGroupNodes() {
    const jwtToken = this.decodedTokenService.getDecodedJwtToken();
    if (!this._topologyService.virtualGroupNodes) {
      this.topoIniSub_1 = this._topologyService.initialized.subscribe((value) => {
        if (value === 'nodesInitialized') {
          this.getVGroupSubs = this._topologyService.getVirtualGroups(jwtToken.userId || jwtToken.userId).subscribe((response) => {
            const agresponse = this._topologyService.virtualGroupNodes = response;
            this.appService.virtualGroupNodes = this._topologyService.virtualGroupNodes;
            this.createVirtualGroupNodes(agresponse);
          });
        }
      });
    } else {
      this.createVirtualGroupNodes(this._topologyService.virtualGroupNodes);
    }
  }

  private createVirtualGroupNodes(agresponse) {
    const topologyIds = new Map<string, string[]>();
    this.virtualGroupNodesLength = agresponse.length;
    for (const ag of agresponse) {
      if (ag.topologyNodeIds.length > 0) {
        const childArr = [];
        for (let i = 0, iLen = ag.topologyNodeIds.length; i < iLen; i++) {
          const childId = ag.topologyNodeIds[i];
          const childNode = this._topologyService.topologyNodeNames[childId];
          if (childNode) {
            childArr.push(childNode.name);
          }
        }
        childArr.sort(function (a, b) {
          return a.toLowerCase().localeCompare(b.toLowerCase());
        });
        topologyIds[ag.groupName] = childArr;
      } else {
        topologyIds[ag.groupName] = [];
      }
    }
    const dataAG = this.database.buildFileTree(topologyIds, 0, 'accessgroup');
    this.database.dataChangeAG.next(dataAG);
  }

  /*
   * this funciton get the response from rest api for assigned nodes.
   */
  private updateTopologyNodes(node) {
    for (const obj in this._topologyService.topologyNodes) {
      if (this._topologyService.topologyNodes.hasOwnProperty(obj)) {
        const topologyData = this._topologyService.topologyNodes;
        if (topologyData[obj].length > 0) {
          for (let i = 0, len = this._topologyService.topologyNodes[obj].length; i < len; i++) {
            if (topologyData[obj].nodeId === node.nodeId) {
              topologyData[obj].name = node.name;
              topologyData[obj].shortName = node.shortName;
              topologyData[obj].description = node.description;
              if (node.type === 1000) {
                topologyData[obj].host = node.host;
              }
            }
          }
        }
      }
    }
  }

  private updateNodeNames(node) {
    for (const key in this._topologyService.topologyNodeNames) {
      if (parseInt(key, 10) === node.nodeId) {
        this._topologyService.topologyNodeNames[key].name = node.name;
        this._topologyService.topologyNodeNames[key].shortName = node.shortName;
        this._topologyService.topologyNodeNames[key].description = node.description;
        if (node.type === 1000) {
          this._topologyService.topologyNodeNames[key].host = node.host;
        }
      }
    }
  }

  private _getAssignedNodes(isForSearch?: boolean, newData?: any) {
    if (isForSearch) {
      this.setAssignedNodes(newData, true);
    } else {
      this.topInitialSub = this._topologyService.initialized.subscribe((value) => {
        if (value === 'nodesInitialized') {
          this.nodeNames = this._topologyService.topologyNodeNames;
          this.appService.nodeNames = this.nodeNames;
          this.appService.topologyNodes = this._topologyService.topologyNodes;
          this.setAssignedNodes(this._topologyService.topologyNodes);
        }
      });
    }
  }

  private setAssignedNodes(assigndata, isForSearch?: boolean) {
    const assignedNodesKeys = Object.keys(assigndata);
    let treeData;
    if (isForSearch && assignedNodesKeys.length > 0) {
      const firstKey = Object.keys(assigndata)[0];
      treeData = this._getflatDataToNested(assigndata, parseInt(firstKey, 10));
      this.setTreeData(treeData, assigndata);
    } else if (isForSearch && assignedNodesKeys.length === 0) {
      treeData = {};
      this.setTreeData(treeData, assigndata);
    } else {
      treeData = this._getflatDataToNested(assigndata);
      this.setTreeData(treeData, assigndata);
    }
  }

  private setTreeData(treeData, assigndata) {
    const topologyParentAssignedGroup = new Map<string, string[]>();
    for (let i = 0; i < treeData.length; i++) {
      topologyParentAssignedGroup[treeData[i].nodeId] = this._getAssignedNestedNodes(treeData[i].children);
    }
    const dataAssignedNodes = this.database.buildFileTree(topologyParentAssignedGroup, 0, 'assignednode');
    this.database.dataChangeAssigned.next(dataAssignedNodes);
    this.virtualDataNodes = assigndata;
  }

  /*
   * this function return array of nested item.
   * param arr
   * private
   */
  private _getAssignedNestedNodes(arr: ITopologyNodes []): Array<any> {
    const arrNodes = [];
    if (arr) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] && arr[i].children && arr[i].children.length > 0) {
          arrNodes[arr[i]['nodeId']] = this._getAssignedNestedNodes(arr[i].children);
        } else {
          arrNodes.push(arr[i]['nodeId']);
        }
      }
    }
    return arrNodes;
  }

  /*
   * this function build the nested objects from flat object.
   * param arr
   * param parentid
   */
  private _getflatDataToNested(arr: Array<any>, parentId?: number) {
    let output = [];
    const nodeIdsArr = Object.keys(arr);
    const len = nodeIdsArr.length;
    const lastKey = parseInt(nodeIdsArr[len - 1], 10);
    if (!parentId) {
      output.push(arr[0][0]);
      output = this.setParentChildren(output, arr, nodeIdsArr);
    } else {
      const nodesDetail = this._topologyService.topologyNodeNames;
      output.push(nodesDetail[parentId]);
      delete output[0].children;
      output[0].children = arr[parentId];
    }
    if (output[0].children && (output[0].children).length > 0) {
      this.setChildrenOfChildren(output[0], nodeIdsArr, arr, lastKey);
    }
    return output;
  }

  private setChildrenOfChildren(nodeObj, nodeIdsArr, arr, lastKey) {  // recursive function for fetching children of children
    for (const i in nodeObj.children) {
      if (nodeObj.children.hasOwnProperty(i) && !(nodeObj.children[i] > lastKey) &&
        this.checkIfChildren(nodeIdsArr, nodeObj.children[i].nodeId)) {
        nodeObj.children[i].children = arr[nodeObj.children[i].nodeId];
        this.setChildrenOfChildren(nodeObj.children[i], nodeIdsArr, arr, lastKey);
      }
    }
  }

  private setParentChildren(output, arr, nodeIdsArr) {  // set children of parent
    if (this.checkIfChildren(nodeIdsArr, output[0].nodeId)) {
      output[0].children = arr[output[0].nodeId];
    }
    return output;
  }

  private checkIfChildren(nodesArr, nodeId) {  // check if node has children
    return (nodesArr.indexOf(nodeId.toString()) > -1);
  }


  getLevel = (node: DragDropItemFlatNode) => node.level;

  isExpandable = (node: DragDropItemFlatNode) => node.expandable;

  getChildren = (node: DragDropItemNode): DragDropItemNode[] => node.children;

  hasChild = (_: number, _nodeData: DragDropItemFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: DragDropItemFlatNode) => _nodeData.item === '';

  /*
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: DragDropItemNode, level: number) => {
    if (node.dataSourceName === 'virtualgroup' && node.children && node.children.length > 0) {
      for (let i = 0, iLen = node.children.length; i < iLen; i++) {
        node.children[i].parentName = node.item;
      }
    }
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.item === node.item
      ? existingNode
      : new DragDropItemFlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = (node.children && node.children.length > 0);
    flatNode.dataSourceName = node.dataSourceName;
    if (flatNode.dataSourceName === 'virtualgroup' && flatNode.level === 1) {
      flatNode.parentName = node.parentName;
    }
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  handleDragStart(event, node) {
    if (!this.permissionToAccess) {
      return false;
    }
    event.dataTransfer.setData('text/plan', node.item);
    this.emptyItem.nativeElement.text = node.item;
    event.dataTransfer.setDragImage(this.emptyItem.nativeElement, 0, 0);
    this.dragNode = node;
    this.treeControl.collapse(node);
  }

  handleDragOver(event, node) {
    event.preventDefault();
    // Handle node expand
    if (node === this.dragNodeExpandOverNode) {
      if (this.dragNode !== node && !this.treeControl.isExpanded(node)) {
        if ((new Date().getTime() - this.dragNodeExpandOverTime) > this.dragNodeExpandOverWaitTimeMs) {
          this.treeControl.expand(node);
        }
      }
    } else {
      this.dragNodeExpandOverNode = node;
      this.dragNodeExpandOverTime = new Date().getTime();
    }

    // Handle drag area
    const percentageX = event.offsetX / event.target.clientWidth;
    const percentageY = event.offsetY / event.target.clientHeight;
    if (percentageY < 0.25) {
      this.dragNodeExpandOverArea = 'above';
    } else if (percentageY > 0.75) {
      this.dragNodeExpandOverArea = 'below';
    } else {
      this.dragNodeExpandOverArea = 'center';
    }
  }

  // handleDrop: called when a node is dropped , this is called when node of any type is dropped
  handleDrop(event, node) {
    if (!this.permissionToAccess) {
      return false;
    }
    let draggedNodeId;
    if (this.dragNode) {
      draggedNodeId = parseInt(this.flatNodeMap.get(this.dragNode).item, 10);
    }
    const nodeDetail = this._topologyService.topologyNodeNames[draggedNodeId];
    if (this.dragNode.dataSourceName === 'assignednode' && this.flatNodeMap.get(node).dataSourceName === 'accessgroup') {
      //Condition - Cannot add Company; Cannot add Site; Cannot add From Another Site
      const dropNode = this.flatNodeMap.get(node);
      const itemsInDrop = this._topologyService.virtualGroupNodes.find(ob => ob.groupName === dropNode.item)
      let itemsInDropVGNodeId;
      if (itemsInDrop) {
        itemsInDropVGNodeId = itemsInDrop.topologyNodeIds;
      }
      const dropTopologyGroupId = ( this._topologyService.virtualGroupNodes.find(ob => ob.groupName === dropNode.item)
        && this._topologyService.virtualGroupNodes.find(ob => ob.groupName === dropNode.item).topologyGroupId);
      const dropTopologyId = (this._topologyService.virtualGroupNodes.find(ob => ob.groupName === dropNode.item)
        && this._topologyService.virtualGroupNodes.find(ob => ob.groupName === dropNode.item).topologyId);
      const dropTopologyGroupName = (this._topologyService.virtualGroupNodes.find(ob => ob.groupName === dropNode.item)
        && this._topologyService.virtualGroupNodes.find(ob => ob.groupName === dropNode.item).groupName);
      const dropTopologyGroupType = (this._topologyService.virtualGroupNodes.find(ob => ob.groupName === dropNode.item)
        && this._topologyService.virtualGroupNodes.find(ob => ob.groupName === dropNode.item).groupType);
      for (const tNode in this._topologyService.topologyNodeNames) {
        if (this._topologyService.topologyNodeNames[tNode].nodeId === draggedNodeId) {
          if (!this._topologyService.topologyNodeNames[tNode].parentNodeId) {
            this.snackBar.open(this.translate.instant
            ('application.app.CASINO_MGR_LABELS.MESSAGE.CANNOT_ADD_COMP'), '', {
              duration: 3000,
              horizontalPosition: 'right',
              panelClass: 'snack__warn'
            });
            return false;
          }
          if (this.getTopologyTypeFromId(this._topologyService.topologyNodeNames[tNode].nodeId) === 150) {
            this.snackBar.open(this.translate.instant
            ('application.app.CASINO_MGR_LABELS.MESSAGE.CANNOT_ADD_SITE'), '', {
              duration: 3000,
              horizontalPosition: 'right',
              panelClass: 'snack__warn'
            });
            return false;
          }
          const temp = this._topologyService.virtualGroupNodes.find(ob => ob.groupName === dropNode.item);
          if ((temp && temp.topologyId) !== this.getSiteIdOfNodeId(draggedNodeId)) {
            this.snackBar.open(this.translate.instant
            ('application.app.CONFIGURATION_LABELS.CHIPSETS.MESSAGE.CANNOT_ADD'), '', {
              duration: 3000,
              horizontalPosition: 'right',
              panelClass: 'snack__warn'
            });
            return false;
          }

        }
      }
      //Condition - Cannot Add Treasury Nodes
      if (this.trsTypesNotAllowedInVg.indexOf(nodeDetail.type) > -1) {
        this.snackBar.open(this.translate.instant
        ('application.app.CASINO_MGR_LABELS.MESSAGE.CANNOT_ADD_TREASURY'), '', {
          duration: 3000,
          horizontalPosition: 'right',
          panelClass: 'snack__warn'
        });
        return false;
      }
      //Condition - Cannot Add Dissimilar Nodes; Location Already Exists
      if (itemsInDropVGNodeId.length > 0) {
        if (this.getTopologyTypeFromId(itemsInDropVGNodeId[0]) != this.getTopologyTypeFromId(draggedNodeId)) {
          this.snackBar.open(this.translate.instant
          ('application.app.CASINO_MGR_LABELS.MESSAGE.CANNOT_ADD_DISSIMILAR_TYPES'), '', {
            duration: 3000,
            horizontalPosition: 'right',
            panelClass: 'snack__warn'
          });
          return false;
        }

        if (itemsInDropVGNodeId.indexOf(draggedNodeId) > -1) {
          this.snackBar.open(this.translate.instant
          ('application.app.CASINO_MGR_LABELS.MESSAGE.LOCATION_ALREADY_EXISTS'), '', {
            duration: 3000,
            horizontalPosition: 'right',
            panelClass: 'snack__warn'
          });
          return false;
        }
      }

      const loggedInUserInfo = this.decodedTokenService.getDecodedJwtToken();
      const objToAddInVG = {
        'topologyGroupId': dropTopologyGroupId,
        'topologyId': dropTopologyId,
        'groupName': dropTopologyGroupName,
        'groupType': dropTopologyGroupType,
        'userId': loggedInUserInfo.userId,
        'topologyNodeIds': itemsInDropVGNodeId
      };

      objToAddInVG.topologyNodeIds.push(draggedNodeId);

      this.updateVGSub_2 = this._topologyService.updateVirtualGroup(dropTopologyGroupId, objToAddInVG).subscribe(data => {
        this.snackBar.open(this.translate.instant
        ('application.app.CASINO_MGR_LABELS.MESSAGE.LOCATION_ADDED'), '', {
          duration: 3000,
          horizontalPosition: 'right',
          panelClass: 'snack__warn'
        });
        this.refreshVirtaulGroup();
      });
    }

    this.handleDragEnd(event);
  }

  refreshVirtaulGroup() {
    if (!this._topologyService.topologyNodes) {
      this._setVirtualGroupNodes();
    } else {
      this.createVirtualGroupNodes(this._topologyService.virtualGroupNodes);
    }
  }

  getTopologyTypeFromId(nodeId) {
    for (let tNode in this._topologyService.topologyNodeNames) {
      if (this._topologyService.topologyNodeNames[tNode].nodeId === nodeId) {
        return this._topologyService.topologyNodeNames[tNode].type;
      }
    }
  }

  getTopologyNodeIdFromName(name) {
    for (const tNode in this._topologyService.topologyNodeNames) {
      if (this._topologyService.topologyNodeNames[tNode].name === name) {
        return this._topologyService.topologyNodeNames[tNode].nodeId;
      }
    }
  }

  getSiteIdOfNodeId(nodeId) {
    let item = this._topologyService.topologyNodeNames[Object.keys(this._topologyService.topologyNodeNames).find(key => this._topologyService.topologyNodeNames[key].nodeId === nodeId)].parentNodeId;
    let parentTypeId = this._topologyService.topologyNodeNames[Object.keys(this._topologyService.topologyNodeNames).find(key => this._topologyService.topologyNodeNames[key].nodeId === item)].type;
    let parentType = this._topologyService.topologyTypes.get(parentTypeId).topologyType;
    return parentType === 'SITE' ? item : this.getSiteIdOfNodeId(item);
  }

  // handleDragEnd: reset all the variables used for handling drag and drop
  handleDragEnd(event) {
    this.dragNode = null;
    this.dragNodeExpandOverNode = null;
    this.dragNodeExpandOverTime = 0;
  }

  // handleClick: called when a node is clicked within the topology tree of assigned nodes type
  handleClick(node, nodeData?: string) {
    if (node === 'areas') {
      this._topologyService.areasLabelClicked.next();
    } else if (node.dataSourceName === 'accessgroup') {     //Virtual Group
      if (node.level > 0) {
        return;
      } else if (node.level === 0 && !node.expandable) {
        this.snackBar.open(this.translate.instant
          ('application.app.CASINO_MGR_LABELS.MESSAGE.NO_LOCATION_FOUND'),
          '', {
            duration: 3000,
            horizontalPosition: 'right',
            panelClass: 'snack__success'
          });
      } else {
        this.currentClickedNode = {node: node, nodeDetails: nodeData};
        let topologyGroupId;
        topologyGroupId = this._topologyService.virtualGroupNodes.find(ob => ob.groupName === node.item).topologyGroupId;
        const objToSend = {
          nodeClicked: node,
          topologyData: this._topologyService.topologyNodes,
          nodeDetails: this._topologyService.topologyNodeNames,
          topologyGroupId: topologyGroupId
        };
        this.selectedNode = node.item;
        this._topologyService.nodeClicked.next(objToSend);
      }
    } else if (node['dataSourceName'] === 'assignednode' && node['expandable'] === undefined && nodeData['host'] !== undefined) {
      const jwtData = localStorage.getItem('jwt_cmr');
      const decodedJwt = this.jwtHelper.decodeToken(jwtData);
      const isPermitted = this.appService.hasPermissionOf('CASINO_MGR', 'ACCESS_TABLE_DASHBOARD');
      WDTSUtility.openTableDash(jwtData, decodedJwt, protocol, webServerDNS, nodeData, tableUIPort, webCasinoManagerTLSPort, tableUIProtocol, this.snackBar, this.translate, isPermitted);
    } else {
      this.currentClickedNode = {node: node, nodeDetails: nodeData};
      const typeVal = nodeData['type'];
      if (typeVal !== 1000) {
        const objToSend = {
          nodeClicked: node,
          topologyData: this._topologyService.topologyNodes,
          nodeDetails: this._topologyService.topologyNodeNames
        };
        this.selectedNode = node.item;
        this._topologyService.nodeClicked.next(objToSend);
      } else if (typeVal === 1000) {
        this._topologyService.terminalClicked.next();
      }
    }
  }


  // filterAssignedNodes: searches the text entered only within the assigned nodes
  filterAssignedNodes(keysArr) {
    const nodesData = this._topologyService.topologyNodes;
    let filteredAssignedNodes = {};
    for (const key in nodesData) {
      if (nodesData.hasOwnProperty(key) && nodesData[key].length > 0) {
        for (let j = 0, jLen = nodesData[key].length; j < jLen; j++) {
          const reqNodeId = nodesData[key][j].nodeId;
          if (keysArr.indexOf(reqNodeId) > -1) {
            filteredAssignedNodes[key] = nodesData[key];
          }
        }
      }
    }
    filteredAssignedNodes = this.rectifyFilteredObject(filteredAssignedNodes, keysArr);
    this._getAssignedNodes(true, filteredAssignedNodes);
  }

  // rectifyFilteredObject: returns only the searched nodes
  rectifyFilteredObject(obj, keys) {
    const data = obj;
    for (const val in data) {
      if (data.hasOwnProperty(val) && data[val].length > 0) {
        const tempArr = [];
        for (let i = 0, iLen = data[val].length; i < iLen; i++) {
          if (keys.indexOf(data[val][i].nodeId) > -1) {
            tempArr.push(data[val][i]);
            if (data[val][i].children && data[val][i].children.length > 0) {
              const arr = [];
              for (let j = 0, jLen = data[val][i].children.length; j < jLen; j++) {
                const child = data[val][i].children[j];
                if (keys.indexOf(child.nodeId) > -1) {
                  arr.push(child);
                }
              }
              data[val][i].children = arr;
            }
          }
        }
        data[val] = tempArr;
      }
    }
    return data;
  }


  isLastChild(node, nodeNames, accessNodes) {
    let arrLength;
    for (const i in nodeNames) {
      if (nodeNames.hasOwnProperty(i) && nodeNames[i].name === node.item) {
        for (let j = 0, jLen = accessNodes.length; j < jLen; j++) {
          const index = accessNodes[j].topologyNodeIds.indexOf(nodeNames[i].nodeId);
          if (index > -1) {
            arrLength = accessNodes[j].topologyNodeIds.length;
          }
        }
      }
    }
    return arrLength === 1;
  }

  // editVirtualGroupName : called when access group node name is changed
  editVirtualGroupName(node) {
    this.isEditable = true;
    this.nodeToEdit = node.item;
    this.virtualGroupForm.value.groupName = '';
    this.virtualGroupEditForm.value.groupParentName = '';
  }

  // getNodeName : saves the new name of the node to changedName variable
  getNodeName(value) {
    this.changedName = value;
  }


  // updateNodeName : updates the name of access group node
  updateNodeName(node, formName) {
    let newValue;
    if (formName === 'virtualGroupForm') {
      newValue = this.virtualGroupForm.value.groupName;
    } else {
      newValue = this.virtualGroupEditForm.value.groupParentName;
    }
    if (newValue && newValue !== this.nodeToEdit) {
      const accessNodes = this._topologyService.virtualGroupNodes;
      let prevName;
      for (let a = 0, aLen = accessNodes.length; a < aLen; a++) {
        if (node.item === accessNodes[a].groupName) {
          prevName = node.item;
          const accessObj = {
            groupName: newValue,
            groupType: accessNodes[a].groupType,
            topologyGroupId: accessNodes[a].topologyGroupId,
            topologyId: accessNodes[a].topologyId,
            topologyNodeIds: accessNodes[a].topologyNodeIds,
            userId: accessNodes[a].userId
          };
          this.updateVGSub_1 = this._topologyService.updateVirtualGroup(accessNodes[a].topologyGroupId, accessObj).subscribe((res) => {
            for (let b = 0, bLen = this._topologyService.virtualGroupNodes.length; b < bLen; b++) {
              if (this._topologyService.virtualGroupNodes[b].groupName === prevName) {
                this._topologyService.virtualGroupNodes[b].groupName = newValue;
                break;
              }
            }
            this.updateVirtualGroup();
            this.snackBar.open(this.translate.instant('application.app.common.labels.NAME_UPDATED'), '', {
              duration: 3000,
              horizontalPosition: 'right',
              panelClass: 'snack__success'
            });
          });
        }
      }
    }
    this.clearNodeName();
  }

  isDuplicateName(formName) {
    let value;
    if (formName === 'virtualGroupEditForm') {
      value = this.virtualGroupEditForm.value.groupParentName;
    } else {
      value = this.virtualGroupForm.value.groupName;
    }
    let isRedundant = false;
    const virtualGroups = this._topologyService.virtualGroupNodes;
    for (let i = 0, iLen = virtualGroups.length; i < iLen; i++) {
      if (WDTSUtility.equalIgnoreCase(virtualGroups[i].groupName, value, true, true) || value === this.nodeToEdit) {
        isRedundant = true;
      }
    }
    return isRedundant;
  }

  validateVirtualGroupName: ErrorStateMatcher = {
    isErrorState: (control: FormControl) => {
      this.isGroupNameInvalid = this.isDuplicateName('virtualGroupForm');
      return (this.isGroupNameInvalid);
    }
  };

  validateVirtualGroupEditName: ErrorStateMatcher = {
    isErrorState: (control: FormControl) => {
      this.isGroupNameInvalid = this.isDuplicateName('virtualGroupEditForm');
      return (this.isGroupNameInvalid);
    }
  };

  // clearNodeName : reset the variables changes while editing the access group name
  clearNodeName() {
    this.isEditable = false;
    this.nodeToEdit = '';
    this.virtualGroupForm = this.fb.group({});
    this.virtualGroupEditForm = this.fb.group({});
    this.addFormValidations();
  }

  // addToTopologyNodesArr :  adds the dragged assigned node to the topology tree of assigned nodes
  addToTopologyNodesArr(res, prevParentId?: number) {
    const draggedNode = res[0].nodeId;
    const newParentId = res[0].parentNodeId;
    const nodeKeys = Object.keys(this._topologyService.topologyNodes);
    const parentIdString = newParentId.toString();
    if (nodeKeys.indexOf(parentIdString) > -1) {
      this._topologyService.topologyNodes[newParentId].push(res[0]);
    } else {
      this._topologyService.topologyNodes[newParentId] = res;
    }
    this._topologyService.topologyNodeNames[draggedNode] = res[0];
    if (prevParentId) {
      this.deleteFromTopologyNodesArr(prevParentId, res);
    }
    this._topologyService.siteChildren = this._topologyService.getSiteChildren(this._topologyService.topologyNodeNames);
    this.setAssignedNodes(this._topologyService.topologyNodes);
  }

  // deleteFromTopologyNodesArr : updates the topology nodes data
  deleteFromTopologyNodesArr(prevParentId, res) {
    const node = res[0];
    const newArr = this._topologyService.topologyNodes[prevParentId];
    if (newArr.length === 1) {
      for (let i = 0, iLen = newArr.length; i < iLen; i++) {
        if (node.nodeId === newArr[i].nodeId) {
          newArr.splice(i, 1);
          break;
        }
      }
      if (newArr.length === 0) {
        delete this._topologyService.topologyNodes[prevParentId];
      }
    } else if (newArr.length > 1) {
      for (let i = 0, iLen = newArr.length; i < iLen; i++) {
        if (node.nodeId === newArr[i].nodeId) {
          newArr.splice(i, 1);
          break;
        }
      }
      this._topologyService.topologyNodes[prevParentId] = newArr;
    }
  }

  isTerminal(draggedNodeId) {
    let isNodeATerminal = false;
    for (const nodeObj in this._topologyService.topologyNodeNames) {
      if (this._topologyService.topologyNodeNames.hasOwnProperty(nodeObj) && parseInt(nodeObj, 10) === draggedNodeId) {
        if (this._topologyService.topologyNodeNames[nodeObj].type === 1000) {
          isNodeATerminal = true;
        }
      }
    }
    return isNodeATerminal;
  }

  nodeAlreadyExists(draggedNodeId, node) {
    let isNodePresent = false;
    for (let i = 0, iLen = this._topologyService.virtualGroupNodes.length; i < iLen; i++) {
      const accessNode = this._topologyService.virtualGroupNodes[i];
      if (accessNode.groupName === this.flatNodeMap.get(node).item) {
        if (accessNode.topologyNodeIds.indexOf(draggedNodeId) > -1) {
          isNodePresent = true;
        }
      }
    }
    return isNodePresent;
  }

  isTerminalOfPit(node): boolean {
    const parentID = this.nodeNames[node.item].parentNodeId;
    const parentType = this.nodeNames[parentID].type;
    return parentType === 1200;
  }

  handleRightClick(node, event) {
    this.selectedVGNode = node;
    if (this.selectedVGNode.level === 1) {
      const parentItemName = event.currentTarget.parentElement.previousElementSibling.id.split('hasChild_')[1];
      const id = this.getVirtualNodeIdFromName(parentItemName);
      this.selectedVGNode['parentItem'] = id;
    }
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = {'item': node};
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  getVirtualNodeIdFromName(parentItemName) {
    for (let i = 0; i < this._topologyService.virtualGroupNodes.length; i++) {
      if (parentItemName === this._topologyService.virtualGroupNodes[i]['groupName']) {
        return this._topologyService.virtualGroupNodes[i]['topologyGroupId'];
      }
    }
  }

  onRemoveVGItemClick() {
    let selItem;
    selItem = {};
    if (this.selectedVGNode.level === 1) {
      const nodeId = this.getTopologyNodeIdFromName(this.selectedVGNode.item);
      /*this.selectedVGNode.parentItem*/
      for (let i = 0; i < this._topologyService.virtualGroupNodes.length; i++) {
        if (this.selectedVGNode.parentItem === this._topologyService.virtualGroupNodes[i]['topologyGroupId']
          && this._topologyService.virtualGroupNodes[i].topologyNodeIds.length) {
          if (this._topologyService.virtualGroupNodes[i].topologyNodeIds.find(ob => ob === nodeId)) {
            selItem = this._topologyService.virtualGroupNodes[i];
          }
        }
      }
      let objToDelInVG;
      const loggedInUserInfo = this.decodedTokenService.getDecodedJwtToken();
      objToDelInVG = {};
      objToDelInVG = {
        'topologyGroupId': selItem.topologyGroupId,
        'topologyId': selItem.topologyId,
        'groupName': selItem.groupName,
        'groupType': selItem.groupType,
        'userId': loggedInUserInfo.userId,
        'topologyNodeIds': selItem.topologyNodeIds
      };

      let index = objToDelInVG.topologyNodeIds.indexOf(nodeId);
      if (index > -1) {
        objToDelInVG.topologyNodeIds.splice(index, 1);
      }
      this.updateVGSub = this._topologyService.updateVirtualGroup(objToDelInVG.topologyGroupId, objToDelInVG).subscribe(data => {
        this.snackBar.open(this.translate.instant
        ('application.app.CASINO_MGR_LABELS.MESSAGE.LOCATION_REMOVED'), '', {
          duration: 3000,
          horizontalPosition: 'right',
          panelClass: 'snack__warn'
        });
        this.updateVirtualGroup();
      });
    } else if (this.selectedVGNode.level === 0) {
      let vgToDelete;
      for (const vgItem in this._topologyService.virtualGroupNodes) {
        const item = this._topologyService.virtualGroupNodes[vgItem];
        if (item['groupName'] === this.selectedVGNode.item) {
          vgToDelete = item;
          break;
        }
      }
      const objToDelete = {
        topologyGroupId: vgToDelete.topologyGroupId
      };
      this.deleteVGSub = this._topologyService.deleteVirtualGroup(vgToDelete.topologyGroupId, objToDelete).subscribe(response => {
        for (const item in this._topologyService.virtualGroupNodes) {
          if (this._topologyService.virtualGroupNodes.hasOwnProperty(item) &&
            this._topologyService.virtualGroupNodes[item]['topologyGroupId'] === vgToDelete.topologyGroupId) {
            this._topologyService.virtualGroupNodes.splice(parseInt(item, 10), 1);
          }
        }
        this.snackBar.open(this.translate.instant
        ('application.app.CASINO_MGR_LABELS.MESSAGE.VIRTUAL_GROUP_REMOVED'), '', {
          duration: 3000,
          horizontalPosition: 'right',
          panelClass: 'snack__warn'
        });
        this.updateVirtualGroup();
      });
    }
  }

  isEditButtonEnabled(_node, _treeItem) {
    return (_treeItem.treegroup === 'virtualgroup' && _node.level === 0 && this.nodeToEdit !== _node.item && this.permissionToAccess );
  }

  isEditableFormEnabled(_node) {
    if (this.nodeToEdit === undefined) {
      return false;
    } else {
      return (this.isEditable && this.nodeToEdit === _node.item && _node.dataSourceName === 'accessgroup' && _node.level === 0);
    }
  }

  isButtonVisible(node, treeItem) {
    if (treeItem.treegroup !== 'assignednode') {
      if (node.dataSourceName !== 'accessgroup' ||
        ((node.dataSourceName === 'accessgroup') && this.nodeToEdit !== node.item)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  checkByTopologyPerm(node, treeItem) {
    if (treeItem.treegroup === 'assignednode') {
      if (node.level === 0) {
        return true;
      } else {
        return this.appService.checkPermissionByTopologyID(node.item.toString(), 'CASINO_MGR');
      }
    }

  }

  ngAfterViewChecked() {
    this.handleSubscribers();
  }

  ngAfterViewInit() {
    this.treeControl.expandAll();
  }

  ngOnDestroy() {
    if (this.nodeUpdated) {
      this.nodeUpdated.unsubscribe();
    }
    if (this.languageChanged) {
      this.languageChanged.unsubscribe();
    }
    if (this.nodeSubs) {
      this.nodeSubs.unsubscribe();
    }
    if (this.globlObjSub) {
      this.globlObjSub.unsubscribe();
    }
    if (this.initializedSub) {
      this.initializedSub.unsubscribe();
    }

    if (this.nodeUpdateSub) {
      this.nodeUpdateSub.unsubscribe();
    }
    if (this.dataChangeAssignedSub) {
      this.dataChangeAssignedSub.unsubscribe();
    }
    if (this.dataChangeUnassignedSub) {
      this.dataChangeUnassignedSub.unsubscribe();
    }

    if (this.updateVGSub_1) {
      this.updateVGSub_1.unsubscribe();
    }

    if (this.updateVGSub_2) {
      this.updateVGSub_2.unsubscribe();
    }
    if (this.getVGroupSubs) {
      this.getVGroupSubs.unsubscribe();
    }
    if (this.updateVGSub) {
      this.updateVGSub.unsubscribe();
    }

    if (this.dataChangeAGSub) {
      this.dataChangeAGSub.unsubscribe();
    }
    if (this.dataChnageAG_1) {
      this.dataChnageAG_1.unsubscribe();
    }
    if (this.topoNodeUnassignSub) {
      this.topoNodeUnassignSub.unsubscribe();
    }

    if (this.topoIniSub_1) {
      this.topoIniSub_1.unsubscribe();
    }
    if (this.topInitialSub) {
      this.topInitialSub.unsubscribe();
    }
    if (this.deleteVGSub) {
      this.deleteVGSub.unsubscribe();
    }
  }

  trackByIndex(index: number): number {
    return index;
  }

}
