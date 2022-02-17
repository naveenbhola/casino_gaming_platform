(function () {
    'use strict';


    angular
        .module('wdts.commonui.layout')
        .directive('wdtsAppSwitcher', wdtsAppSwitcher);

    function wdtsAppSwitcher() {
        var directive = {
            bindToController: true,
            controller: AppSwitcherController,
            controllerAs: 'appSwitcher',
            restrict: 'EA',
            scope: {
                currentAppCode: '@'
            },
            templateUrl: '../bower_components/wdts-common-ui/src/client/app/layout/app-switcher.html'
        };


        function AppSwitcherController($rootScope, $state, config, store, jwtHelper, userService, authService, configurationService) {
            var appSwitcher = this;
            var decodedJwt = {};

            appSwitcher.appMenuItems = [
                {
                    applicationCode: 'ALERTS',
                    key: 'alrt',
                    storeKey: 'jwt_alert',
                    name: 'Alerts',
                    permission: 'ACCESS_ALERTS_APP',
                    iconClass: 'icon-alert-landing',
                    translateLabel: 'application.app.common.labels.apps.ALERTS',
                    openUrl: config.openAlertsUrl,
                    isVisible: true,
                    isGreyed: false
                },
                {
                    applicationCode: 'CAM',
                    key: 'cam',
                    storeKey: 'jwt_cam',
                    name: 'CAM',
                    permission: 'ACCESS_CAM_APP',
                    iconClass: 'icon-cam-landing',
                    translateLabel: 'application.app.common.labels.apps.CAM',
                    openUrl: config.openCAMUrl,
                    isVisible: false
                },
                {
                    applicationCode: 'CASHIER',
                    key: 'cash',
                    storeKey: 'jwt_cash',
                    name: 'Cashier',
                    permission: 'ACCESS_CASHIER_APP',
                    iconClass: 'icon-cashier-landing',
                    translateLabel: 'application.app.common.labels.apps.CASHIER',
                    openUrl: config.openCashierUrl,
                    isVisible: false
                },
                {
                    applicationCode: 'CONFIGURATION',
                    key: 'conf',
                    storeKey: 'jwt_config',
                    name: 'Configuration',
                    permission: 'ACCESS_CONFIG_APP',
                    iconClass: 'icon-configurations-landing',
                    translateLabel: 'application.app.common.labels.apps.CONFIG',
                    openUrl: config.openCONUrl,
                    isVisible: true,
                    isGreyed: false
                },
                {
                    applicationCode: 'CASINO_MGR',
                    key: 'cmr',
                    storeKey: 'jwt_cmr',
                    name: 'Casino Manager',
                    permission: 'ACCESS_CASINO_MGR_APP',
                    iconClass: 'icon-casino-manager-landing',
                    translateLabel: 'application.app.common.labels.apps.CMGR',
                    openUrl: config.openCMUrl,
                    isVisible: true,
                    isGreyed: false
                },
                {
                    applicationCode: 'TREASURY_MGR',
                    key: 'trs',
                    storeKey: 'jwt_trs',
                    name: 'Treasury',
                    permission: 'ACCESS_TREASURY_MGR_APP',
                    iconClass: 'icon-treasury-manager',
                    translateLabel: 'application.app.common.labels.apps.TRSMGR',
                    openUrl: config.openTreasuryUrl,
                    isVisible: true,
                    isGreyed: false
                },
                {
                    applicationCode: 'PLAYER_DASH',
                    key: 'plr',
                    storeKey: 'jwt_plr',
                    name: 'Player Dashboard',
                    permission: 'ACCESS_PLAYER_DASH',
                    iconClass: 'icon-player-dash',
                    translateLabel: 'application.app.common.labels.apps.PLRDB',
                    openUrl: config.openPDUrl,
                    isVisible: true,
                    isGreyed: false
                },
                {
                    applicationCode: 'TABLE_DASH',
                    key: 'tbldash',
                    storeKey: 'jwt_tbldash',
                    name: 'Table Dashboard',
                    permission: 'ACCESS_TABLE_DASH',
                    iconClass: 'icon-table-dash',
                    translateLabel: 'application.app.common.labels.apps.TBLDB',
                    openUrl: config.openTDUrl,
                    isVisible: false
                },
                {
                    applicationCode: 'REPORTS',
                    key: 'rpt',
                    storeKey: 'jwt_rpt',
                    name: 'BI Application',
                    permission: 'ACCESS_REPORTS_APP',
                    iconClass: 'icon-chart',
                    translateLabel: 'application.app.common.labels.apps.BI',
                    openUrl: config.jasperUrl,
                    isVisible: true,
                    isGreyed: false
                }
            ];

            appSwitcher.menuRows = [[], []];

            appSwitcher.currentApp = {};
            appSwitcher.favoriteApp = {};
            appSwitcher.getAppByKey = getAppByKey;
            appSwitcher.callNewAppWithRefreshToken = callNewAppWithRefreshToken;
            appSwitcher.getRefreshedToken = getRefreshedToken;
            appSwitcher.openTab = openTab;
            appSwitcher.setFavoriteApp = setFavoriteApp;
            appSwitcher.isCBPTOn = false;

            init();

            function init () {
                divideMenuItems();

                appSwitcher.currentApp = getAppByKey(appSwitcher.currentAppCode);

                if(appSwitcher.currentApp && store.get(appSwitcher.currentApp.storeKey) != null) {
                    decodedJwt = store.get(appSwitcher.currentApp.storeKey);
                    decodedJwt = jwtHelper.decodeToken(decodedJwt);
                    appSwitcher.favoriteApp = decodedJwt.defaultApplication;
                }

                checkAppVisibility();
                checkCBPTStatus(); //Change for CN1-89 : Changes in Player Dashboard when CPBT is turned off
            }

            function divideMenuItems () {
                appSwitcher.appMenuItems.forEach(function(menuItem){
                    if(menuItem.applicationCode !== appSwitcher.currentAppCode && menuItem.isVisible){
                        if(appSwitcher.menuRows[0].length < 3){
                            appSwitcher.menuRows[0].push(menuItem);
                        }else{
                            appSwitcher.menuRows[1].push(menuItem);
                        }
                    }
                });
            }

            function checkAppVisibility(){
                appSwitcher.appMenuItems.forEach(function(menuItem){
                    if(decodedJwt.applications.indexOf(menuItem.applicationCode) == -1){
                        menuItem.isGreyed = true;
                    }
                });
            }

            function getAppByKey (key) {
                var app = null;
                appSwitcher.appMenuItems.some(function(menuItem){
                    if(menuItem.applicationCode === key){
                        app = menuItem;
                        return true;
                    }else{
                        return false;
                    }
                });
                return app;
            }

            function checkCBPTStatus() { //Change for CN1-89 : Changes in Player Dashboard when CPBT is turned off
                configurationService.isCBPTEnabled().then(function (data) {
                  appSwitcher.isCBPTOn = data;
                });
            }


            function callNewAppWithRefreshToken (arg) {
                if($rootScope.decodedJwt.applications.indexOf(arg) < 0){
                    return true;
                }

                appSwitcher.appMenuItems.some(function(menuItem){
                    if(menuItem.applicationCode === arg){
                        getRefreshedToken(menuItem.key);
                        return true;
                    }else{
                        return false;
                    }
                });
            }

            function getRefreshedToken(defApp){
                $rootScope.jwtUserName = decodedJwt.userId;
                if($rootScope.jwtUserName || decodedJwt.superuser == true){
                    var queryString = "client_id="+defApp;
                    authService.getRefreshedToken(queryString).then(function(data){
                        appSwitcher.jwt = data;
                        appSwitcher.openTab(defApp);
                    });
                }
            }

            function openTab (arg) {
                if(appSwitcher.jwt.access_token){
                    var accessToken;
                    var expiresIn = appSwitcher.jwt.expires_in;
                    var tokenType = appSwitcher.jwt.token_type;
                    var _scope = decodedJwt.scope[0];
                    accessToken = "#/access_token="+appSwitcher.jwt.access_token+"&token_type="+tokenType+"&expires_in="+expiresIn+"&scope="+ _scope;
                }
                else{
                    $state.reload();
                    return true;
                }

                appSwitcher.appMenuItems.some(function(menuItem){
                    if(menuItem.key === arg){
                        window.open(menuItem.openUrl+accessToken);
                        return true;
                    }else{
                        return false;
                    }
                });
            }

            function setFavoriteApp (event, appCode) {
                event.preventDefault();
                event.stopPropagation();

                if($rootScope.decodedJwt.applications.indexOf(appCode) < 0){
                    return true;
                }
                var obj =
                {
                    "userId": $rootScope.decodedJwt.userId,
                    "defaultApplication": {
                        "applicationCode":appCode
                    }
                };
                return userService.setFavoriteApp(obj,$rootScope.decodedJwt.userId).then(function(data){
                    appSwitcher.favoriteApp = appCode;
                });

            }


        }

        return directive;
    }
})();
